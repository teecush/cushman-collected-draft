const DATA_URL = new URL("./data/reviews.json?v=1", import.meta.url);

const state = {
  records: [],
  filtered: [],
  activeIndex: 0,
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

function articleHash(index) {
  return `#article:${index + 1}`;
}

function recordByNumber(number) {
  return state.records.findIndex((record) => record.number === number);
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
    if (year && record.year !== year) return false;
    if (!query) return true;
    return slugText(record).includes(query);
  });
  renderResults();
}

function renderResults() {
  els.countLabel.textContent = `${state.records.length} draft articles`;
  if (!state.filtered.length) {
    els.results.innerHTML = `<p class="empty">No matching articles.</p>`;
    return;
  }
  els.results.innerHTML = state.filtered
    .map(
      (record) => `
        <a class="result-card" href="${articleHash(record.number - 1)}">
          <span class="result-number">No. ${record.number} · ${escapeHtml(record.date || "")}</span>
          <h2>${escapeHtml(record.title)}</h2>
          <div class="result-meta">
            ${escapeHtml(record.publication || "")}${record.section ? ` · ${escapeHtml(record.section)}` : ""}
            ${record.productions?.length ? `<br>${compactList(record.productions, 4)}` : ""}
          </div>
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
  window.scrollTo({ top: 0, behavior: "instant" });
}

function navigate(delta) {
  const next = state.activeIndex + delta;
  if (next < 0 || next >= state.records.length) return;
  location.hash = articleHash(next);
}

function route() {
  const hash = location.hash || "#home";
  if (hash.startsWith("#article:")) {
    const number = Number(hash.split(":")[1]);
    const index = Number.isFinite(number) ? recordByNumber(number) : -1;
    showArticle(index >= 0 ? index : 0);
  } else if (hash === "#about") {
    showAbout();
  } else {
    showList();
  }
}

async function init() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
  const data = await response.json();
  state.records = data.records || [];
  state.filtered = state.records;
  populateYears();
  applyFilters();
  route();
}

els.searchInput.addEventListener("input", applyFilters);
els.yearFilter.addEventListener("change", applyFilters);
els.prevTop.addEventListener("click", () => navigate(-1));
els.prevBottom.addEventListener("click", () => navigate(-1));
els.nextTop.addEventListener("click", () => navigate(1));
els.nextBottom.addEventListener("click", () => navigate(1));
els.firstButton.addEventListener("click", () => (location.hash = articleHash(0)));
els.latestButton.addEventListener("click", () => (location.hash = articleHash(state.records.length - 1)));
window.addEventListener("hashchange", route);

init().catch((error) => {
  els.countLabel.textContent = "Could not load draft data";
  els.results.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
});
