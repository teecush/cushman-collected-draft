const DATA_URL = new URL("../site_export/data/public_reviews.json?v=44", import.meta.url);
const CONTENT_ROOT = new URL("../site_export/content/reviews/", import.meta.url);
const PAGE_SIZE = 36;
const SHAKESPEARE_COLLECTION = "The Shakespeare Collection";
const SHAKESPEARE_DERIVED_COLLECTIONS = ["Riffs on Shakespeare", "Thoughts on Shakespeare"];
const SHAKESPEARE_GROUPS = [
  {
    value: "",
    label: "All Shakespeare",
    description: "Everything in the Shakespeare pathway.",
  },
  {
    value: "plays",
    label: "Play Reviews",
    description: "Reviews of productions of Shakespeare plays.",
  },
  {
    value: "thoughts",
    label: "Thoughts & Context",
    description: "Think pieces and Shakespeare-heavy critical writing.",
  },
  {
    value: "adaptations",
    label: "Adaptations & Riffs",
    description: "Adaptations, offshoots, and Shakespeare-inspired work.",
  },
];
const PUBLIC_COLLECTION_FILTERS = [
  "The Canadian Collection",
  SHAKESPEARE_COLLECTION,
  "The Stratford Collection",
  "The Shaw Collection",
  "Short Takes",
];
const SECONDARY_COLLECTION_TILES = [
  "The Canadian Collection",
  "The Stratford Collection",
  "The Shaw Collection",
  "Short Takes",
];
const ENTITY_TYPES = [
  { key: "people", label: "People", singular: "Person" },
  { key: "productions", label: "Productions", singular: "Production" },
  { key: "companies", label: "Companies", singular: "Company" },
  { key: "venues", label: "Venues", singular: "Venue" },
  { key: "cities", label: "Cities", singular: "City" },
  { key: "publications", label: "Publications", singular: "Publication" },
  { key: "categories", label: "Categories", singular: "Category" },
  { key: "collections", label: "Collections", singular: "Collection" },
  { key: "directors", label: "Directors", singular: "Director", role: "director" },
  { key: "actors", label: "Actors", singular: "Actor", role: "actors" },
  { key: "playwrights", label: "Playwrights", singular: "Playwright", role: "playwright" },
  { key: "composers-lyricists", label: "Composers & Lyricists", singular: "Composer/Lyricist", role: "composer_lyricist" },
  { key: "musical-directors", label: "Musical Directors", singular: "Musical Director", role: "musical_director" },
  { key: "choreographers", label: "Choreographers", singular: "Choreographer", role: "choreographer" },
  { key: "set-designers", label: "Set Designers", singular: "Set Designer", role: "set_designer" },
  { key: "costume-designers", label: "Costume Designers", singular: "Costume Designer", role: "costume_designer" },
  { key: "lighting-designers", label: "Lighting Designers", singular: "Lighting Designer", role: "lighting_designer" },
  { key: "sound-designers", label: "Sound Designers", singular: "Sound Designer", role: "sound_designer" },
  { key: "musicians", label: "Musicians", singular: "Musician", role: "musicians" },
  { key: "performers", label: "Performers", singular: "Performer", role: "performers" },
  { key: "producers", label: "Producers", singular: "Producer", role: "producer" },
  { key: "dramaturgs", label: "Dramaturgs", singular: "Dramaturg", role: "dramaturg" },
  { key: "fight-directors", label: "Fight Directors", singular: "Fight Director", role: "fight_director" },
];

const TYPE_GROUPS = [
  {
    value: "theatre",
    label: "Theatre",
    categories: ["Theatre Review", "Theatre Preview", "Theatre News", "Events Listing", "Awards Coverage"],
  },
  {
    value: "musical-theatre",
    label: "Musical Theatre",
    categories: ["Musical Review"],
  },
  {
    value: "television",
    label: "Television",
    categories: ["Television Review"],
  },
  {
    value: "music-concerts",
    label: "Music & Concerts",
    categories: ["Music Review", "Concert Review"],
  },
  {
    value: "books-essays",
    label: "Books & Essays",
    categories: ["Book Review", "Opinion Piece", "Year in Review"],
  },
  {
    value: "people",
    label: "People",
    categories: ["Profile", "Obituary"],
  },
  {
    value: "other-arts",
    label: "Other Arts",
    categories: ["Comedy Review", "Film Review", "Opera Review", "Dance Review", "Circus Review"],
  },
  {
    value: "site-notes",
    label: "Site Notes",
    categories: ["Correction"],
  },
];

const TYPE_BY_CATEGORY = new Map(
  TYPE_GROUPS.flatMap((group) => group.categories.map((category) => [category, group]))
);

const browseTiles = {
  types: [
    "Theatre",
    "Shakespeare",
    "Musical Theatre",
    "Television",
    "Music & Concerts",
    "Books & Essays",
    "People",
    "Other Arts",
    "Site Notes",
  ],
  shakespeare: [
    "All's Well That Ends Well",
    "As You Like It",
    "The Comedy of Errors",
    "Love's Labour's Lost",
    "Measure for Measure",
    "The Merchant of Venice",
    "The Merry Wives of Windsor",
    "A Midsummer Night's Dream",
    "Much Ado About Nothing",
    "Pericles",
    "The Taming of the Shrew",
    "The Tempest",
    "Twelfth Night",
    "Two Gentlemen of Verona",
    "The Two Noble Kinsmen",
    "The Winter's Tale",
    "Antony & Cleopatra",
    "Coriolanus",
    "Cymbeline",
    "Julius Caesar",
    "King Lear",
    "Macbeth",
    "Othello",
    "Romeo & Juliet",
    "Hamlet",
    "Timon of Athens",
    "Titus Andronicus",
    "Troilus & Cressida",
    "Henry IV",
    "Henry V",
    "Henry VI",
    "Henry VIII",
    "King John",
    "Richard II",
    "Richard III",
    "Thoughts on Shakespeare",
    "Riffs on Shakespeare",
  ],
  collections: [
    "The Canadian Collection",
    "The Stratford Collection",
    "The Shaw Collection",
    "The Musical Collection",
    "The Television Collection",
    "Short Takes",
  ],
};

const tileImages = {
  "All's Well That Ends Well": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918692589-8CCNFAH8EJUZKMJUDJ5U/All%27s+Well.png?format=750w",
  "As You Like It": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918692852-NNKS7GYGSIYWBCWTFAK5/As+You+Like+It.png?format=750w",
  "The Comedy of Errors": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918704082-30WHNLUPP6BK0PAJBW80/Comedy+of+Errors.png?format=750w",
  "Love's Labour's Lost": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918705247-VXQS50N4EV51NKM9PAOA/Love%27s+Labour%27s+Lost.png?format=750w",
  "Measure for Measure": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918715619-U5ZX1GET6G62IEY5ZS9Z/Measure+for+Measure.png?format=750w",
  "The Merchant of Venice": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918720207-PSRUB1V0ZYINVYEKDX5K/Merchant+of+Venice.png?format=750w",
  "The Merry Wives of Windsor": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918728171-6D1T3G00JWZQ8CF8U3IA/Merry+Wives.png?format=750w",
  "A Midsummer Night's Dream": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918731096-CGVKOZ4BMI6SNHOQQ4UV/Midsummer.png?format=750w",
  "Much Ado About Nothing": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918740743-7T2G4J9Z9J3ZXL365TV7/Much+Ado.png?format=750w",
  Pericles: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918744074-5R3FJ63BL8KEP3QO4UCT/Pericles.png?format=750w",
  "The Taming of the Shrew": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918752214-UVMHXLS165GQ51X0R5L8/Taming.png?format=750w",
  "The Tempest": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918756416-ZJDLJGMUOG6HN5KDQF1N/Tempest.png?format=750w",
  "Twelfth Night": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918765421-Q5CE9DPO74VWVOWP3GWR/Twelfth+Night.png?format=750w",
  "Two Gentlemen of Verona": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918767950-GK3R8N49KBKH14ID0VTZ/Two+Gentleman.png?format=750w",
  "The Two Noble Kinsmen": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918780500-K6CXGC6BUU6FQMM8IUAK/Two+Noble.png?format=750w",
  "The Winter's Tale": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918780811-RYV5UBHEFTW5U8ZLM0JC/Winter%27s+Tale.png?format=750w",
  "Antony & Cleopatra": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918792163-D0BEF4LRYEFOFBG48E1L/Antony+%26+Cleopatra.png?format=750w",
  Coriolanus: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918793484-S5FF5MG07MX5QCBJ1Y9N/Coriolanus.png?format=750w",
  Cymbeline: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918804503-YUN7M5ANHF7GM376PJER/Cymbeline.png?format=750w",
  "Julius Caesar": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918816978-GR2Q3HBH95JQJGECGMVO/Julius+Caesar.png?format=750w",
  "King Lear": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918818992-GEZHNNC3QVUY751QFM7I/King+Lear.png?format=750w",
  Macbeth: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918829561-NDU0JAUAEOP2DM9ERDYL/Macbeth.png?format=750w",
  Othello: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918831738-LN949S2N55PIE7FXFTCE/Othello.png?format=750w",
  "Romeo & Juliet": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918842053-3W7KR0JJUJREHTDJSMKW/Romeo+%26+Juliet.png?format=750w",
  Hamlet: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918806323-6HW95M5V0RDGR8GPN9VR/Hamlet.png?format=750w",
  "Timon of Athens": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918844472-LQKEKN7ZAAMY7CR86B4P/Timon.png?format=750w",
  "Titus Andronicus": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918854274-QO6COSNU8IIO3SSMVS0Q/Titus.png?format=750w",
  "Troilus & Cressida": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918856888-V09OIA9DCYOO02SZEP4K/Troilus+%26+Cressida.png?format=750w",
  "Henry IV": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918869138-FB29PPATUFIE3NGB8AZR/Henry+IV.png?format=750w",
  "Henry V": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918879681-ND8VAB0RRZQXJYPOVNC8/Henry+V.png?format=750w",
  "Henry VI": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918891964-DWZDM9J247PG3KF7KYAM/Henry+VI.png?format=750w",
  "Henry VIII": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918894833-6CW7RE8K3YL01YY1HWBK/Henry+VIII.png?format=750w",
  "King John": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918904473-T6AU0T4M870EHJCGCTOX/King+John.png?format=750w",
  "Richard II": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918906387-379NWA8DV0X0T7YMJWR4/Richard+II.png?format=750w",
  "Richard III": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918881766-7DVORNJZWEWONUUQNT1B/Richard+III.png?format=750w",
  "Thoughts on Shakespeare": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554919019056-TGQAIL0418IVFQK3O54B/Thoughts+on+Shakespeare.png?format=750w",
  "Riffs on Shakespeare": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554919020028-27CH0VSINS2DBUJ763GF/Riffs+on+Shakespeare.png?format=750w",
  "The Sopranos": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1588886506990-2KR0TM3SQH248P22F4QE/TV+%E2%80%93+Sopranos.png?format=750w",
  "The Wire": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1588886507046-XH6ZFGP97O5ODHV1VOS8/TV+%E2%80%93+Wire.png?format=750w",
  "24": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1588886506730-QX7ZCUXPPS97SYL24A4W/TV+%E2%80%93+24.png?format=750w",
  "Mad Men": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1589207567290-MDMVOM29UVFILH07EWB5/TV+%E2%80%93+Mad+Men.png?format=750w",
  "Channel Surfing with Cushman": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1589207524061-XBO8792UUX075DP7FVH5/TV+%E2%80%93+Channel+Surfing.png?format=750w",
};

const state = {
  records: [],
  filtered: [],
  visible: PAGE_SIZE,
  collection: "",
  type: "",
  query: "",
  sort: "newest",
  hasActiveQuery: false,
  shakespeareGroup: "",
};

const els = {
  drawer: document.querySelector("#drawer"),
  menuButton: document.querySelector("#menuButton"),
  archive: document.querySelector("#archive"),
  frontpageDirectory: document.querySelector("#frontpageDirectory"),
  tiles: document.querySelector("#collectionTiles"),
  secondaryTiles: document.querySelector("#secondaryTiles"),
  indexTiles: document.querySelector("#indexTiles"),
  archiveCount: document.querySelector("#archiveCount"),
  searchInput: document.querySelector("#searchInput"),
  collectionFilter: document.querySelector("#collectionFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  shakespeareNav: document.querySelector("#shakespeareNav"),
  sortButtons: [...document.querySelectorAll("[data-sort]")],
  clearFilters: document.querySelector("#clearFilters"),
  results: document.querySelector("#results"),
  articleView: document.querySelector("#articleView"),
  article: document.querySelector("#article"),
  indexView: document.querySelector("#indexView"),
  indexContent: document.querySelector("#indexContent"),
};

function hasActiveFilters() {
  return Boolean(state.query.trim() || state.type || state.collection);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function entitySlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "unknown";
}

function splitEntityList(value) {
  if (Array.isArray(value)) return value.flatMap((item) => splitEntityList(item));
  return String(value || "")
    .split(/\s*;\s*|\s+\/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !/^various/i.test(item));
}

function splitCityList(value) {
  return splitEntityList(value)
    .flatMap((item) => item.split(/\s+&\s+/).map((part) => part.trim()))
    .map(normalizeCityName)
    .filter(Boolean)
    .filter((item) => !/^various/i.test(item))
    .filter((item) => item !== "Canada");
}

function sortRecords(records) {
  const sorted = [...records];
  if (state.sort === "oldest") {
    return sorted.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }
  if (state.sort === "title") {
    return sorted.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  }
  return sorted.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function collectionNames(record) {
  const names = Array.isArray(record.collections) ? record.collections.filter(Boolean) : [];
  if (SHAKESPEARE_DERIVED_COLLECTIONS.some((name) => names.includes(name)) && !names.includes(SHAKESPEARE_COLLECTION)) {
    return [...names, SHAKESPEARE_COLLECTION];
  }
  return names;
}

function entityValues(record, type) {
  const role = entityType(type)?.role;
  if (role) return splitEntityList(record.roles?.[role] || []);
  if (type === "people") return record.people || [];
  if (type === "productions") return splitEntityList(record.production_title);
  if (type === "companies") return splitEntityList(record.company);
  if (type === "venues") return splitEntityList(record.venue);
  if (type === "cities") return splitCityList(record.city);
  if (type === "publications") return splitEntityList(record.publication);
  if (type === "categories") return [typeLabel(record)];
  if (type === "collections") return collectionNames(record);
  return [];
}

function normalizeCityName(value) {
  const city = String(value || "").trim();
  const map = {
    "Toronto, ON, Canada": "Toronto",
    "Stratford, ON, Canada": "Stratford",
    "Niagara-on-the-Lake, ON, Canada": "Niagara-on-the-Lake",
    "Niagara-On-The-Lake": "Niagara-on-the-Lake",
    "New York City": "New York",
    "New York, NY, USA": "New York",
    "London": "London, England",
    "London, ON, Canada": "London, Ontario",
  };
  return map[city] || city;
}

function entityMap(type) {
  const map = new Map();
  state.records.forEach((record) => {
    const labels = new Map();
    entityValues(record, type).forEach((value) => {
      const label = String(value || "").trim();
      if (!label) return;
      const slug = entitySlug(label);
      if (!labels.has(slug)) labels.set(slug, label);
    });
    labels.forEach((label, slug) => {
      const existing = map.get(slug) || { slug, label, records: [] };
      existing.records.push(record);
      map.set(slug, existing);
    });
  });
  return map;
}

function entityType(type) {
  return ENTITY_TYPES.find((item) => item.key === type);
}

function typeGroup(record) {
  return TYPE_BY_CATEGORY.get(record.article_category) || {
    value: "other",
    label: record.article_category || "Other",
    categories: [record.article_category || ""],
  };
}

function typeLabel(record) {
  return typeGroup(record).label;
}

function searchable(record) {
  return [
    record.title,
    record.production_title,
    record.company,
    record.venue,
    record.city,
    record.publication,
    record.article_category,
    typeLabel(record),
    ...collectionNames(record),
    ...(record.people || []),
  ]
    .join(" ")
    .toLowerCase();
}

function applyFilters() {
  const query = state.query.trim().toLowerCase();
  state.hasActiveQuery = hasActiveFilters();
  setArchiveExpanded(state.hasActiveQuery || document.activeElement === els.searchInput);
  state.filtered = state.records.filter((record) => {
    if (state.collection && !collectionNames(record).includes(state.collection)) return false;
    if (state.type && typeGroup(record).value !== state.type) return false;
    if (state.collection === SHAKESPEARE_COLLECTION && state.shakespeareGroup) {
      if (shakespeareGroup(record) !== state.shakespeareGroup) return false;
    }
    if (query && !searchable(record).includes(query)) return false;
    return true;
  });
  state.filtered = sortRecords(state.filtered);
  updateSortButtons();
  renderShakespeareNav();
  state.visible = PAGE_SIZE;
  renderResults();
}

function updateSortButtons() {
  els.sortButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sort === state.sort);
  });
}

function setArchiveExpanded(expanded) {
  els.archive.classList.toggle("is-expanded", expanded);
}

function resetArchiveControls() {
  state.query = "";
  state.type = "";
  state.collection = "";
  state.shakespeareGroup = "";
  state.hasActiveQuery = false;
  state.filtered = state.records;
  els.searchInput.value = "";
  els.typeFilter.value = "";
  els.collectionFilter.value = "";
  setArchiveExpanded(false);
  renderShakespeareNav();
  renderResults();
}

function makeOption(label, value = label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function populateFilters() {
  const collections = new Map();
  const types = new Map(TYPE_GROUPS.map((group) => [group.value, { ...group, count: 0 }]));
  state.records.forEach((record) => {
    collectionNames(record).forEach((name) => collections.set(name, (collections.get(name) || 0) + 1));
    const group = typeGroup(record);
    const existing = types.get(group.value) || { ...group, count: 0 };
    existing.count += 1;
    types.set(group.value, existing);
  });

  els.collectionFilter.replaceChildren(makeOption("All collections", ""));
  PUBLIC_COLLECTION_FILTERS
    .filter((name) => collections.has(name))
    .forEach((name) => els.collectionFilter.append(makeOption(`${name} (${collections.get(name)})`, name)));

  els.typeFilter.replaceChildren(makeOption("All types", ""));
  [...types.values()]
    .filter((group) => group.count)
    .forEach((group) => els.typeFilter.append(makeOption(`${group.label} (${group.count})`, group.value)));
}

function shakespeareGroup(record) {
  const rawCollections = Array.isArray(record.collections) ? record.collections.filter(Boolean) : [];
  if (rawCollections.includes("Riffs on Shakespeare")) return "adaptations";
  if (rawCollections.includes("Thoughts on Shakespeare")) return "thoughts";
  return "plays";
}

function shakespeareGroupCount(value) {
  return state.records.filter((record) => {
    if (!collectionNames(record).includes(SHAKESPEARE_COLLECTION)) return false;
    if (!value) return true;
    return shakespeareGroup(record) === value;
  }).length;
}

function renderShakespeareNav() {
  if (state.collection !== SHAKESPEARE_COLLECTION) {
    els.shakespeareNav.hidden = true;
    els.shakespeareNav.replaceChildren();
    return;
  }

  const buttons = SHAKESPEARE_GROUPS.map((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.shakespeareGroup = group.value;
    button.className = group.value === state.shakespeareGroup ? "is-active" : "";
    button.innerHTML = `<strong>${group.label}</strong><span>${shakespeareGroupCount(group.value).toLocaleString()} records</span><em>${group.description}</em>`;
    button.addEventListener("click", () => {
      state.shakespeareGroup = group.value;
      applyFilters();
    });
    return button;
  });
  els.shakespeareNav.replaceChildren(...buttons);
  els.shakespeareNav.hidden = false;
}

function renderTiles(key = "types") {
  const tiles = browseTiles[key].map((title, index) => {
    const link = document.createElement("a");
    link.className = `tile${key === "shakespeare" && index > 15 ? " dark" : ""}`;
    link.href = archiveHrefForTile(title, key);
    if (tileImages[title]) {
      link.classList.add("has-image");
      const image = document.createElement("img");
      image.src = tileImages[title];
      image.alt = title;
      image.loading = "lazy";
      link.replaceChildren(image);
    } else {
      const heading = document.createElement("strong");
      heading.textContent = title;
      const count = countForTile(title, key);
      const meta = document.createElement("span");
      meta.textContent = count ? `${count.toLocaleString()} records` : "Browse";
      const description = document.createElement("p");
      description.textContent = tileDescription(title);
      link.replaceChildren(heading, meta, description);
    }
    return link;
  });
  els.tiles.replaceChildren(...tiles);
}

function renderSecondaryCollections() {
  const tiles = SECONDARY_COLLECTION_TILES.map((title) => {
    const link = document.createElement("a");
    link.className = "tile secondary-tile";
    link.href = archiveHrefForTile(title, "collections");
    const heading = document.createElement("strong");
    heading.textContent = title.replace(/^The\s+/, "");
    const count = countForTile(title, "collections");
    const meta = document.createElement("span");
    meta.textContent = count ? `${count.toLocaleString()} records` : "Browse";
    const description = document.createElement("p");
    description.textContent = tileDescription(title);
    link.replaceChildren(heading, meta, description);
    return link;
  });
  els.secondaryTiles.replaceChildren(...tiles);
}

function renderIndexTiles() {
  const tiles = ENTITY_TYPES.map((type) => {
    const entries = entityMap(type.key);
    if (!entries.size) return null;
    const link = document.createElement("a");
    link.className = "tile index-tile";
    link.href = `#index:${type.key}`;
    const heading = document.createElement("strong");
    heading.textContent = type.label;
    const meta = document.createElement("span");
    meta.textContent = `${entries.size.toLocaleString()} entries`;
    const description = document.createElement("p");
    description.textContent = indexDescription(type.key);
    link.replaceChildren(heading, meta, description);
    return link;
  }).filter(Boolean);
  els.indexTiles.replaceChildren(...tiles);
}

function renderFrontpageDirectory() {
  const browseLinks = TYPE_GROUPS
    .map((type) => ({
      label: type.label,
      href: `#archive?type=${type.value}`,
      count: state.records.filter((record) => typeGroup(record).value === type.value).length,
    }))
    .filter((item) => item.count)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const collectionLinks = [
    { label: "Shakespeare", href: "#collection:shakespeare", count: countForTile("Shakespeare"), featured: true },
    ...SECONDARY_COLLECTION_TILES.map((title) => ({
      label: title.replace(/^The\s+/, ""),
      href: archiveHrefForTile(title, "collections"),
      count: countForTile(title, "collections"),
    })),
  ];

  const indexLinks = ENTITY_TYPES
    .map((type) => ({
      label: type.label,
      href: `#index:${type.key}`,
      count: entityMap(type.key).size,
    }))
    .filter((item) => item.count)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const sections = [
    {
      id: "current",
      className: "frontpage-section frontpage-current",
      label: "New writing",
      title: "Current",
      links: [{ label: "Coming after launch", href: "#current", count: 0 }],
      limit: 1,
    },
    {
      id: "browseStart",
      className: "frontpage-section",
      label: "Categories",
      title: "Browse",
      links: browseLinks,
      limit: 8,
    },
    {
      id: "collectionStart",
      className: "frontpage-section frontpage-collections",
      label: "Curated paths",
      title: "Collections",
      links: collectionLinks,
      limit: 6,
    },
    {
      id: "indexStart",
      className: "frontpage-section",
      label: "Alphabetical maps",
      title: "Indexes",
      links: indexLinks,
      limit: 10,
    },
  ];

  els.frontpageDirectory.replaceChildren(...sections.map(frontpageSection));
}

function frontpageSection(section) {
  const article = document.createElement("article");
  article.className = section.className;
  if (section.id) article.id = section.id;

  const kicker = document.createElement("span");
  kicker.className = "frontpage-kicker";
  kicker.textContent = section.label;

  const title = document.createElement("a");
  title.className = "frontpage-title";
  title.href = section.links[0]?.href || "#home";
  title.textContent = section.title;

  const list = document.createElement("div");
  list.className = "frontpage-links";
  section.links.slice(0, section.limit).forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    if (item.featured) link.className = "is-featured";
    const label = document.createElement("span");
    label.textContent = item.label;
    const count = document.createElement("em");
    count.textContent = item.count ? item.count.toLocaleString() : "";
    link.replaceChildren(label, count);
    list.append(link);
  });

  article.replaceChildren(kicker, title, list);
  return article;
}

function indexDescription(type) {
  return {
    people: "Artists, writers, directors, performers, and other named people.",
    productions: "Reviewed shows, books, broadcasts, recordings, and subjects.",
    companies: "Theatre companies, festivals, broadcasters, and producers.",
    venues: "Theatres and performance spaces.",
    cities: "Places represented in the archive.",
    publications: "Newspapers and publication sources.",
    categories: "Public-facing article categories.",
    collections: "Editorial collections and special paths.",
    directors: "Directors credited in structured production metadata.",
    actors: "Actors credited in structured production metadata.",
    playwrights: "Playwrights and source authors.",
    "composers-lyricists": "Composers, lyricists, and musical writers.",
    "musical-directors": "Musical directors.",
    choreographers: "Choreographers.",
    "set-designers": "Set designers.",
    "costume-designers": "Costume designers.",
    "lighting-designers": "Lighting designers.",
    "sound-designers": "Sound designers.",
    musicians: "Musicians.",
    performers: "Performers outside standard cast credits.",
    producers: "Producers and producing credits.",
    dramaturgs: "Dramaturgs.",
    "fight-directors": "Fight directors.",
  }[type] || "";
}

function indexSortText(label) {
  return String(label || "")
    .replace(/^[\s"'‘’“”.,;:!?()[\]{}]+/, "")
    .trim();
}

function indexGroupLabel(label) {
  const text = indexSortText(label);
  if (/^\d/.test(text)) return "0-9";
  const match = text.match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

function renderEntityIndex(typeKey) {
  const type = entityType(typeKey);
  if (!type) return;
  const entries = [...entityMap(typeKey).values()].sort((a, b) =>
    indexSortText(a.label).localeCompare(indexSortText(b.label)) || a.label.localeCompare(b.label)
  );
  const groups = new Map();
  entries.forEach((entry) => {
    const letter = indexGroupLabel(entry.label);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(entry);
  });

  const title = document.createElement("h1");
  title.textContent = type.label;
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = `${entries.length.toLocaleString()} ${entries.length === 1 ? "entry" : "entries"}`;
  const nav = document.createElement("nav");
  nav.className = "alpha-nav";
  nav.setAttribute("aria-label", `${type.label} alphabet`);
  [...groups.keys()].forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter;
    button.addEventListener("click", () => {
      document.querySelector(`#${typeKey}-${entitySlug(letter)}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    nav.append(button);
  });
  const list = document.createElement("div");
  list.className = "alpha-list";
  [...groups].forEach(([letter, items]) => {
    const section = document.createElement("section");
    section.id = `${typeKey}-${entitySlug(letter)}`;
    const heading = document.createElement("h2");
    heading.textContent = letter;
    const links = document.createElement("div");
    links.className = "alpha-links";
    items.forEach((entry) => {
      const link = document.createElement("a");
      link.href = `#entity:${typeKey}:${entry.slug}`;
      link.innerHTML = `<span>${entry.label}</span><em>${entry.records.length.toLocaleString()}</em>`;
      links.append(link);
    });
    section.replaceChildren(heading, links);
    list.append(section);
  });
  els.indexContent.replaceChildren(title, count, nav, list);
}

function renderEntityPage(typeKey, slug) {
  const type = entityType(typeKey);
  if (!type) return;
  const entry = entityMap(typeKey).get(slug);
  if (!entry) return;
  const title = document.createElement("h1");
  title.textContent = entry.label;
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = `${type.singular} index / ${entry.records.length.toLocaleString()} ${entry.records.length === 1 ? "article" : "articles"}`;
  const back = document.createElement("a");
  back.className = "index-back";
  back.href = `#index:${typeKey}`;
  back.textContent = `Back to ${type.label}`;
  const list = document.createElement("div");
  list.className = "results entity-results";
  list.replaceChildren(...sortRecords(entry.records).map((record) => resultCard(record)));
  els.indexContent.replaceChildren(title, count, back, list);
}

function archiveHrefForTile(title, key) {
  if (title === "Shakespeare") return "#collection:shakespeare";

  const collectionSlug = slugForCollection(title);
  if (collectionFromSlug(collectionSlug)) return `#collection:${collectionSlug}`;

  const typeMap = {
    "Books & Essays": "books-essays",
    "Music & Concerts": "music-concerts",
    "Musical Theatre": "musical-theatre",
    People: "people",
    "Site Notes": "site-notes",
    Television: "television",
    Theatre: "theatre",
    "Other Arts": "other-arts",
  };

  if (typeMap[title]) {
    const contextCollection = collectionForTileContext(key);
    const params = new URLSearchParams({ type: typeMap[title] });
    if (contextCollection) params.set("collection", contextCollection);
    return `#archive?${params.toString()}`;
  }

  return key === "shakespeare" ? `#archive?q=${encodeURIComponent(title)}` : `#archive?q=${encodeURIComponent(title)}`;
}

function slugForCollection(title) {
  const map = {
    "The Canadian Collection": "canadian",
    "The Stratford Collection": "stratford",
    "The Shaw Collection": "shaw",
    "The Musical Collection": "musical",
    "Short Takes": "short",
    "Television Reviews": "television",
  };
  return map[title] || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function collectionFromSlug(slug) {
  const map = {
    canadian: "The Canadian Collection",
    stratford: "The Stratford Collection",
    shaw: "The Shaw Collection",
    musical: "The Musical Collection",
    shakespeare: "The Shakespeare Collection",
    television: "The Television Collection",
    short: "Short Takes",
  };
  return map[slug] || "";
}

function collectionForTileContext(key) {
  return {
    canadian: "The Canadian Collection",
    musical: "The Musical Collection",
    television: "The Television Collection",
  }[key] || "";
}

function countForTile(title, key = "") {
  if (title === "Shakespeare") {
    return state.records.filter((record) => collectionNames(record).includes(SHAKESPEARE_COLLECTION)).length;
  }

  const collection = collectionFromSlug(slugForCollection(title));
  if (collection) {
    return state.records.filter((record) => collectionNames(record).includes(collection)).length;
  }

  const typeValue = {
    "Books & Essays": "books-essays",
    "Music & Concerts": "music-concerts",
    "Musical Theatre": "musical-theatre",
    People: "people",
    "Site Notes": "site-notes",
    Television: "television",
    Theatre: "theatre",
    "Other Arts": "other-arts",
  }[title];

  if (typeValue) {
    const contextCollection = collectionForTileContext(key);
    return state.records.filter((record) => {
      if (typeGroup(record).value !== typeValue) return false;
      if (contextCollection && !collectionNames(record).includes(contextCollection)) return false;
      return true;
    }).length;
  }

  return 0;
}

function tileDescription(title) {
  const descriptions = {
    "The Canadian Collection": "The largest path through the archive: Canadian stages, companies, venues, and artists.",
    "The Stratford Collection": "Reviews, profiles, and festival coverage from Stratford.",
    "The Shaw Collection": "Coverage from Niagara-on-the-Lake and the Shaw Festival orbit.",
    "The Musical Collection": "Musical theatre, cabaret, recordings, concerts, and related profiles.",
    "Short Takes": "Capsules, roundups, listings, and brief notices.",
    Theatre: "Straight theatre reviews, previews, news, listings, and awards coverage.",
    Shakespeare: "Play reviews, thoughts, adaptations, and complete play-by-play browsing.",
    "Musical Theatre": "Stage musicals and musical-theatre criticism.",
    Television: "Television criticism from the National Post years.",
    "Music & Concerts": "Concerts, recordings, cabaret, and music writing.",
    "Books & Essays": "Book reviews, opinion pieces, year-end essays, and critical reflections.",
    People: "Profiles, appreciations, obituaries, and memorial writing.",
    "Other Arts": "Comedy, film, opera, dance, and circus coverage.",
    "Site Notes": "Corrections and other small editorial records.",
    "Television Reviews": "Television criticism from the National Post years.",
  };
  return descriptions[title] || "";
}

function compactParts(parts) {
  const seen = new Set();
  return parts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function productionParts(record) {
  const title = String(record.title || "").trim().toLowerCase();
  const parts = compactParts([record.production_title, record.company, record.city]);
  return parts
    .filter((part) => part.toLowerCase() !== title)
    .slice(0, 3);
}

function headlineParts(title) {
  const text = String(title || "").trim();
  const match = text.match(/^(.+?)[;:]\s*(.+)$/);
  if (!match) return { headline: text, deck: "" };
  return {
    headline: match[1].trim(),
    deck: match[2].trim(),
  };
}

function renderResults() {
  if (!state.hasActiveQuery) {
    els.archiveCount.textContent = `${state.records.length.toLocaleString()} public records`;
    els.results.replaceChildren();
    return;
  }

  const visible = state.filtered.slice(0, state.visible);
  const total = state.records.length.toLocaleString();
  const shown = state.filtered.length.toLocaleString();
  els.archiveCount.textContent =
    state.filtered.length === state.records.length
      ? `${total} public records`
      : `${shown} of ${total} public records`;

  const cards = visible.map((record) => resultCard(record));

  if (state.filtered.length > state.visible) {
    const more = document.createElement("button");
    more.className = "result-card";
    more.type = "button";
    more.innerHTML = `<strong>Load more</strong><span class="meta">${state.filtered.length - state.visible} remaining</span>`;
    more.addEventListener("click", () => {
      state.visible += PAGE_SIZE;
      renderResults();
    });
    cards.push(more);
  }

  els.results.replaceChildren(...cards);
}

function resultCard(record) {
  const card = document.createElement("a");
  card.className = "result-card";
  card.href = `#review:${record.slug}`;

  const date = document.createElement("time");
  date.textContent = formatDate(record.date);

  const title = document.createElement("span");
  title.className = "card-title";
  const parts = headlineParts(record.title || record.production_title || "Untitled");
  const headline = document.createElement("strong");
  headline.textContent = parts.headline;
  title.append(headline);
  if (parts.deck) {
    const deck = document.createElement("span");
    deck.className = "card-deck";
    deck.textContent = parts.deck;
    title.append(deck);
  }

  const production = document.createElement("span");
  production.className = "production-line";
  const productionPartsList = productionParts(record);
  if (productionPartsList.length) {
    const name = document.createElement("strong");
    name.textContent = productionPartsList[0];
    production.append(name);
    productionPartsList.slice(1).forEach((part) => {
      production.append(document.createTextNode(` / ${part}`));
    });
  }

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = [record.publication, typeLabel(record)].filter(Boolean).join(" / ");

  card.append(date, title);
  if (productionPartsList.length) card.append(production);
  card.append(meta);
  return card;
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]*?\n---\s*/, "").trim();
}

function paragraphNodes(markdown, record) {
  const inlineEntities = inlineLinkEntities(record);
  const linkedSlugs = new Set();
  return stripFrontmatter(markdown)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const p = document.createElement("p");
      appendInlineLinkedText(p, block.replace(/\s*\n\s*/g, " "), inlineEntities, linkedSlugs);
      return p;
    });
}

function entityChip(type, label, prefix = "", group = "context") {
  const link = document.createElement("a");
  link.className = `entity-chip entity-${type} entity-group-${group}`;
  link.href = `#entity:${type}:${entitySlug(label)}`;
  link.innerHTML = `${prefix ? `<span>${prefix}</span>` : ""}<strong>${label}</strong>`;
  return link;
}

function articleEntityLinks(record) {
  const roleValues = [
    ...(record.roles?.director || []),
    ...(record.roles?.playwright || []),
    ...(record.roles?.actors || []),
    ...(record.roles?.composer_lyricist || []),
    ...(record.roles?.musical_director || []),
    ...(record.roles?.choreographer || []),
    ...(record.roles?.set_designer || []),
    ...(record.roles?.costume_designer || []),
    ...(record.roles?.lighting_designer || []),
    ...(record.roles?.sound_designer || []),
    ...(record.roles?.performers || []),
    ...(record.roles?.musicians || []),
  ];
  const roleSlugs = new Set(roleValues.map(entitySlug));
  const mentionedPeople = (record.people || []).filter((name) => !roleSlugs.has(entitySlug(name)));
  const contextGroups = [
    ["productions", "Production", splitEntityList(record.production_title).slice(0, 4)],
    ["companies", "Company", splitEntityList(record.company).slice(0, 3)],
    ["venues", "Venue", splitEntityList(record.venue).slice(0, 2)],
    ["cities", "City", splitCityList(record.city).slice(0, 2)],
  ].filter(([, , values]) => values.length);

  const peopleGroups = [
    ["directors", "Director", (record.roles?.director || []).slice(0, 3)],
    ["playwrights", "Playwright", (record.roles?.playwright || []).slice(0, 3)],
    ["actors", "Actor", (record.roles?.actors || []).slice(0, 8)],
    ["composers-lyricists", "Music", (record.roles?.composer_lyricist || []).slice(0, 4)],
    ["musical-directors", "Music Director", (record.roles?.musical_director || []).slice(0, 2)],
    ["choreographers", "Choreographer", (record.roles?.choreographer || []).slice(0, 2)],
    ["set-designers", "Set", (record.roles?.set_designer || []).slice(0, 2)],
    ["costume-designers", "Costume", (record.roles?.costume_designer || []).slice(0, 2)],
    ["lighting-designers", "Lighting", (record.roles?.lighting_designer || []).slice(0, 2)],
    ["sound-designers", "Sound", (record.roles?.sound_designer || []).slice(0, 2)],
    ["performers", "Performer", (record.roles?.performers || []).slice(0, 4)],
    ["musicians", "Musician", (record.roles?.musicians || []).slice(0, 4)],
    ["people", "Mentioned", mentionedPeople.slice(0, 8)],
  ].filter(([, , values]) => values.length);

  if (!contextGroups.length && !peopleGroups.length) return null;
  const wrap = document.createElement("div");
  wrap.className = "article-entity-groups";

  if (contextGroups.length) wrap.append(articleEntityGroup("Work", contextGroups, "context"));
  if (peopleGroups.length) wrap.append(articleEntityGroup("People", peopleGroups, "people"));

  if (mentionedPeople.length > 8) {
    const more = document.createElement("span");
    more.className = "entity-more";
    more.textContent = `+${mentionedPeople.length - 8} mentioned`;
    wrap.querySelector(".article-entities:last-child")?.append(more);
  }
  return wrap;
}

function articleEntityGroup(label, groups, groupType) {
  const section = document.createElement("section");
  section.className = `article-entity-section article-entity-section-${groupType}`;
  const heading = document.createElement("span");
  heading.className = "article-entity-label";
  heading.textContent = label;
  const nav = document.createElement("nav");
  nav.className = "article-entities";
  nav.setAttribute("aria-label", `${label} metadata links`);
  groups.forEach(([type, prefix, values]) => {
    values.forEach((value) => nav.append(entityChip(type, value, prefix, groupType)));
  });
  section.replaceChildren(heading, nav);
  return section;
}

function inlineLinkEntities(record) {
  const candidates = [
    ...splitEntityList(record.production_title).map((label) => ({ type: "productions", label, priority: 1 })),
    ...splitEntityList(record.company).map((label) => ({ type: "companies", label, priority: 2 })),
    ...(record.roles?.director || []).map((label) => ({ type: "directors", label, priority: 3 })),
    ...(record.roles?.playwright || []).map((label) => ({ type: "playwrights", label, priority: 3 })),
    ...(record.roles?.actors || []).map((label) => ({ type: "actors", label, priority: 4 })),
    ...(record.roles?.composer_lyricist || []).map((label) => ({ type: "composers-lyricists", label, priority: 4 })),
    ...(record.roles?.performers || []).map((label) => ({ type: "performers", label, priority: 4 })),
    ...(record.roles?.musicians || []).map((label) => ({ type: "musicians", label, priority: 4 })),
  ];

  const seen = new Set();
  return candidates
    .map((item) => ({ ...item, label: String(item.label || "").trim() }))
    .filter((item) => item.label.length >= 4 && item.label.split(/\s+/).length <= 8)
    .filter((item) => !/^(theatre|company|unknown|various)$/i.test(item.label))
    .filter((item) => {
      const slug = `${item.type}:${entitySlug(item.label)}`;
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .sort((a, b) => a.priority - b.priority || b.label.length - a.label.length);
}

function appendInlineLinkedText(parent, text, entities, linkedSlugs) {
  let cursor = 0;
  while (cursor < text.length) {
    const match = nextEntityMatch(text, cursor, entities, linkedSlugs);
    if (!match) {
      parent.append(document.createTextNode(text.slice(cursor)));
      break;
    }
    if (match.index > cursor) parent.append(document.createTextNode(text.slice(cursor, match.index)));
    const link = document.createElement("a");
    link.className = "article-inline-link";
    link.href = `#entity:${match.entity.type}:${entitySlug(match.entity.label)}`;
    link.textContent = text.slice(match.index, match.index + match.length);
    parent.append(link);
    linkedSlugs.add(`${match.entity.type}:${entitySlug(match.entity.label)}`);
    cursor = match.index + match.length;
  }
}

function nextEntityMatch(text, cursor, entities, linkedSlugs) {
  let best = null;
  entities.forEach((entity) => {
    const slug = `${entity.type}:${entitySlug(entity.label)}`;
    if (linkedSlugs.has(slug)) return;
    const pattern = new RegExp(`(^|[^\\\\p{L}\\\\p{N}])(${escapeRegExp(entity.label)})(?=$|[^\\\\p{L}\\\\p{N}])`, "iu");
    const slice = text.slice(cursor);
    const match = slice.match(pattern);
    if (!match || match.index === undefined) return;
    const prefixLength = match[1]?.length || 0;
    const index = cursor + match.index + prefixLength;
    const length = match[2].length;
    if (!best || index < best.index || (index === best.index && length > best.length)) {
      best = { index, length, entity };
    }
  });
  return best;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function showReview(slug) {
  const record = state.records.find((item) => item.slug === slug);
  if (!record) return;

  const response = await fetch(new URL(encodeURIComponent(record.source_file), CONTENT_ROOT));
  const markdown = response.ok ? await response.text() : "";

  const title = document.createElement("h1");
  const titleParts = headlineParts(record.title);
  title.textContent = titleParts.headline;
  const deck = document.createElement("p");
  deck.className = "article-deck";
  deck.textContent = titleParts.deck;
  const date = document.createElement("time");
  date.className = "article-date";
  date.textContent = formatDate(record.date);

  const meta = document.createElement("p");
  meta.className = "article-meta";
  meta.textContent = [record.publication, typeLabel(record)].filter(Boolean).join(" / ");

  const production = document.createElement("p");
  production.className = "article-production";
  const productionPartsList = productionParts(record);
  if (productionPartsList.length) {
    const name = document.createElement("strong");
    name.textContent = productionPartsList[0];
    production.append(name);
    productionPartsList.slice(1).forEach((part) => {
      production.append(document.createTextNode(` / ${part}`));
    });
  }

  const body = document.createElement("div");
  body.className = "article-body";
  body.replaceChildren(...paragraphNodes(markdown, record));

  const articleParts = [date, title];
  if (titleParts.deck) articleParts.push(deck);
  articleParts.push(meta);
  if (productionPartsList.length) articleParts.push(production);
  const entityLinks = articleEntityLinks(record);
  if (entityLinks) articleParts.push(entityLinks);
  articleParts.push(body);
  els.article.replaceChildren(...articleParts);
  els.articleView.hidden = false;
  els.articleView.scrollIntoView({ behavior: "auto", block: "start" });
}

function route() {
  const hash = window.location.hash || "#home";
  els.articleView.hidden = true;
  els.indexView.hidden = true;
  document.body.classList.remove("article-open", "index-open");

  if (hash.startsWith("#review:")) {
    document.body.classList.add("article-open");
    showReview(hash.replace("#review:", ""));
    return;
  }

  if (hash.startsWith("#index:")) {
    const type = hash.replace("#index:", "");
    if (entityType(type)) {
      document.body.classList.add("index-open");
      renderEntityIndex(type);
      els.indexView.hidden = false;
      els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    }
    return;
  }

  if (hash.startsWith("#entity:")) {
    const [, type, slug] = hash.split(":");
    if (entityType(type) && slug) {
      document.body.classList.add("index-open");
      renderEntityPage(type, slug);
      els.indexView.hidden = false;
      els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    }
    return;
  }

  if (hash.startsWith("#collection:")) {
    const [slug, queryString] = hash.replace("#collection:", "").split("?");
    const params = new URLSearchParams(queryString || "");
    const collection = collectionFromSlug(slug);
    if (collection) {
      if (slug === "shakespeare") {
        renderTiles("shakespeare");
      }
      state.collection = collection;
      state.type = "";
      state.query = "";
      state.shakespeareGroup = slug === "shakespeare" ? params.get("group") || "" : "";
      state.hasActiveQuery = true;
      els.collectionFilter.value = collection;
      els.typeFilter.value = "";
      els.searchInput.value = "";
      applyFilters();
      scrollToSection("#archive");
    }
    return;
  }

  if (hash.startsWith("#browse:")) {
    const key = hash.replace("#browse:", "") || "types";
    resetArchiveControls();
    renderTiles(browseTiles[key] ? key : "types");
    document.querySelector("#browse")?.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#current") {
    resetArchiveControls();
    renderTiles("types");
    scrollToSection("#current");
    return;
  }

  if (hash.startsWith("#archive")) {
    const [, queryString] = hash.split("?");
    if (queryString) {
      const params = new URLSearchParams(queryString);
      state.query = params.get("q") || "";
      state.type = params.get("type") || "";
      state.collection = params.get("collection") || "";
      state.shakespeareGroup = "";
      els.searchInput.value = state.query;
      els.typeFilter.value = state.type;
      els.collectionFilter.value = state.collection;
      applyFilters();
    } else {
      resetArchiveControls();
    }
    scrollToSection("#archive");
    return;
  }

  resetArchiveControls();
  renderTiles("types");
}

function scrollToSection(selector) {
  requestAnimationFrame(() => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load records (${response.status})`);
    state.records = await response.json();
  } catch (error) {
    els.archiveCount.textContent = "Records could not load";
    els.results.innerHTML = `
      <p class="load-error">
        The archive data could not be loaded from this page location. Open the site through the local server URL, or refresh once the server is running.
      </p>
    `;
    console.error(error);
    return;
  }
  state.records = sortRecords(state.records);
  state.filtered = state.records;
  state.hasActiveQuery = false;
  populateFilters();
  renderFrontpageDirectory();
  renderTiles();
  renderSecondaryCollections();
  renderIndexTiles();
  renderResults();
  route();
}

els.menuButton.addEventListener("click", () => {
  els.drawer.classList.toggle("is-open");
});

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  applyFilters();
});

els.searchInput.addEventListener("focus", () => {
  setArchiveExpanded(true);
});

els.searchInput.addEventListener("blur", () => {
  if (!hasActiveFilters()) setArchiveExpanded(false);
});

els.collectionFilter.addEventListener("change", (event) => {
  state.collection = event.target.value;
  if (state.collection !== SHAKESPEARE_COLLECTION) state.shakespeareGroup = "";
  applyFilters();
});

els.typeFilter.addEventListener("change", (event) => {
  state.type = event.target.value;
  applyFilters();
});

els.sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.sort = button.dataset.sort;
    applyFilters();
  });
});

els.clearFilters.addEventListener("click", () => {
  state.query = "";
  state.collection = "";
  state.type = "";
  state.shakespeareGroup = "";
  state.hasActiveQuery = false;
  els.searchInput.value = "";
  els.collectionFilter.value = "";
  els.typeFilter.value = "";
  state.filtered = state.records;
  setArchiveExpanded(false);
  renderShakespeareNav();
  renderResults();
});

window.addEventListener("hashchange", route);

init().catch((error) => {
  els.archiveCount.textContent = "Content export unavailable";
  console.error(error);
});
