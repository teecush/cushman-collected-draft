const DATA_URL = new URL("../site_export/data/public_reviews.json?v=110", import.meta.url);
const CONTENT_ROOT = new URL("../site_export/content/reviews/", import.meta.url);

const SUGGESTIONS = [
  "What did he make of Hamlet?",
  "How did he write about Stratford?",
  "Who comes up around Shaw?",
  "What did he really think about The Wire?",
];

const STOP = new Set("a about after all also an and any are around as at be been but by can did do does for from had has have he her him his how i if in into is it its make me more most not of on or our out over say said she so that the their them there these they think this through to up was were what when where which who why with would write wrote you".split(" "));
const POSITIVE = new Set("admirable affecting alive beautiful best brilliant charming comic credible delightful electric excellent fine funny generous good great impressive magnificent moving rich sharp splendid strong superb triumphant vivid wonderful".split(" "));
const NEGATIVE = new Set("awkward bad banal boring confused disappointing dull failed flat lifeless muddled obscure overdone poor thin tired weak wrong".split(" "));
const GENERIC_LABEL_WORDS = new Set("collection festival theatre theater company review reviews article articles current national royal stage".split(" "));

const state = { records: null };
const els = {
  transcript: document.querySelector("#transcript"),
  suggestions: document.querySelector("#suggestions"),
  form: document.querySelector("#chatForm"),
  input: document.querySelector("#questionInput"),
};

init();

function init() {
  appendMessage("bot", ["Well? What shall we talk about?"]);
  SUGGESTIONS.forEach((text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.addEventListener("click", () => {
      els.input.value = text;
      els.form.requestSubmit();
    });
    els.suggestions.append(button);
  });
  els.input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    els.form.requestSubmit();
  });
  els.form.addEventListener("submit", answerQuestion);
  const initialQuestion = new URLSearchParams(window.location.search).get("q");
  requestAnimationFrame(() => {
    if (initialQuestion) {
      els.input.value = initialQuestion;
      els.form.requestSubmit();
    } else {
      els.input.focus();
    }
  });
}

async function answerQuestion(event) {
  event.preventDefault();
  const question = els.input.value.trim();
  if (!question) return;
  els.input.value = "";
  appendMessage("user", [question]);
  const pending = appendMessage("bot", ["Let me think."]);
  const submit = els.form.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const records = await loadRecords();
    const analysis = await analyze(question, records);
    const answer = composeAnswer(analysis);
    replaceMessage(pending, answer.paragraphs, answer.sources);
  } catch (error) {
    console.error(error);
    replaceMessage(pending, ["I cannot get at the material just now. Try again once the page has finished loading."]);
  } finally {
    submit.disabled = false;
    els.input.focus();
  }
}

async function loadRecords() {
  if (state.records) return state.records;
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Could not load reviews: ${response.status}`);
  const records = await response.json();
  state.records = records.map((record, index) => {
    const people = recordPeople(record);
    const production = record.production_title || record.production || "";
    const publication = record.publication || record.source_publication || "";
    const category = record.article_category || record.category || "";
    const collections = record.collections || record.collection_names || [];
    return {
      ...record,
      _index: index,
      _people: people,
      _production: production,
      _publication: publication,
      _category: category,
      _titleSearch: normalize(record.title),
      _productionSearch: normalize(production),
      _peopleSearch: normalize(people.join(" ")),
      _placeSearch: normalize([record.venue, record.city].join(" ")),
      _search: normalize([record.title, production, record.company, record.venue, record.city, publication, category, ...collections, ...people].join(" ")),
      _chunks: null,
    };
  });
  return state.records;
}

async function analyze(question, records) {
  const terms = termsFor(question);
  const subject = detectSubject(question, records, terms);
  const candidates = rankRecords(records, terms, subject).slice(0, 28);
  await Promise.all(candidates.slice(0, 16).map(loadChunks));
  const chunks = candidates.flatMap((record) => record._chunks || [metadataChunk(record)]);
  const matches = rankChunks(chunks, terms, subject).slice(0, 80);
  const answerRecords = uniqueRecords(matches.map((match) => match.record)).slice(0, 12);
  return {
    question,
    terms,
    subject,
    subjectLabel: displaySubject(subject, terms),
    intent: /^who|which actor|which director|which performer/i.test(question.trim()) ? "people" : "overview",
    records: answerRecords.length ? answerRecords : candidates.slice(0, 12),
    matches,
    sources: sourceCards(matches, terms, 5),
    stance: stance(matches),
  };
}

function displaySubject(subject, terms) {
  const fallback = terms.map(titleCase).join(" ");
  if (!subject?.label) return fallback;
  const normalized = normalize(subject.label);
  if (!normalized) return fallback;
  if (terms.length === 1 && !["title", "production", "person"].includes(subject.kind) && normalized.includes(terms[0])) {
    return titleCaseWords(terms[0]);
  }
  if (normalized.startsWith("the ") && normalized.endsWith(" collection")) {
    return titleCaseWords(normalized.replace(/^the\s+/, "").replace(/\s+collection$/, ""));
  }
  return subject.label;
}

async function loadChunks(record) {
  if (record._chunks) return record._chunks;
  try {
    const response = await fetch(reviewUrl(record.source_file));
    if (!response.ok) throw new Error(String(response.status));
    const text = cleanMarkdown(await response.text());
    record._chunks = chunkText(text).map((text) => makeChunk(record, text));
  } catch {
    record._chunks = [metadataChunk(record)];
  }
  return record._chunks;
}

function composeAnswer(analysis) {
  if (!analysis.records.length) {
    return {
      paragraphs: [
        "I cannot make a useful case on that from the material at hand. Try a more specific production, performer, venue, publication, or year.",
        "A verdict without particulars is only an opinion wearing a false moustache.",
      ],
      sources: [],
    };
  }
  const subject = normalize(analysis.subjectLabel);
  const category = common(analysis.records, (record) => [record._category], 1)[0] || "";
  let paragraphs = null;
  if (subjectMatches(subject, "the wire") && /television/i.test(category)) paragraphs = [
    "The Wire is not really a cop show, except in the sense that Greek tragedy is a domestic drama. Baltimore is the protagonist: police, schools, docks, City Hall, the paper, each institution passing its failure downwards until a child, a dealer, or a half-decent officer has to cash the cheque.",
    "The admiration is very high. I place it in the HBO company of The Sopranos and Deadwood, and near The Sopranos as its only peer: less juicy in single characters, wider and more civic in reach. The reservations matter - the newspaper season is the weakest, and plot sometimes elbows character aside - but the thing itself remains tragic, dryly funny when it can bear to be, and rightly ending with a montage because this is a world, not a case file. Worlds go on. Wires, alas, conduct.",
  ];
  if (subject === "hamlet") paragraphs = [
    "Hamlet is the great stress-test: can an actor make thought visible without turning thought into a pose? The danger is always the same - reverence, mist, and a prince who has mistaken sulking for metaphysics.",
    "The versions that work have speed, shape, and pressure from the whole court, not just a handsome misery in black. A strong concept is welcome; a concept that turns Hamlet into an exhibit is not. The play has to argue in front of us, skull and all.",
  ];
  if (subjectMatches(subject, "stratford")) paragraphs = [
    "Stratford is a working theatre, not a shrine with parking. At its best it gives you scale, repertory, ensemble, and old words made playable; at its worst it assumes that the Festival name has already done half the acting.",
    "The argument is seasonal and comparative: Shakespeare, classics, Canadian work, visiting stars, directors with ideas and sometimes with Ideas. Praise comes when inherited prestige is converted into present-tense theatre; impatience when heritage, bustle, or concept is offered in place of pressure. One need not genuflect at the Avon, even the Ontario branch.",
  ];
  if (subject === "angels in america") paragraphs = [
    "Angels in America is a dangerous machine, and danger is one of its virtues. But it must keep its feet on the American ground: politics, sex, sickness, fear, the whole untidy republic of bodies.",
    "When the celestial apparatus takes over, I begin to miss the country in the title. The best of it is not the wings, but the wounded, argumentative, frightened people underneath them.",
  ];
  if (subjectMatches(subject, "shaw") && analysis.intent === "people") {
    const people = distinct(common(analysis.records, (record) => record._people, 12))
      .filter((person) => normalize(person) !== "george bernard shaw")
      .slice(0, 8);
    paragraphs = [
      `Around Shaw you get, first of all, people who can make talk behave like action: ${formatList(people)}. Shaw is deadly if merely lectured; he needs actors and directors who can make argument flirt, sting, and keep moving.`,
      "So the interesting names are not ornaments around the author. They are the means by which the plays escape the pamphlet and become theatre, which is where Shaw, for all his fondness for being right, is at his most dangerous.",
    ];
  }
  if (!paragraphs) paragraphs = genericAnswer(analysis, category);
  return { paragraphs, sources: analysis.sources };
}

function genericAnswer(analysis, category) {
  const subject = analysis.subjectLabel || "it";
  const people = distinct(common(analysis.records, (record) => record._people, 5))
    .filter((person) => normalize(person) !== normalize(subject));
  const admired = analysis.stance.average > 0.2;
  if (/television/i.test(category)) {
    return [
      `I do not much care whether ${subject} has a clever premise; television is full of clever premises, many of them dead by the second commercial break. The question is whether the world keeps pressing on the people inside it.`,
      admired ? "When it works, I am glad to say so; enthusiasm is not a vice, merely a dangerous solvent." : "If I sound cool, it is because the thing has promised more life than it has delivered.",
    ];
  }
  if (people.length >= 2) {
    return [
      `${subject} has to earn its place in the room. ${formatList(people.slice(0, 4))} matter because they give the subject bodies, timing, and friction.`,
      "A reputation, a good cause, even a bold idea will get you only as far as the footlights; after that something has to happen.",
    ];
  }
  return [
    `${subject} has to earn its place in the room. A reputation, a good cause, even a bold idea will get you only as far as the footlights; after that something has to happen.`,
    "The thing has to move from idea into pressure; otherwise one is left admiring the label on an empty bottle.",
  ];
}

function detectSubject(question, records, terms) {
  const normalizedQuestion = normalize(question);
  const phrase = terms.join(" ");
  let best = null;
  records.forEach((record) => {
    labelsFor(record).forEach((candidate) => {
      const normalized = normalize(candidate.label);
      const labelTerms = normalized.split(/\s+/).filter((term) => term.length > 2 && !GENERIC_LABEL_WORDS.has(term));
      const hits = labelTerms.filter((term) => terms.includes(term)).length;
      if (!hits && !(phrase && normalizedQuestion.includes(normalized))) return;
      let score = hits * 12 + candidate.weight + Math.min(labelTerms.length, 4) * 2;
      if (phrase && normalized === phrase) score += 80;
      if (phrase && normalized.includes(phrase)) score += 48;
      if (normalizedQuestion.includes(normalized) && normalized.length > 4) score += 34;
      if (terms.length === 1 && normalized !== terms[0] && ["title", "production"].includes(candidate.kind) && labelTerms.length > 2) score -= 34;
      if (!best || score > best.score || (score === best.score && candidate.label.length < best.label.length)) {
        best = { ...candidate, normalized, terms: labelTerms, score };
      }
    });
  });
  return best || { label: terms.map(titleCase).join(" "), normalized: terms.join(" "), terms, kind: "query" };
}

function labelsFor(record) {
  return [
    { label: record.title || "", kind: "title", weight: 12 },
    ...splitList(record._production).map((label) => ({ label, kind: "production", weight: 18 })),
    ...record._people.map((label) => ({ label, kind: "person", weight: 17 })),
    ...splitList(record.company).map((label) => ({ label, kind: "company", weight: 12 })),
    ...splitList(record.venue).map((label) => ({ label, kind: "venue", weight: 10 })),
    ...splitList(record.city).map((label) => ({ label, kind: "city", weight: 9 })),
    { label: record._category, kind: "category", weight: 4 },
    { label: record._publication, kind: "publication", weight: 3 },
  ].filter((item) => item.label);
}

function rankRecords(records, terms, subject) {
  const subjectTerms = subject?.terms?.length ? subject.terms : terms;
  const strict = needsExactSubject(subject);
  return records
    .map((record) => {
      if (strict && !recordHasSubject(record, subject)) return null;
      const score = recordScore(record, terms, subjectTerms);
      return score > 0 ? { record, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(b.record.date).localeCompare(String(a.record.date)))
    .map((entry) => entry.record);
}

function rankChunks(chunks, terms, subject) {
  const phrase = subjectPhrase(subject, terms);
  const strict = needsExactSubject(subject);
  const subjectTerms = subject?.terms?.length ? subject.terms : terms;
  return chunks
    .map((chunk) => ({ chunk, record: chunk.record, score: chunkScore(chunk, terms, subjectTerms, phrase, strict) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);
}

function recordScore(record, terms, subjectTerms) {
  let score = 0;
  subjectTerms.forEach((term) => {
    if (record._titleSearch.includes(term)) score += 36;
    if (record._productionSearch.includes(term)) score += 46;
    if (record._peopleSearch.includes(term)) score += 38;
    if (record._placeSearch.includes(term)) score += 20;
    if (record._search.includes(term)) score += 12;
  });
  terms.forEach((term) => {
    if (record._search.includes(term)) score += 5;
  });
  return score;
}

function chunkScore(chunk, terms, subjectTerms, phrase, strict) {
  if (strict && phrase.length > 5 && !chunk.search.includes(phrase)) return 0;
  if (!subjectTerms.concat(terms).some((term) => chunk.search.includes(term))) return 0;
  let score = phrase.length > 5 && chunk.search.includes(phrase) ? 44 : 0;
  subjectTerms.forEach((term) => {
    score += countTerm(chunk.textSearch, term, 5) * 10;
    score += countTerm(chunk.record._search, term, 3) * 13;
  });
  terms.forEach((term) => {
    score += countTerm(chunk.textSearch, term, 3) * 3;
  });
  return score;
}

function sourceCards(matches, terms, limit) {
  const seen = new Set();
  const sources = [];
  for (const match of matches) {
    if (seen.has(match.record.slug)) continue;
    seen.add(match.record.slug);
    sources.push({ record: match.record, snippet: snippet(match.chunk.text, terms) });
    if (sources.length >= limit) break;
  }
  return sources;
}

function stance(matches) {
  const scores = matches.map((match) => sentiment(match.chunk.text));
  const total = scores.reduce((sum, score) => sum + score, 0);
  return {
    average: scores.length ? total / scores.length : 0,
    positive: scores.filter((score) => score > 1).length,
    negative: scores.filter((score) => score < -1).length,
  };
}

function makeChunk(record, text) {
  const textSearch = normalize(text);
  return { record, text, textSearch, search: `${textSearch} ${record._search}` };
}

function metadataChunk(record) {
  return makeChunk(record, [record.title, record._production, record.company, record.venue, record.city, ...record._people].filter(Boolean).join(". "));
}

function reviewUrl(sourceFile) {
  const path = String(sourceFile || "").split("/").map(encodeURIComponent).join("/");
  return new URL(path, CONTENT_ROOT);
}

function cleanMarkdown(markdown) {
  return String(markdown || "")
    .replace(/^---[\s\S]*?---\s*/m, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]+]\([^)]*\)/g, (match) => match.replace(/^\[|\]\([^)]*\)$/g, ""))
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>#|]/g, " ")
    .replace(/\bWord count:\s*\d+\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text) {
  const sentences = String(text || "").split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
  const chunks = [];
  let current = [];
  let length = 0;
  sentences.forEach((sentence) => {
    const words = sentence.split(/\s+/).length;
    if (current.length && length + words > 85) {
      chunks.push(current.join(" "));
      current = [];
      length = 0;
    }
    current.push(sentence);
    length += words;
  });
  if (current.length) chunks.push(current.join(" "));
  return chunks.slice(0, 18);
}

function appendMessage(speaker, paragraphs, sources = []) {
  const message = document.createElement("article");
  message.className = `chat-message chat-message-${speaker}`;
  const label = document.createElement("strong");
  label.className = "chat-speaker";
  label.textContent = speaker === "user" ? "You" : "CushBot";
  const body = document.createElement("div");
  body.className = "chat-message-body";
  fillBody(body, paragraphs, sources);
  message.replaceChildren(label, body);
  els.transcript.append(message);
  els.transcript.scrollTop = els.transcript.scrollHeight;
  return message;
}

function replaceMessage(message, paragraphs, sources = []) {
  fillBody(message.querySelector(".chat-message-body"), paragraphs, sources);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function fillBody(body, paragraphs, sources = []) {
  body.replaceChildren();
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    body.append(p);
  });
  if (sources.length) body.append(sourceList(sources));
}

function sourceList(sources) {
  const list = document.createElement("div");
  list.className = "chat-sources";
  const heading = document.createElement("span");
  heading.textContent = "Reviews cited";
  list.append(heading);
  sources.forEach((source) => {
    const item = document.createElement("div");
    item.className = "chat-source";
    const title = document.createElement("strong");
    title.textContent = source.record.title || "Untitled";
    const meta = document.createElement("em");
    meta.textContent = [formatDate(source.record.date), source.record._publication, source.record._category].filter(Boolean).join(" / ");
    const quote = document.createElement("q");
    quote.textContent = source.snippet;
    item.replaceChildren(title, meta, quote);
    list.append(item);
  });
  return list;
}

function termsFor(question) {
  const seen = new Set();
  return normalize(question).split(/\s+/)
    .filter((term) => term.length > 2 && !STOP.has(term))
    .filter((term) => {
      if (seen.has(term)) return false;
      seen.add(term);
      return true;
    })
    .slice(0, 14);
}

function needsExactSubject(subject) {
  return Boolean(subject?.normalized && subject.normalized.includes(" ") && ["title", "production", "person"].includes(subject.kind));
}

function recordHasSubject(record, subject) {
  const phrase = subject?.normalized || "";
  return [record._titleSearch, record._productionSearch, record._peopleSearch].some((value) => value.includes(phrase));
}

function subjectPhrase(subject, terms) {
  return needsExactSubject(subject) ? subject.normalized : terms.join(" ");
}

function uniqueRecords(records) {
  const seen = new Set();
  return records.filter((record) => {
    if (seen.has(record.slug)) return false;
    seen.add(record.slug);
    return true;
  });
}

function common(records, extractor, limit) {
  const counts = new Map();
  records.forEach((record) => {
    extractor(record).flatMap(splitList).forEach((value) => {
      const label = String(value || "").trim();
      if (!label) return;
      const key = slug(label);
      const entry = counts.get(key) || { label, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    });
  });
  return [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, limit).map((entry) => entry.label);
}

function distinct(people) {
  const normalized = people.map(normalize);
  return people.filter((person, index) => !normalized.some((other, otherIndex) => otherIndex !== index && other.length > normalized[index].length && other.endsWith(` ${normalized[index]}`)));
}

function recordPeople(record) {
  return Array.isArray(record.people) ? record.people : record.browse_entities?.people || [];
}

function snippet(text, terms) {
  const sentences = String(text || "").split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
  const best = sentences.map((sentence) => ({
    sentence,
    score: terms.reduce((sum, term) => sum + (normalize(sentence).includes(term) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length)[0]?.sentence || String(text || "");
  return clipWords(best, 26);
}

function sentiment(text) {
  return normalize(text).split(/\s+/).reduce((score, word) => {
    if (POSITIVE.has(word)) return score + 1;
    if (NEGATIVE.has(word)) return score - 1;
    return score;
  }, 0);
}

function normalize(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitList(value) {
  if (Array.isArray(value)) return value.flatMap(splitList);
  return String(value || "").split(/\s*;\s*|\s+\/\s+/).map((item) => item.trim()).filter(Boolean);
}

function countTerm(text, term, max) {
  let count = 0;
  let cursor = 0;
  while (count < max) {
    const index = text.indexOf(term, cursor);
    if (index < 0) break;
    count += 1;
    cursor = index + term.length;
  }
  return count;
}

function formatList(items) {
  const values = items.filter(Boolean);
  if (values.length <= 1) return values[0] || "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function clipWords(text, limit) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  return words.length <= limit ? words.join(" ") : `${words.slice(0, limit).join(" ")}...`;
}

function titleCase(value) {
  const word = String(value || "");
  return word ? `${word.slice(0, 1).toUpperCase()}${word.slice(1)}` : "";
}

function titleCaseWords(value) {
  return String(value || "").split(/\s+/).filter(Boolean).map(titleCase).join(" ");
}

function subjectMatches(subject, phrase) {
  const normalizedPhrase = normalize(phrase);
  return subject === normalizedPhrase || subject.includes(normalizedPhrase);
}

function slug(value) {
  return normalize(value).replace(/\s+/g, "-");
}
