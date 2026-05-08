const DATA_URL = new URL("./data/reviews.json?v=8", import.meta.url);

const state = {
  records: [],
  filtered: [],
  activeIndex: 0,
  entityFilter: null,
};

const els = {
  countLabel: document.getElementById("countLabel"),
  searchInput: document.getElementById("searchInput"),
  yearFilter: document.getElementById("yearFilter"),
  results: document.getElementById("results"),
  articleView: document.getElementById("articleView"),
  article: document.getElementById("article"),
  homeView: document.getElementById("homeView"),
  aboutView: document.getElementById("aboutView"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  prevTop: document.getElementById("prevTop"),
  nextTop: document.getElementById("nextTop"),
  prevBottom: document.getElementById("prevBottom"),
  nextBottom: document.getElementById("nextBottom"),
  firstButton: document.getElementById("firstButton"),
  latestButton: document.getElementById("latestButton"),
};

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const ENTITY_TYPES = {
  productions: { label: "Production", values: (record) => record.production_title || record.productions || [] },
  companies: { label: "Company", values: (record) => record.company || [] },
  venues: { label: "Venue", values: (record) => record.venue || record.venues || [] },
  cities: { label: "City", values: (record) => record.city || record.cities || [] },
  directors: { label: "Director", values: (record) => record.roles?.director || [] },
  playwrights: { label: "Playwright", values: (record) => record.roles?.playwright || [] },
  actors: { label: "Actor", values: (record) => record.roles?.actors || [] },
  "composers-lyricists": { label: "Music", values: (record) => record.roles?.composer_lyricist || [] },
  "musical-directors": { label: "Music Director", values: (record) => record.roles?.musical_director || [] },
  choreographers: { label: "Choreographer", values: (record) => record.roles?.choreographer || [] },
  "set-designers": { label: "Set", values: (record) => record.roles?.set_designer || [] },
  "costume-designers": { label: "Costume", values: (record) => record.roles?.costume_designer || [] },
  "lighting-designers": { label: "Lighting", values: (record) => record.roles?.lighting_designer || [] },
  "sound-designers": { label: "Sound", values: (record) => record.roles?.sound_designer || [] },
  producers: { label: "Producer", values: (record) => record.roles?.producer || [] },
  dramaturgs: { label: "Dramaturg", values: (record) => record.roles?.dramaturg || [] },
  performers: { label: "Performer", values: (record) => record.roles?.performers || [] },
  musicians: { label: "Musician", values: (record) => record.roles?.musicians || [] },
  artists: { label: "Artist", values: (record) => record.roles?.artists || [] },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugText(record) {
  return [
    record.number,
    record.id,
    record.title,
    record.date,
    record.publication,
    record.section,
    record.category,
    ...(record.productions || []),
    ...(record.venues || []),
    ...(record.cities || []),
    ...(record.people || []),
    record.body,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function bodyHtml(body) {
  return escapeHtml(body)
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      if (paragraph === "* * *") return "<hr>";
      return `<p>${paragraph.replaceAll("\n", "<br>")}</p>`;
    })
    .join("");
}

function compactList(values, limit = 8) {
  const list = (values || []).filter(Boolean);
  if (!list.length) return "";
  const shown = list.slice(0, limit).map(escapeHtml).join(", ");
  const extra = list.length > limit ? ` +${list.length - limit}` : "";
  return `${shown}${extra}`;
}

function entitySlug(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "unknown"
  );
}

function articleHash(index) {
  return `#article:${index + 1}`;
}

function articleUrl(number) {
  return `./articles/${String(number).padStart(3, "0")}.html`;
}

function recordByNumber(number) {
  return state.records.findIndex((record) => record.number === number);
}

function entityValues(record, type) {
  return (ENTITY_TYPES[type]?.values(record) || []).filter(Boolean);
}

function findEntityLabel(type, slug) {
  for (const record of state.records) {
    const match = entityValues(record, type).find((value) => entitySlug(value) === slug);
    if (match) return match;
  }
  return slug.replace(/-/g, " ");
}

function matchesEntity(record) {
  if (!state.entityFilter) return true;
  return entityValues(record, state.entityFilter.type).some((value) => entitySlug(value) === state.entityFilter.slug);
}

function populateYears() {
  const years = [...new Set(state.records.map((record) => record.year).filter(Boolean))].sort(
    (a, b) => collator.compare(a, b)
  );
  els.yearFilter.innerHTML = `<option value="">All years</option>${years
    .map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`)
    .join("")}`;
}

function applyFilters() {
  const query = els.searchInput.value.trim().toLowerCase();
  const year = els.yearFilter.value;
  state.filtered = state.records.filter((record) => {
    if (!matchesEntity(record)) return false;
    if (year && record.year !== year) return false;
    if (!query) return true;
    return slugText(record).includes(query);
  });
  renderResults();
}

function renderResults() {
  if (state.entityFilter) {
    const typeLabel = ENTITY_TYPES[state.entityFilter.type]?.label || "Metadata";
    els.countLabel.textContent = `${state.filtered.length} articles · ${typeLabel}: ${state.entityFilter.label}`;
  } else {
    els.countLabel.textContent = `${state.records.length} draft articles`;
  }
  if (!state.filtered.length) {
    els.results.innerHTML = `<p class="empty">No matching articles.</p>`;
    return;
  }
  els.results.innerHTML = state.filtered
    .map(
      (record) => `
        <a class="result-row" href="${articleUrl(record.number)}">
          <span class="result-number">${record.number}</span>
          <span class="result-date">${escapeHtml(record.date || "")}</span>
          <span class="result-title">${escapeHtml(record.title)}</span>
          <span class="result-meta">
            ${escapeHtml(record.publication || "")}${record.section ? ` · ${escapeHtml(record.section)}` : ""}
          </span>
          <span class="result-productions">
            ${record.productions?.length ? compactList(record.productions, 3) : ""}
          </span>
          <span class="result-open" aria-hidden="true">→</span>
        </a>
      `
    )
    .join("");
}

function showList() {
  els.homeView.hidden = false;
  els.aboutView.hidden = true;
  els.articleView.hidden = true;
  document.getElementById("list").hidden = false;
  els.results.hidden = false;
}

function showAbout() {
  els.homeView.hidden = true;
  document.getElementById("list").hidden = true;
  els.results.hidden = true;
  els.articleView.hidden = true;
  els.aboutView.hidden = false;
}

function showArticle(index) {
  const clamped = Math.max(0, Math.min(index, state.records.length - 1));
  state.activeIndex = clamped;
  const record = state.records[clamped];
  els.homeView.hidden = true;
  els.aboutView.hidden = true;
  document.getElementById("list").hidden = true;
  els.results.hidden = true;
  els.articleView.hidden = false;

  const productions = compactList(record.productions, 12);
  const venues = compactList(record.venues, 10);
  const people = compactList(record.people, 14);
  els.article.innerHTML = `
    <div class="article-kicker">No. ${record.number} of ${state.records.length}</div>
    <h1>${escapeHtml(record.title)}</h1>
    <div class="article-meta">
      ${escapeHtml(record.author || "Robert Cushman")} · ${escapeHtml(record.publication || "")}
      ${record.section ? ` · ${escapeHtml(record.section)}` : ""}
      ${record.date ? ` · ${escapeHtml(record.date)}` : ""}
      ${record.category ? `<br>${escapeHtml(record.category)}` : ""}
    </div>
    <div class="article-body">${bodyHtml(record.body)}</div>
    <ul class="meta-list">
      ${productions ? `<li>Productions: ${productions}</li>` : ""}
      ${venues ? `<li>Venues: ${venues}</li>` : ""}
      ${people ? `<li>People: ${people}</li>` : ""}
      <li>Image ID: ${escapeHtml(record.id)}</li>
    </ul>
  `;
  const progress = state.records.length ? ((clamped + 1) / state.records.length) * 100 : 0;
  els.progressText.textContent = `Article ${clamped + 1} of ${state.records.length}`;
  els.progressFill.style.width = `${progress}%`;
  [els.prevTop, els.prevBottom].forEach((button) => (button.disabled = clamped === 0));
  [els.nextTop, els.nextBottom].forEach((button) => (button.disabled = clamped === state.records.length - 1));
  document.title = `${record.number}. ${record.title} · Cushman Collected UK Draft`;
  window.scrollTo(0, 0);
}

function navigate(delta) {
  const next = state.activeIndex + delta;
  if (next < 0 || next >= state.records.length) return;
  location.hash = articleHash(next);
}

function route() {
  const hash = location.hash || "#home";
  if (hash.startsWith("#entity:")) {
    const [, type, slug] = hash.split(":");
    if (ENTITY_TYPES[type] && slug) {
      state.entityFilter = { type, slug, label: findEntityLabel(type, slug) };
      showList();
      applyFilters();
      document.getElementById("list").scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
  }
  state.entityFilter = null;
  if (hash.startsWith("#article:")) {
    const number = Number(hash.split(":")[1]);
    const index = Number.isFinite(number) ? recordByNumber(number) : -1;
    showArticle(index >= 0 ? index : 0);
  } else if (hash === "#about") {
    showAbout();
  } else {
    showList();
    applyFilters();
  }
}

async function init() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
  const data = await response.json();
  state.records = data.records || [];
  state.filtered = state.records;
  populateYears();
  route();
}

els.searchInput.addEventListener("input", () => {
  state.entityFilter = null;
  applyFilters();
});
els.yearFilter.addEventListener("change", applyFilters);
els.prevTop.addEventListener("click", () => navigate(-1));
els.prevBottom.addEventListener("click", () => navigate(-1));
els.nextTop.addEventListener("click", () => navigate(1));
els.nextBottom.addEventListener("click", () => navigate(1));
els.firstButton.addEventListener("click", () => (location.href = articleUrl(1)));
els.latestButton.addEventListener("click", () => (location.href = articleUrl(state.records.length)));
window.addEventListener("hashchange", route);
window.addEventListener("popstate", route);

init().catch((error) => {
  els.countLabel.textContent = "Could not load draft data";
  els.results.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
});
