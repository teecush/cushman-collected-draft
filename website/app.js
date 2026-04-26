const DATA_URL = new URL("../site_export/data/public_reviews.json?v=65", import.meta.url);
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
  "Current Collection",
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
    label: "Theatre Reviews",
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
    value: "book-reviews",
    label: "Book Reviews",
    categories: ["Book Review"],
  },
  {
    value: "essays-opinion",
    label: "Essays & Opinion",
    categories: ["Opinion Piece"],
  },
  {
    value: "year-in-review",
    label: "Year in Review",
    categories: ["Year in Review"],
  },
  {
    value: "profiles",
    label: "Profiles",
    categories: ["Profile"],
  },
  {
    value: "obituaries",
    label: "Obituaries",
    categories: ["Obituary"],
  },
  {
    value: "comedy",
    label: "Comedy",
    categories: ["Comedy Review"],
  },
  {
    value: "opera",
    label: "Opera",
    categories: ["Opera Review"],
  },
  {
    value: "film",
    label: "Film",
    categories: ["Film Review"],
  },
  {
    value: "dance",
    label: "Dance",
    categories: ["Dance Review"],
  },
  {
    value: "circus",
    label: "Circus",
    categories: ["Circus Review"],
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
const TYPE_VALUE_BY_LABEL = new Map(TYPE_GROUPS.map((group) => [group.label, group.value]));
const OTHER_ARTS_VALUES = ["comedy", "opera", "film", "dance", "circus"];
const BOOKS_ESSAYS_VALUES = ["book-reviews", "essays-opinion", "year-in-review"];
const SHAKESPEARE_PLAY_GROUPS = [
  {
    label: "Comedies",
    titles: [
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
    ],
  },
  {
    label: "Tragedies",
    titles: ["Antony & Cleopatra", "Coriolanus", "Cymbeline", "Julius Caesar", "King Lear", "Macbeth", "Othello", "Romeo & Juliet", "Hamlet", "Timon of Athens", "Titus Andronicus", "Troilus & Cressida"],
  },
  {
    label: "Histories",
    titles: ["Henry IV", "Henry V", "Henry VI", "Henry VIII", "King John", "Richard II", "Richard III"],
  },
  {
    label: "Essays & Riffs",
    titles: ["Thoughts on Shakespeare", "Riffs on Shakespeare"],
  },
];

const browseTiles = {
  types: [
    "Theatre Reviews",
    "Shakespeare",
    "Musical Theatre",
    "Television",
    "Music & Concerts",
    "Book Reviews",
    "Essays & Opinion",
    "Year in Review",
    "Profiles",
    "Obituaries",
    "Opera",
    "Comedy",
    "Film",
    "Dance",
    "Circus",
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
  fullMap: null,
  homeMap: null,
};

const els = {
  drawer: document.querySelector("#drawer"),
  menuButton: document.querySelector("#menuButton"),
  archive: document.querySelector("#archive"),
  frontpageDirectory: document.querySelector("#frontpageDirectory"),
  currentFeature: document.querySelector("#currentFeature"),
  homeMapCanvas: document.querySelector("#homeMapCanvas"),
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
  mapView: document.querySelector("#mapView"),
  mapContent: document.querySelector("#mapContent"),
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

function cityMapPoints() {
  const map = entityMap("cities");
  state.records.forEach((record) => {
    const coordinates = Array.isArray(record.coordinates) ? record.coordinates : [];
    const lat = Number(coordinates[0]);
    const lon = Number(coordinates[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    splitCityList(record.city).forEach((city) => {
      const slug = entitySlug(city);
      const point = map.get(slug) || {
        slug,
        label: city,
        records: [],
      };
      if (!("latTotal" in point)) {
        point.latTotal = 0;
        point.lonTotal = 0;
        point.coordinateCount = 0;
      }
      point.latTotal += lat;
      point.lonTotal += lon;
      point.coordinateCount += 1;
      map.set(slug, point);
    });
  });

  return [...map.values()]
    .filter((point) => point.coordinateCount)
    .map((point) => ({
      ...point,
      lat: point.latTotal / point.coordinateCount,
      lon: point.lonTotal / point.coordinateCount,
      count: point.records.length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function venueMapPoints() {
  const map = new Map();
  state.records.forEach((record) => {
    const coordinates = Array.isArray(record.coordinates) ? record.coordinates : [];
    const lat = Number(coordinates[0]);
    const lon = Number(coordinates[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    const city = splitCityList(record.city)[0] || "";
    splitEntityList(record.venue).forEach((venue) => {
      const slug = entitySlug(venue);
      const point = map.get(slug) || {
        slug,
        label: venue,
        city,
        records: [],
        latTotal: 0,
        lonTotal: 0,
        coordinateCount: 0,
      };
      if (city && !point.city) point.city = city;
      point.records.push(record);
      point.latTotal += lat;
      point.lonTotal += lon;
      point.coordinateCount += 1;
      map.set(slug, point);
    });
  });

  return [...map.values()]
    .filter((point) => point.coordinateCount)
    .map((point) => ({
      ...point,
      lat: point.latTotal / point.coordinateCount,
      lon: point.lonTotal / point.coordinateCount,
      count: point.records.length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
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

function recordsForTypeValue(value) {
  return state.records.filter((record) => typeGroup(record).value === value);
}

function countForTypeValue(value) {
  return recordsForTypeValue(value).length;
}

function countForOtherArts() {
  return OTHER_ARTS_VALUES.reduce((sum, value) => sum + countForTypeValue(value), 0);
}

function landingItems(kind) {
  if (kind === "browse") {
    return [
      ...[
        "theatre",
        "musical-theatre",
        "television",
        "music-concerts",
        "opera",
        "book-reviews",
        "essays-opinion",
        "year-in-review",
        "profiles",
        "obituaries",
        "comedy",
        "film",
        "dance",
        "circus",
      ].map((value) => {
        const group = TYPE_GROUPS.find((item) => item.value === value);
        return landingItem(group.label, `#archive?type=${value}`, countForTypeValue(value), tileDescription(group.label), recordsForTypeValue(value));
      }),
      landingItem("Site Notes", "#archive?type=site-notes", countForTypeValue("site-notes"), tileDescription("Site Notes"), recordsForTypeValue("site-notes")),
    ];
  }

  if (kind === "other-arts") {
    return OTHER_ARTS_VALUES.map((value) => {
      const group = TYPE_GROUPS.find((item) => item.value === value);
      return landingItem(group.label, `#archive?type=${value}`, countForTypeValue(value), tileDescription(group.label), recordsForTypeValue(value));
    });
  }

  if (kind === "collections") {
    return [
      landingItem("Shakespeare", "#section:shakespeare", countForTile("Shakespeare"), tileDescription("Shakespeare"), state.records.filter((record) => collectionNames(record).includes(SHAKESPEARE_COLLECTION))),
      ...SECONDARY_COLLECTION_TILES.map((title) => {
        const collection = collectionFromSlug(slugForCollection(title));
        return landingItem(title.replace(/^The\s+/, ""), archiveHrefForTile(title, "collections"), countForTile(title, "collections"), tileDescription(title), state.records.filter((record) => collectionNames(record).includes(collection)));
      }),
    ];
  }

  if (kind === "indexes") {
    return ENTITY_TYPES.map((type) => {
      const entries = entityMap(type.key);
      return landingItem(type.label, `#index:${type.key}`, entries.size, indexDescription(type.key), [], "entries");
    }).filter((item) => item.count);
  }

  if (kind === "shakespeare") {
    return SHAKESPEARE_GROUPS.map((group) => {
      const href = group.value ? `#collection:shakespeare?group=${group.value}` : "#collection:shakespeare";
      const records = state.records.filter((record) => collectionNames(record).includes(SHAKESPEARE_COLLECTION) && (!group.value || shakespeareGroup(record) === group.value));
      return landingItem(group.label, href, records.length, group.description, records);
    });
  }

  return [];
}

function landingItem(title, href, count, description, records, unit = "records") {
  return { title, href, count, unit, description, examples: [] };
}

function renderLandingPage(kind) {
  const config = {
    current: {
      title: "Current",
      count: `${countForTile("Current Collection", "collections").toLocaleString()} records`,
      intro: "Recent self-published writing from the original Cushman Collected site.",
      items: [landingItem("Current Collection", "#collection:current", countForTile("Current Collection", "collections"), "", state.records.filter((record) => collectionNames(record).includes("Current Collection")))],
    },
    browse: {
      title: "Browse",
      count: `${state.records.length.toLocaleString()} public records`,
      intro: "Start with a category, then refine by search, collection, person, company, production, or city.",
      items: landingItems("browse"),
    },
    collections: {
      title: "Collections",
      count: "Curated paths",
      intro: "Gathered ways into the archive, led by Shakespeare and followed by recurring festivals, regions, and short-form groupings.",
      items: landingItems("collections"),
    },
    indexes: {
      title: "Indexes",
      count: "Alphabetical maps",
      intro: "Metadata pages for people, productions, companies, cities, roles, publications, and other structured archive paths.",
      items: landingItems("indexes"),
    },
    "other-arts": {
      title: "Other Arts",
      count: `${countForOtherArts().toLocaleString()} records`,
      intro: "The smaller arts categories are kept separate here so comedy, opera, film, dance, and circus do not disappear into one vague bucket.",
      items: landingItems("other-arts"),
    },
  }[kind];

  if (kind === "shakespeare") return renderShakespeareLanding();
  if (kind === "current") return renderCurrentLanding();
  if (!config) return;

  const title = document.createElement("h1");
  title.textContent = config.title;
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = config.count;
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = config.intro;
  const cards = document.createElement("div");
  cards.className = "landing-card-grid";
  cards.replaceChildren(...config.items.map(landingCard));
  els.indexContent.replaceChildren(title, count, intro, cards);
}

function renderCurrentLanding() {
  const records = state.records
    .filter((record) => collectionNames(record).includes("Current Collection"))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const title = document.createElement("h1");
  title.textContent = "Current";
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = `${records.length.toLocaleString()} records`;
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = "Recent self-published writing from the original Cushman Collected site, presented with the images that accompanied the articles where available.";
  const grid = document.createElement("div");
  grid.className = "current-landing-grid";
  records.forEach((record, index) => {
    const link = document.createElement("a");
    link.className = `current-landing-card${index === 0 ? " is-latest" : ""}`;
    link.href = `#review:${record.slug}`;
    const media = record.media?.[0];
    if (media?.local_path) {
      const img = document.createElement("img");
      img.src = new URL(`../site_export/content/${media.local_path}`, import.meta.url);
      img.alt = media.alt || media.caption || record.title;
      img.loading = "lazy";
      link.append(img);
    }
    const copy = document.createElement("div");
    const date = document.createElement("span");
    date.textContent = formatDate(record.date);
    const heading = document.createElement("strong");
    heading.textContent = record.title;
    const meta = document.createElement("p");
    meta.textContent = [record.production_title, record.company].filter(Boolean).join(" / ");
    copy.replaceChildren(date, heading, meta);
    link.append(copy);
    grid.append(link);
  });
  els.indexContent.replaceChildren(title, count, intro, grid);
}

function renderShakespeareLanding() {
  const title = document.createElement("h1");
  title.textContent = "Shakespeare";
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = `${countForTile("Shakespeare").toLocaleString()} records`;
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = "A guided path through play reviews, Shakespeare-heavy essays, and adaptations or riffs.";
  const groups = document.createElement("div");
  groups.className = "landing-card-grid landing-card-grid-compact";
  groups.replaceChildren(...landingItems("shakespeare").map(landingCard));
  const playHeading = document.createElement("h2");
  playHeading.className = "landing-subhead";
  playHeading.textContent = "Browse by Play";
  const plays = document.createElement("div");
  plays.className = "shakespeare-play-sections";
  SHAKESPEARE_PLAY_GROUPS.forEach((group) => {
    const groupTitle = document.createElement("h3");
    groupTitle.className = "shakespeare-play-heading";
    groupTitle.textContent = group.label;
    const grid = document.createElement("div");
    grid.className = "tile-grid shakespeare-art-grid";
    grid.replaceChildren(
      ...group.titles.map((playTitle) => shakespeareArtTile(playTitle, browseTiles.shakespeare.indexOf(playTitle)))
    );
    plays.append(groupTitle, grid);
  });
  els.indexContent.replaceChildren(title, count, intro, groups, playHeading, plays);
}

function shakespeareArtTile(title, index) {
  const link = document.createElement("a");
  link.className = `tile${index > 15 ? " dark" : ""}`;
  link.href = archiveHrefForTile(title, "shakespeare");
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
    const meta = document.createElement("span");
    meta.textContent = "Browse";
    link.replaceChildren(heading, meta);
  }
  return link;
}

function landingCard(item) {
  const card = document.createElement("a");
  card.className = "landing-card";
  card.href = item.href;
  const title = document.createElement("strong");
  title.textContent = item.title;
  const count = document.createElement("span");
  const singularUnit = item.unit.replace(/s$/, "");
  count.textContent = item.count ? `${item.count.toLocaleString()} ${item.count === 1 ? singularUnit : item.unit}` : "Not yet published";
  const description = document.createElement("p");
  description.textContent = item.description || "";
  const examples = document.createElement("div");
  examples.className = "landing-examples";
  item.examples.forEach((record) => {
    const example = document.createElement("em");
    example.textContent = record.title;
    examples.append(example);
  });
  card.replaceChildren(title, count, description);
  return card;
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
    { label: "Shakespeare", href: "#section:shakespeare", count: countForTile("Shakespeare"), featured: true },
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
  const currentCount = countForTile("Current Collection", "collections");
  const sections = [
    {
      id: "current",
      className: "frontpage-section frontpage-current",
      label: "New writing",
      title: "Current",
      titleHref: "#collection:current",
      links: currentCount
        ? [{ label: "Current Collection", href: "#collection:current", count: currentCount }]
        : [{ label: "Coming after launch", href: "#section:current", count: 0 }],
      limit: 1,
    },
    {
      id: "browseStart",
      className: "frontpage-section",
      label: "Categories",
      title: "Browse",
      titleHref: "#section:browse",
      links: browseLinks,
      limit: 8,
    },
    {
      id: "collectionStart",
      className: "frontpage-section frontpage-collections",
      label: "Curated paths",
      title: "Collections",
      titleHref: "#section:collections",
      links: collectionLinks,
      limit: 6,
    },
    {
      id: "indexStart",
      className: "frontpage-section",
      label: "Alphabetical maps",
      title: "Indexes",
      titleHref: "#section:indexes",
      links: indexLinks,
      limit: 10,
    },
  ];

  els.frontpageDirectory.replaceChildren(...sections.map(frontpageSection));
}

function renderCurrentFeature() {
  if (!els.currentFeature) return;
  const current = state.records
    .filter((record) => collectionNames(record).includes("Current Collection"))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!current) {
    els.currentFeature.replaceChildren();
    return;
  }
  const media = current.media?.[0];
  const link = document.createElement("a");
  link.className = "current-feature-card";
  link.href = `#review:${current.slug}`;
  if (media?.local_path) {
    const img = document.createElement("img");
    img.src = new URL(`../site_export/content/${media.local_path}`, import.meta.url);
    img.alt = media.alt || media.caption || current.title;
    link.append(img);
  }
  const copy = document.createElement("div");
  copy.className = "current-feature-copy";
  const kicker = document.createElement("span");
  kicker.className = "current-feature-kicker";
  kicker.textContent = "Latest current article";
  const title = document.createElement("h2");
  title.textContent = current.title;
  const meta = document.createElement("p");
  meta.textContent = [formatDate(current.date), current.production_title, current.company].filter(Boolean).join(" / ");
  copy.replaceChildren(kicker, title, meta);
  link.append(copy);
  els.currentFeature.replaceChildren(link);
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
  title.href = section.titleHref || section.links[0]?.href || "#home";
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

function renderExploreTool() {
  const title = document.createElement("h1");
  title.textContent = "Article Explorer";
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = "Start in the middle, then branch by category, era, collection, company, city, or production until the archive opens into a useful path.";
  const tool = document.createElement("div");
  tool.className = "explore-tool explore-bubble-tool";
  const pathBar = document.createElement("div");
  pathBar.className = "explore-path";
  const canvas = document.createElement("div");
  canvas.className = "explore-bubble-canvas";
  const list = document.createElement("div");
  list.className = "explore-articles";
  tool.replaceChildren(pathBar, canvas, list);
  const path = [];
  const branches = [
    { key: "type", label: "Categories", next: "era" },
    { key: "era", label: "Eras", next: "collection" },
    { key: "collection", label: "Collections", next: "company" },
    { key: "company", label: "Companies", next: "city" },
    { key: "city", label: "Cities", next: "production" },
    { key: "production", label: "Productions", next: "type" },
  ];
  const colors = ["#1f587f", "#7f7458", "#55736b", "#8a5f5f", "#6b5a7d", "#3f6f70"];
  let currentBranch = "";

  const filteredRecords = () =>
    path.reduce((records, step) => records.filter((record) => step.test(record)), state.records);

  const valuesForBranch = (records, branch) => {
    const counts = new Map();
    records.forEach((record) => {
      let values = [];
      if (branch === "type") values = [typeLabel(record)];
      if (branch === "era") values = [record.year ? `${String(record.year).slice(0, 3)}0s` : ""];
      if (branch === "collection") values = collectionNames(record);
      if (branch === "company") values = splitEntityList(record.company);
      if (branch === "city") values = splitCityList(record.city);
      if (branch === "production") values = splitEntityList(record.production_title);
      values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    });
    return [...counts.entries()]
      .map(([label, count]) => ({
        label,
        count,
        branch,
        next: branches.find((item) => item.key === branch)?.next || "type",
        test: (record) => {
          if (branch === "type") return typeLabel(record) === label;
          if (branch === "era") return record.year && `${String(record.year).slice(0, 3)}0s` === label;
          if (branch === "collection") return collectionNames(record).includes(label);
          if (branch === "company") return splitEntityList(record.company).includes(label);
          if (branch === "city") return splitCityList(record.city).includes(label);
          if (branch === "production") return splitEntityList(record.production_title).includes(label);
          return true;
        },
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  };

  const makeBubble = (item, options = {}) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `explore-bubble ${options.className || ""}`.trim();
    button.style.setProperty("--bubble-x", `${options.x}%`);
    button.style.setProperty("--bubble-y", `${options.y}%`);
    button.style.setProperty("--bubble-size", `${options.size || Math.min(150, 78 + Math.sqrt(item.count || 1) * 2)}px`);
    button.style.setProperty("--node-color", item.color || options.color || colors[0]);
    button.innerHTML = `<span>${item.label}</span><em>${item.count.toLocaleString()}</em>`;
    button.addEventListener("click", () => {
      if (item.chooseBranch) {
        currentBranch = item.key;
      } else {
        path.push(item);
        currentBranch = item.next;
      }
      renderBubbles();
    });
    return button;
  };

  const renderBubbles = () => {
    const records = filteredRecords();
    pathBar.replaceChildren();
    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "All articles";
    reset.addEventListener("click", () => {
      path.splice(0);
      currentBranch = "";
      renderBubbles();
    });
    pathBar.append(reset);
    path.forEach((step, index) => {
      const crumb = document.createElement("button");
      crumb.type = "button";
      crumb.textContent = step.label;
      crumb.addEventListener("click", () => {
        path.splice(index + 1);
        currentBranch = step.next;
        renderBubbles();
      });
      pathBar.append(crumb);
    });

    canvas.replaceChildren();
    const root = { label: "All Articles", count: state.records.length, color: colors[0] };
    canvas.append(makeBubble(root, { x: 13, y: 50, size: 150, className: "explore-bubble-center explore-bubble-root", color: colors[0] }));

    branches.forEach((branch, index) => {
      const y = 15 + index * 14;
      const bubble = makeBubble(
        { ...branch, count: state.records.length, color: colors[index % colors.length], chooseBranch: true },
        { x: 33, y, size: 108, className: currentBranch === branch.key && !path.length ? "is-active-branch" : "is-branch", color: colors[index % colors.length] },
      );
      canvas.append(bubble);
    });

    let anchorX = 33;
    let anchorY = branches.findIndex((branch) => branch.key === currentBranch);
    anchorY = anchorY >= 0 && !path.length ? 15 + anchorY * 14 : 50;
    path.forEach((step, index) => {
      anchorX = Math.min(78, 47 + index * 15);
      anchorY = 50;
      canvas.append(makeBubble(step, {
        x: anchorX,
        y: anchorY,
        size: 118,
        className: "is-path",
        color: colors[(index + 2) % colors.length],
      }));
    });

    const branch = currentBranch || path.at(-1)?.next || "type";
    const items = valuesForBranch(records, branch).slice(0, 10);
    const candidateX = Math.min(88, anchorX + 20);
    items.forEach((item, index) => {
      const spread = Math.min(72, 12 + index * (76 / Math.max(items.length - 1, 1)));
      const y = items.length === 1 ? anchorY : spread;
      canvas.append(makeBubble(
        { ...item, color: colors[index % colors.length] },
        { x: candidateX, y, size: Math.min(128, 76 + Math.sqrt(item.count || 1) * 1.8), className: "is-candidate", color: colors[index % colors.length] },
      ));
    });

    list.replaceChildren();
    const listTitle = document.createElement("h2");
    listTitle.textContent = `${records.length.toLocaleString()} articles`;
    list.append(listTitle);
    sortRecords(records).slice(0, 18).forEach((record) => {
      const link = document.createElement("a");
      link.href = `#review:${record.slug}`;
      link.textContent = record.title;
      list.append(link);
    });
  };
  renderBubbles();
  els.indexContent.replaceChildren(title, intro, tool);
}

function renderTimelineTool() {
  const title = document.createElement("h1");
  title.textContent = "Timeline";
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = "Move through the archive year by year, with larger stacks marking denser parts of the record.";
  const tool = document.createElement("div");
  tool.className = "timeline-tool";
  const years = new Map();
  state.records.forEach((record) => {
    if (!record.year) return;
    const key = String(record.year);
    if (!years.has(key)) years.set(key, []);
    years.get(key).push(record);
  });
  const yearButtons = document.createElement("div");
  yearButtons.className = "timeline-years";
  const results = document.createElement("div");
  results.className = "timeline-results results";
  const max = Math.max(...[...years.values()].map((items) => items.length), 1);
  const showYear = (year) => {
    yearButtons.querySelectorAll(".timeline-year").forEach((button) => button.classList.toggle("is-active", button.dataset.year === year));
    results.replaceChildren(...sortRecords(years.get(year) || []).slice(0, 36).map(resultCard));
  };
  [...years.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([year, records]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "timeline-year";
    button.dataset.year = year;
    button.style.minHeight = `${58 + (records.length / max) * 90}px`;
    button.innerHTML = `<strong>${year}</strong><span>${records.length.toLocaleString()}</span>`;
    button.addEventListener("click", () => showYear(year));
    yearButtons.append(button);
  });
  tool.replaceChildren(yearButtons, results);
  els.indexContent.replaceChildren(title, intro, tool);
  showYear([...years.keys()].sort().at(-1));
}

function renderExploreToolV2() {
  const title = document.createElement("h1");
  title.textContent = "Article Explorer";
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = "Start with the whole archive, then open one branch at a time. Each choice stays visible so the path reads like a map.";
  const tool = document.createElement("div");
  tool.className = "explore-tool explore-tree-tool";
  const pathBar = document.createElement("div");
  pathBar.className = "explore-path";
  const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  canvas.classList.add("explore-tree");
  canvas.setAttribute("viewBox", "0 0 1180 720");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Interactive archive explorer");
  const list = document.createElement("div");
  list.className = "explore-articles";
  tool.replaceChildren(pathBar, canvas, list);

  const path = [];
  const branches = [
    { key: "type", label: "Categories", next: "era" },
    { key: "era", label: "Eras", next: "collection" },
    { key: "collection", label: "Collections", next: "company" },
    { key: "company", label: "Companies", next: "city" },
    { key: "city", label: "Cities", next: "production" },
    { key: "production", label: "Productions", next: "type" },
  ];
  const colors = ["#1f587f", "#7f7458", "#55736b", "#8a5f5f", "#6b5a7d", "#3f6f70"];
  let currentBranch = "type";

  const svgEl = (name, attrs = {}) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };
  const wrapWords = (label, maxChars = 11, maxLines = 3) => {
    const words = String(label).replace(/^The\s+/i, "").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length <= maxChars || !current) {
        current = next;
      } else {
        lines.push(current);
        current = word;
      }
    });
    if (current) lines.push(current);
    if (lines.length > maxLines) {
      const kept = lines.slice(0, maxLines);
      kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\.+$/, "")}...`;
      return kept;
    }
    return lines;
  };
  const filteredRecords = () => path.reduce((records, step) => records.filter((record) => step.test(record)), state.records);
  const valuesForBranch = (records, branch) => {
    const counts = new Map();
    records.forEach((record) => {
      let values = [];
      if (branch === "type") values = [typeLabel(record)];
      if (branch === "era") values = [record.year ? `${String(record.year).slice(0, 3)}0s` : ""];
      if (branch === "collection") values = collectionNames(record);
      if (branch === "company") values = splitEntityList(record.company);
      if (branch === "city") values = splitCityList(record.city);
      if (branch === "production") values = splitEntityList(record.production_title);
      values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    });
    return [...counts.entries()]
      .map(([label, count]) => ({
        label,
        count,
        branch,
        next: branches.find((item) => item.key === branch)?.next || "type",
        test: (record) => {
          if (branch === "type") return typeLabel(record) === label;
          if (branch === "era") return record.year && `${String(record.year).slice(0, 3)}0s` === label;
          if (branch === "collection") return collectionNames(record).includes(label);
          if (branch === "company") return splitEntityList(record.company).includes(label);
          if (branch === "city") return splitCityList(record.city).includes(label);
          if (branch === "production") return splitEntityList(record.production_title).includes(label);
          return true;
        },
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  };
  const addLink = (from, to) => {
    canvas.append(svgEl("path", {
      class: "explore-tree-link",
      d: `M ${from.x + from.r} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x - to.r} ${to.y}`,
    }));
  };
  const addNode = (node, onClick) => {
    const group = svgEl("g", {
      class: `explore-tree-node ${node.className || ""}`.trim(),
      transform: `translate(${node.x} ${node.y})`,
      tabindex: "0",
      role: "button",
      "aria-label": `${node.label}, ${node.count.toLocaleString()} articles`,
    });
    group.style.setProperty("--node-color", node.color || colors[0]);
    group.append(svgEl("circle", { r: node.r }));
    const lines = wrapWords(node.label, node.maxChars || 12, node.maxLines || 3);
    lines.forEach((line, index) => {
      const text = svgEl("text", {
        y: (index - (lines.length - 1) / 2) * 17 - 5,
        "text-anchor": "middle",
      });
      text.textContent = line;
      group.append(text);
    });
    const count = svgEl("text", {
      class: "explore-tree-count",
      y: Math.min(node.r - 17, 38),
      "text-anchor": "middle",
    });
    count.textContent = node.count.toLocaleString();
    group.append(count);
    group.addEventListener("click", onClick);
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    });
    canvas.append(group);
  };
  const renderTree = () => {
    const records = filteredRecords();
    pathBar.replaceChildren();
    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "All articles";
    reset.addEventListener("click", () => {
      path.splice(0);
      currentBranch = "type";
      renderTree();
    });
    pathBar.append(reset);
    path.forEach((step, index) => {
      const crumb = document.createElement("button");
      crumb.type = "button";
      crumb.textContent = step.label;
      crumb.addEventListener("click", () => {
        path.splice(index + 1);
        currentBranch = step.next;
        renderTree();
      });
      pathBar.append(crumb);
    });

    canvas.replaceChildren();
    const root = { x: 105, y: 360, r: 72, label: "All Articles", count: state.records.length, color: colors[0], className: "is-root", maxChars: 10 };
    const branchNodes = branches.map((branch, index) => ({
      ...branch,
      x: 305,
      y: 118 + index * 92,
      r: currentBranch === branch.key ? 58 : 48,
      count: records.length,
      color: colors[index % colors.length],
      className: currentBranch === branch.key ? "is-active" : "is-branch",
      maxChars: 12,
    }));
    branchNodes.forEach((node) => addLink(root, node));
    addNode(root, () => {
      path.splice(0);
      currentBranch = "type";
      renderTree();
    });
    branchNodes.forEach((node) => addNode(node, () => {
      currentBranch = node.key;
      renderTree();
    }));

    let anchor = branchNodes.find((node) => node.key === currentBranch) || root;
    path.forEach((step, index) => {
      const node = {
        ...step,
        x: 500 + index * 150,
        y: 360,
        r: 54,
        color: colors[(index + 2) % colors.length],
        className: "is-path",
        maxChars: 11,
      };
      addLink(anchor, node);
      addNode(node, () => {
        path.splice(index + 1);
        currentBranch = step.next;
        renderTree();
      });
      anchor = node;
    });

    const branch = currentBranch || path.at(-1)?.next || "type";
    const items = valuesForBranch(records, branch).slice(0, 9);
    const columnX = Math.min(1080, anchor.x + 230);
    const gap = Math.min(80, 540 / Math.max(items.length, 1));
    const startY = 360 - ((items.length - 1) * gap) / 2;
    items.forEach((item, index) => {
      const r = Math.max(39, Math.min(64, 38 + Math.sqrt(item.count || 1) * 1.1));
      const node = {
        ...item,
        x: columnX,
        y: startY + index * gap,
        r,
        color: colors[index % colors.length],
        className: "is-candidate",
        maxChars: r > 54 ? 12 : 9,
        maxLines: 3,
      };
      addLink(anchor, node);
      addNode(node, () => {
        path.push(item);
        currentBranch = item.next;
        renderTree();
      });
    });

    list.replaceChildren();
    const listTitle = document.createElement("h2");
    listTitle.textContent = `${records.length.toLocaleString()} articles`;
    list.append(listTitle);
    sortRecords(records).slice(0, 14).forEach((record) => {
      const link = document.createElement("a");
      link.href = `#review:${record.slug}`;
      link.textContent = record.title;
      list.append(link);
    });
  };
  renderTree();
  els.indexContent.replaceChildren(title, intro, tool);
}

function renderTimelineToolV2() {
  const title = document.createElement("h1");
  title.textContent = "Timeline";
  const intro = document.createElement("p");
  intro.className = "landing-intro";
  intro.textContent = "Drag across the line to move through the archive. Thicker years mark denser parts of the record.";
  const tool = document.createElement("div");
  tool.className = "timeline-tool";
  const years = new Map();
  state.records.forEach((record) => {
    if (!record.year) return;
    const key = String(record.year);
    if (!years.has(key)) years.set(key, []);
    years.get(key).push(record);
  });
  const sortedYears = [...years.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
  const rail = document.createElement("div");
  rail.className = "timeline-rail";
  const track = document.createElement("div");
  track.className = "timeline-track";
  const thumb = document.createElement("button");
  thumb.type = "button";
  thumb.className = "timeline-thumb";
  thumb.setAttribute("aria-label", "Selected year");
  const yearLabel = document.createElement("div");
  yearLabel.className = "timeline-year-label";
  const results = document.createElement("div");
  results.className = "timeline-results timeline-list";
  const max = Math.max(...sortedYears.map(([, items]) => items.length), 1);
  const minYear = Number(sortedYears[0]?.[0] || new Date().getFullYear());
  const maxYear = Number(sortedYears.at(-1)?.[0] || minYear);
  const yearSpan = Math.max(1, maxYear - minYear);
  let activeYear = String(maxYear);

  const showYear = (year) => {
    activeYear = String(year);
    const records = sortRecords(years.get(activeYear) || []);
    const pct = ((Number(activeYear) - minYear) / yearSpan) * 100;
    thumb.style.left = `${pct}%`;
    yearLabel.style.left = `${pct}%`;
    yearLabel.textContent = `${activeYear} / ${records.length.toLocaleString()} ${records.length === 1 ? "article" : "articles"}`;
    track.querySelectorAll(".timeline-segment").forEach((segment) => segment.classList.toggle("is-active", segment.dataset.year === activeYear));
    results.replaceChildren();
    records.slice(0, 28).forEach((record) => {
      const link = document.createElement("a");
      link.href = `#review:${record.slug}`;
      const split = headlineParts(record.title);
      link.innerHTML = `<strong>${split.headline}</strong>${split.deck ? `<span>${split.deck}</span>` : ""}<em>${formatDate(record.date) || record.year || ""} / ${typeLabel(record)}</em>`;
      results.append(link);
    });
  };
  const nearestYear = (clientX) => {
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const target = minYear + ratio * yearSpan;
    return sortedYears.reduce((best, [year]) => (Math.abs(Number(year) - target) < Math.abs(Number(best) - target) ? year : best), sortedYears[0]?.[0] || String(minYear));
  };
  sortedYears.forEach(([year, records]) => {
    const segment = document.createElement("button");
    segment.type = "button";
    segment.className = "timeline-segment";
    segment.dataset.year = year;
    segment.style.left = `${((Number(year) - minYear) / yearSpan) * 100}%`;
    segment.style.height = `${18 + (records.length / max) * 82}px`;
    segment.setAttribute("aria-label", `${year}, ${records.length} articles`);
    segment.addEventListener("click", () => showYear(year));
    track.append(segment);
  });
  track.append(thumb, yearLabel);
  track.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    track.setPointerCapture(event.pointerId);
    showYear(nearestYear(event.clientX));
  });
  track.addEventListener("pointermove", (event) => {
    if (event.buttons !== 1) return;
    showYear(nearestYear(event.clientX));
  });
  rail.replaceChildren(track);
  tool.replaceChildren(rail, results);
  els.indexContent.replaceChildren(title, intro, tool);
  showYear(activeYear);
}

function renderAboutPage() {
  const title = document.createElement("h1");
  title.textContent = "Biography";
  const page = document.createElement("div");
  page.className = "about-page";
  const image = document.createElement("figure");
  image.className = "about-portrait";
  image.innerHTML = `<img src="https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554663146307-4GHNZP9WBABJ2GPUNF9Z/Robert%2BCushman%2Billustration" alt="Robert Cushman illustration"><figcaption>Illustration by Chloe Cushman.</figcaption>`;
  const copy = document.createElement("div");
  copy.className = "about-copy";
  copy.innerHTML = `
    <h2>Robert Cushman</h2>
    <p>Robert Cushman was born in London and educated at Latymer Upper School, West London and Clare College, Cambridge. He went from there to the BBC where he worked in radio drama, TV arts programs, and for the World Service. He then directed in the London and regional theatre, and was theatre critic of <em>The Observer</em> from 1973 to 1984.</p>
    <p>He moved to Canada in 1987, and was theatre critic of the <em>National Post</em> from its inception in 1999 until 2017. He has written extensively for other British and Canadian newspapers and magazines, and for the <em>New York Times</em>. He has continued to work in the theatre as an author, director and even as performer; the musical <em>Look to the Rainbow</em>, which he devised and directed, was produced in the West End in 1985. He was director of corporate communications for Livent Inc. in 1998-99.</p>
    <p>He has also been a prolific broadcaster, especially on musical theatre and American popular song; popular series include <em>Book, Music and Lyrics</em> (BBC) and <em>Songbook</em> (CBC). His book <em>Fifty Seasons at Stratford</em>, a history of the Stratford Festival, was published in 2002; and he is a record eight-time winner of the Nathan Cohen Award for Excellence in Theatre Criticism.</p>
    <p>He is married, with three children, and lives in Toronto.</p>
  `;
  page.replaceChildren(image, copy);
  els.indexContent.replaceChildren(title, page);
}

function renderSubscribePage() {
  const title = document.createElement("h1");
  title.textContent = "Subscribe & Contact";
  const page = document.createElement("div");
  page.className = "contact-page";
  page.innerHTML = `
    <section>
      <h2>Newsletter</h2>
      <p>Subscribe to the Cushman Collected newsletter: every month, you’ll be the first to read new reviews and featured reviews curated from the archive.</p>
      <form class="contact-form">
        <input type="email" placeholder="Email Address" aria-label="Email Address">
        <a class="footer-button" href="https://www.cushmancollected.com/contact" target="_blank" rel="noopener">Sign Up</a>
      </form>
      <small>We respect your privacy and you may unsubscribe at any time.</small>
    </section>
    <section>
      <h2>Questions?</h2>
      <p>Send the team of CushmanCollected.com an email at <a href="mailto:cushmancollected@gmail.com">cushmancollected@gmail.com</a>.</p>
    </section>
  `;
  els.indexContent.replaceChildren(title, page);
}

function renderCriticsCirclePage() {
  const title = document.createElement("h1");
  title.textContent = "Critic’s Circle";
  const supporters = [
    "James and Sandra Pitblado", "Lloyd and Sharon Atkinson", "Jacquie Baby", "Eloise Ballou", "Calder Bennett", "Diana Bentley", "Nicolas Billon", "Jeanette Cairns", "Suzanne Cheriton", "Barry and Carole Cohen", "Rex Collins", "Laura Condlln", "Susan Coyne", "Katherine Cullen", "Anahita Dehbonehie", "David Demchuk", "Katherine Devlin", "Sarah Dodd", "Paul Dunn", "Richard Eyre", "Wayne Fairhead", "Barbara Fingerote", "Karen Fricker", "David Goldbloom", "Michael Healey", "Sebastien Heins", "Sherri Helwig", "Martha Henry", "David Alan Hilton", "Tracey Hoyt", "Randy Hughson", "Lindsay Junkin", "John Karastamatis", "Thomas Keating", "Sandra Keating", "Jill Keiley", "David Lint", "Youssef Marcus", "Jordan Mandlowitz", "Diego Matamoros & Robyn Stevan Matamoros", "Tom McCamus", "Nora Mclellan", "Scott McKowen", "Hannah Moscovitch", "Joanne O’Sullivan", "Patricia Patchet-Golubev", "Miles Potter", "Grant Ramsay", "Gale Rubenstein", "Carrie Sager", "Michael Shamata", "Holly Shephard", "Laurence Siegel", "Sarah Stanley", "Carly Street", "Carolyn Tanner", "Julie Tepperman", "Risa & Perry Tepperman", "Gail Tolley", "Craig Walker", "Maggie Woodley", "Joseph Ziegler", "Tamara Zielony",
  ];
  const team = ["Susan Stover", "Jessie Fraser", "Amy Keating", "Raylene Turner", "Sarah English", "Colin Simmons"];
  const page = document.createElement("div");
  page.className = "critics-page";
  const quote = document.createElement("blockquote");
  quote.innerHTML = `<p>“I can no other answer make but thanks,<br>And thanks, and ever thanks.”</p><cite>Twelfth Night</cite>`;
  const intro = document.createElement("p");
  intro.textContent = "Cushman Collected would like to acknowledge the incredible support of the donors who made this site possible.";
  const lead = document.createElement("p");
  lead.className = "lead-supporters";
  lead.innerHTML = `<strong>Lead Supporters</strong><span>James and Sandra Pitblado</span>`;
  const supporterList = document.createElement("div");
  supporterList.className = "name-columns";
  supporters.slice(1).forEach((name) => {
    const span = document.createElement("span");
    span.textContent = name;
    supporterList.append(span);
  });
  const teamIntro = document.createElement("p");
  teamIntro.textContent = "Cushman Collected would also like to thank the incredible team who have contributed to the archiving of these reviews.";
  const teamList = document.createElement("div");
  teamList.className = "name-columns name-columns-short";
  team.forEach((name) => {
    const span = document.createElement("span");
    span.textContent = name;
    teamList.append(span);
  });
  page.replaceChildren(quote, intro, lead, supporterList, teamIntro, teamList);
  els.indexContent.replaceChildren(title, page);
}

function renderMapView() {
  const points = cityMapPoints();
  const venues = venueMapPoints();
  const title = document.createElement("h1");
  title.textContent = "Archive Map";
  const count = document.createElement("p");
  count.className = "index-count";
  const articleTotal = points.reduce((sum, point) => sum + point.count, 0);
  count.textContent = `${points.length.toLocaleString()} places / ${articleTotal.toLocaleString()} mapped article references`;

  const shell = document.createElement("div");
  shell.className = "archive-map-shell";
  const map = document.createElement("div");
  map.className = "archive-map";
  const canvas = document.createElement("div");
  canvas.className = "map-canvas";
  map.append(canvas);

  const list = document.createElement("div");
  list.className = "map-city-list";
  const listTitle = document.createElement("h2");
  listTitle.textContent = "Places";
  const links = document.createElement("div");
  links.className = "map-link-list map-city-links";
  points.forEach((point) => {
    const link = document.createElement("a");
    link.dataset.mapLabel = `${point.label} city`;
    link.href = `#entity:cities:${point.slug}`;
    link.innerHTML = `<span>${point.label}</span><em>${point.count.toLocaleString()}</em>`;
    links.append(link);
  });
  const venueTitle = document.createElement("h2");
  venueTitle.textContent = "Venues";
  const venueLinks = document.createElement("div");
  venueLinks.className = "map-link-list map-venue-links";
  venues.slice(0, 140).forEach((point) => {
    const link = document.createElement("a");
    link.dataset.mapLabel = `${point.label} ${point.city || ""} venue`;
    link.href = `#entity:venues:${point.slug}`;
    link.innerHTML = `<span>${point.label}${point.city ? `<small>${point.city}</small>` : ""}</span><em>${point.count.toLocaleString()}</em>`;
    venueLinks.append(link);
  });
  const hint = document.createElement("p");
  hint.className = "map-hint";
  hint.textContent = "Zoom in to reveal venue markers.";
  list.replaceChildren(listTitle, links, venueTitle, hint, venueLinks);
  const filterMapList = (query) => {
    list.querySelectorAll("a").forEach((link) => {
      link.hidden = query && !link.dataset.mapLabel.toLowerCase().includes(query);
    });
    if (state.fullMap?.focus) state.fullMap.focus(query);
  };
  shell.replaceChildren(map, list);
  els.mapContent.replaceChildren(title, count, shell);
  requestAnimationFrame(() => {
    state.fullMap = renderArchiveMap(canvas, points, {
      existingMap: state.fullMap,
      zoomControl: true,
      maxMarkers: points.length,
      venues,
      maxVenues: 80,
      maxVenueLabels: 14,
      initialCenter: [43.6515, -79.3835],
      initialZoom: 13,
      searchControl: true,
      onSearch: filterMapList,
      onZoom: (zoom) => shell.classList.toggle("is-venue-zoom", zoom >= 9),
    });
  });
}

function renderHomeMap() {
  if (!els.homeMapCanvas || !state.records.length) return;
  state.homeMap = renderArchiveMap(els.homeMapCanvas, cityMapPoints(), {
    existingMap: state.homeMap,
    zoomControl: true,
    maxMarkers: 28,
    compact: false,
    venues: venueMapPoints(),
    maxVenues: 60,
    maxVenueLabels: 6,
    initialCenter: [43.6515, -79.3835],
    initialZoom: 13,
    searchControl: true,
  });
}

function renderArchiveMap(container, points, options = {}) {
  if (!container || !points.length) return null;
  if (options.existingMap) options.existingMap.remove();
  container.replaceChildren();
  if (!options.compact && window.L) return renderLeafletMap(container, points, options);
  return renderControlledSvgMap(container, points, options);
}

function renderLeafletMap(container, points, options = {}) {
  const mapNode = document.createElement("div");
  mapNode.className = "leaflet-map";
  container.append(mapNode);
  const map = L.map(mapNode, { scrollWheelZoom: true, zoomControl: options.zoomControl !== false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
  const bounds = [];
  const searchable = [];
  const venueMarkers = [];
  const maxCount = Math.max(...points.map((point) => point.count), 1);
  points.forEach((point) => {
    const radius = 6 + Math.sqrt(point.count / maxCount) * 18;
    const marker = L.circleMarker([point.lat, point.lon], {
      radius,
      color: "#173f5f",
      weight: 2,
      fillColor: "#3a7199",
      fillOpacity: 0.72,
    }).addTo(map);
    marker.bindPopup(`<strong>${point.label}</strong>${point.count.toLocaleString()} mapped article references<br><a href="#entity:cities:${point.slug}">Open city index</a>`);
    searchable.push({ label: `${point.label} city`, point, marker, zoom: 9 });
    bounds.push([point.lat, point.lon]);
  });
  (options.venues || []).slice(0, options.maxVenues || 140).forEach((point) => {
    const marker = L.circleMarker([point.lat, point.lon], {
      radius: 5,
      color: "#6b5b3d",
      weight: 1.5,
      fillColor: "#d8c99c",
      fillOpacity: 0,
      opacity: 0,
    }).addTo(map);
    marker.bindPopup(`<strong>${point.label}</strong>${point.city || ""}<br>${point.count.toLocaleString()} article references<br><a href="#entity:venues:${point.slug}">Open venue index</a>`);
    venueMarkers.push(marker);
    searchable.push({ label: `${point.label} ${point.city || ""} venue`, point, marker, zoom: 13 });
    bounds.push([point.lat, point.lon]);
  });
  const updateVenueVisibility = () => {
    const zoom = map.getZoom();
    venueMarkers.forEach((marker) => {
      marker.setStyle({ opacity: zoom >= 11 ? 0.9 : 0, fillOpacity: zoom >= 11 ? 0.72 : 0 });
    });
    if (typeof options.onZoom === "function") options.onZoom(zoom);
  };
  map.on("zoomend", updateVenueVisibility);
  if (options.initialCenter) {
    map.setView(options.initialCenter, options.initialZoom || 8);
  } else if (bounds.length) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
  if (options.searchControl) {
    const control = L.DomUtil.create("label", "leaflet-search-control");
    control.innerHTML = `<span>Search map</span><input type="search" placeholder="City or venue">`;
    L.DomEvent.disableClickPropagation(control);
    L.DomEvent.disableScrollPropagation(control);
    const searchBox = control.querySelector("input");
    searchBox.addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();
      if (typeof options.onSearch === "function") options.onSearch(query);
      if (query) {
        const match = searchable.find((item) => item.label.toLowerCase().includes(query));
        if (match) map.setView([match.point.lat, match.point.lon], match.zoom);
      }
    });
    map.getContainer().append(control);
  }
  const refreshMapSize = () => {
    map.invalidateSize();
    if (options.initialCenter) map.setView(options.initialCenter, options.initialZoom || 8, { animate: false });
    updateVenueVisibility();
  };
  updateVenueVisibility();
  requestAnimationFrame(refreshMapSize);
  setTimeout(refreshMapSize, 80);
  setTimeout(refreshMapSize, 350);
  setTimeout(refreshMapSize, 900);
  const observer = window.ResizeObserver ? new ResizeObserver(refreshMapSize) : null;
  if (observer) observer.observe(mapNode);
  return {
    remove: () => {
      if (observer) observer.disconnect();
      map.remove();
    },
    focus: (query) => {
      if (!query) return;
      const match = searchable.find((item) => item.label.toLowerCase().includes(query));
      if (!match) return;
      map.setView([match.point.lat, match.point.lon], match.zoom);
      map.closePopup();
    },
  };
}

function renderControlledSvgMap(container, points, options = {}) {
  const wrap = document.createElement("div");
  wrap.className = "controlled-map";
  const controls = document.createElement("div");
  controls.className = "map-controls";
  const zoomIn = document.createElement("button");
  zoomIn.type = "button";
  zoomIn.textContent = "+";
  zoomIn.setAttribute("aria-label", "Zoom in");
  const zoomOut = document.createElement("button");
  zoomOut.type = "button";
  zoomOut.textContent = "−";
  zoomOut.setAttribute("aria-label", "Zoom out");
  controls.replaceChildren(zoomIn, zoomOut);
  const stage = document.createElement("div");
  stage.className = "map-stage";
  stage.append(mapSvg(points, options));
  wrap.replaceChildren(controls, stage);
  container.append(wrap);
  let zoom = 1;
  const setZoom = (next) => {
    zoom = Math.max(1, Math.min(1.65, next));
    stage.style.setProperty("--map-zoom", zoom);
    wrap.classList.toggle("is-venue-zoom", zoom >= 1.35);
    if (typeof options.onZoom === "function") options.onZoom(zoom);
  };
  zoomIn.addEventListener("click", () => setZoom(zoom + 0.2));
  zoomOut.addEventListener("click", () => setZoom(zoom - 0.2));
  setZoom(1);
  return {
    remove() {
      container.replaceChildren();
    },
  };
}

function mapSvg(points, options = {}) {
  const width = 1000;
  const height = 520;
  const padding = 54;
  const lats = points.map((point) => point.lat);
  const lons = points.map((point) => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const lonSpan = maxLon - minLon || 1;
  const latSpan = maxLat - minLat || 1;
  const maxCount = Math.max(...points.map((point) => point.count), 1);
  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Map of archive article locations");

  svg.append(mapShape("rect", { class: "map-water", width, height }));
  const land = createSvgElement("g");
  land.setAttribute("class", "map-land");
  [
    "M0 0h405c-24 38-70 72-72 116-3 61 55 97 19 148-38 53-143 42-181 102-39 61 19 117-24 160-37 37-96 20-147 50z",
    "M154 66c69-42 175-55 232-15 40 28 26 71-32 91-48 17-111 15-139 56-21 30-2 72-47 91-55 23-126-16-144-73-17-54 39-115 130-150z",
    "M302 377c48 16 102 6 134 35 35 31 8 84-42 96-60 14-130-30-141-81-7-34 12-49 49-50z",
    "M754 46c91-34 204-4 258 57 39 44 27 88-28 107-74 25-178-26-219-99-18-32-21-54-11-65z",
    "M873 170c100 10 203 65 255 146 52 80 27 156-54 198-69 36-149 42-187 95-24 34-13 70 16 91H1200V0H909c-64 37-88 83-36 170z",
    "M794 292c38-18 83-9 105 19 20 25 8 54-24 66-39 14-84-6-101-39-12-23-4-38 20-46z",
    "M725 250c22-10 49-5 61 12 10 14 4 33-14 42-24 12-54 3-65-18-7-15-2-27 18-36z",
  ].forEach((d) => land.append(mapShape("path", { d })));
  svg.append(land);

  for (let i = 1; i < 5; i += 1) {
    const vertical = createSvgElement("line");
    vertical.setAttribute("class", "map-gridline");
    vertical.setAttribute("x1", padding + ((width - padding * 2) * i) / 5);
    vertical.setAttribute("x2", padding + ((width - padding * 2) * i) / 5);
    vertical.setAttribute("y1", padding);
    vertical.setAttribute("y2", height - padding);
    svg.append(vertical);
    const horizontal = createSvgElement("line");
    horizontal.setAttribute("class", "map-gridline");
    horizontal.setAttribute("x1", padding);
    horizontal.setAttribute("x2", width - padding);
    horizontal.setAttribute("y1", padding + ((height - padding * 2) * i) / 5);
    horizontal.setAttribute("y2", padding + ((height - padding * 2) * i) / 5);
    svg.append(horizontal);
  }

  const plotted = points.map((point) => {
    const x = padding + ((point.lon - minLon) / lonSpan) * (width - padding * 2);
    const y = height - padding - ((point.lat - minLat) / latSpan) * (height - padding * 2);
    const radius = 5 + Math.sqrt(point.count / maxCount) * (options.compact ? 25 : 34);
    return { ...point, x, y, radius };
  });
  const venues = (options.venues || [])
    .slice(0, options.maxVenues || 120)
    .map((point) => {
      const x = padding + ((point.lon - minLon) / lonSpan) * (width - padding * 2);
      const y = height - padding - ((point.lat - minLat) / latSpan) * (height - padding * 2);
      return { ...point, x, y };
    });
  const labelPoints = plotted
    .filter((point, index) => index < 8 || point.count >= 4)
    .map((point) => {
      point.labelY = point.y;
      return point;
    })
    .sort((a, b) => a.y - b.y);
  labelPoints.forEach((point, index) => {
    if (index === 0) return;
    const previous = labelPoints[index - 1];
    if (Math.abs(point.y - previous.labelY) < 18 && Math.abs(point.x - previous.x) < 120) {
      point.labelY = previous.labelY + 18;
    }
  });

  plotted.forEach((point) => {
    const shouldLabel = labelPoints.includes(point);
    const link = createSvgElement("a");
    link.setAttribute("href", `#entity:cities:${point.slug}`);
    const circle = createSvgElement("circle");
    circle.setAttribute("class", "map-dot");
    circle.setAttribute("cx", point.x.toFixed(2));
    circle.setAttribute("cy", point.y.toFixed(2));
    circle.setAttribute("r", point.radius.toFixed(2));
    const label = createSvgElement("text");
    label.setAttribute("class", "map-label");
    const labelOnLeft = point.x > width - 190;
    label.setAttribute("x", (labelOnLeft ? point.x - point.radius - 8 : point.x + point.radius + 8).toFixed(2));
    label.setAttribute("y", ((point.labelY || point.y) + 4).toFixed(2));
    label.setAttribute("text-anchor", labelOnLeft ? "end" : "start");
    label.textContent = shouldLabel ? point.label : "";
    const title = createSvgElement("title");
    title.textContent = `${point.label}: ${point.count.toLocaleString()} ${point.count === 1 ? "article" : "articles"}`;
    link.append(title, circle, label);
    svg.append(link);
  });

  venues.forEach((point, index) => {
    const link = createSvgElement("a");
    link.setAttribute("href", `#entity:venues:${point.slug}`);
    link.setAttribute("class", `map-venue${index < (options.maxVenueLabels || 12) ? " map-venue-featured" : ""}`);
    const offsetX = ((index % 11) - 5) * 11;
    const offsetY = ((Math.floor(index / 11) % 7) - 3) * 8;
    const x = point.x + offsetX;
    const y = point.y + offsetY;
    const title = createSvgElement("title");
    title.textContent = `${point.label}${point.city ? `, ${point.city}` : ""}: ${point.count.toLocaleString()} ${point.count === 1 ? "article" : "articles"}`;
    const marker = createSvgElement("g");
    marker.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    marker.append(
      mapShape("polygon", { class: "map-venue-roof", points: "-8,-3 0,-11 8,-3" }),
      mapShape("rect", { class: "map-venue-building", x: "-7", y: "-3", width: "14", height: "12", rx: "1" }),
      mapShape("rect", { class: "map-venue-door", x: "-2", y: "2", width: "4", height: "7" }),
      mapShape("line", { class: "map-venue-column", x1: "-5", x2: "-5", y1: "-2", y2: "8" }),
      mapShape("line", { class: "map-venue-column", x1: "5", x2: "5", y1: "-2", y2: "8" })
    );
    const label = createSvgElement("text");
    label.setAttribute("class", "map-venue-label");
    label.setAttribute("x", (x + 11).toFixed(2));
    label.setAttribute("y", (y + 5).toFixed(2));
    label.textContent = point.label;
    link.append(title, marker, label);
    svg.append(link);
  });

  return svg;
}

function createSvgElement(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function mapShape(name, attrs) {
  const node = createSvgElement(name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function archiveHrefForTile(title, key) {
  if (title === "Shakespeare") return "#section:shakespeare";
  if (title === "Other Arts") return "#section:other-arts";

  const collectionSlug = slugForCollection(title);
  if (collectionFromSlug(collectionSlug)) return `#collection:${collectionSlug}`;

  const typeMap = {
    "Book Reviews": "book-reviews",
    Circus: "circus",
    Comedy: "comedy",
    Dance: "dance",
    "Essays & Opinion": "essays-opinion",
    Film: "film",
    "Music & Concerts": "music-concerts",
    "Musical Theatre": "musical-theatre",
    Obituaries: "obituaries",
    Opera: "opera",
    Profiles: "profiles",
    "Site Notes": "site-notes",
    Television: "television",
    "Theatre Reviews": "theatre",
    "Year in Review": "year-in-review",
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
    "Current Collection": "current",
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
    current: "Current Collection",
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
  if (title === "Other Arts") return countForOtherArts();

  const collection = collectionFromSlug(slugForCollection(title));
  if (collection) {
    return state.records.filter((record) => collectionNames(record).includes(collection)).length;
  }

  const typeValue = {
    "Book Reviews": "book-reviews",
    Circus: "circus",
    Comedy: "comedy",
    Dance: "dance",
    "Essays & Opinion": "essays-opinion",
    Film: "film",
    "Music & Concerts": "music-concerts",
    "Musical Theatre": "musical-theatre",
    Obituaries: "obituaries",
    Opera: "opera",
    Profiles: "profiles",
    "Site Notes": "site-notes",
    Television: "television",
    "Theatre Reviews": "theatre",
    "Year in Review": "year-in-review",
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
    "Theatre Reviews": "Straight theatre reviews, previews, news, listings, and awards coverage.",
    Shakespeare: "Play reviews, thoughts, adaptations, and complete play-by-play browsing.",
    "Musical Theatre": "Stage musicals and musical-theatre criticism.",
    Television: "Television criticism from the National Post years.",
    "Music & Concerts": "Concerts, recordings, cabaret, and music writing.",
    "Book Reviews": "Books, theatre books, memoirs, criticism, and related publishing.",
    "Essays & Opinion": "Columns, opinion pieces, and critical reflections.",
    "Year in Review": "Season summaries, rankings, and year-end essays.",
    Profiles: "Profiles, appreciations, interviews, and people-focused writing.",
    Obituaries: "Obituaries, memorial writing, and appreciations.",
    "Other Arts": "Comedy, film, opera, dance, and circus coverage.",
    Comedy: "Comedy reviews and stand-up coverage.",
    Opera: "Opera reviews and related performance writing.",
    Film: "Film reviews and screen criticism.",
    Dance: "Dance reviews and dance coverage.",
    Circus: "Circus reviews and spectacle coverage.",
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
  const blocks = stripFrontmatter(markdown)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const nodes = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const imageMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const figure = document.createElement("figure");
      figure.className = "article-image";
      const image = document.createElement("img");
      image.alt = imageMatch[1] || "";
      image.loading = "lazy";
      image.src = new URL(imageMatch[2], CONTENT_ROOT).toString();
      figure.append(image);
      const next = blocks[index + 1] || "";
      const captionMatch = next.match(/^\*(.*?)\*$/);
      if (captionMatch) {
        const caption = document.createElement("figcaption");
        caption.textContent = captionMatch[1];
        figure.append(caption);
        index += 1;
      }
      nodes.push(figure);
      continue;
    }
    const p = document.createElement("p");
    appendInlineLinkedText(p, block.replace(/\s*\n\s*/g, " "), inlineEntities, linkedSlugs);
    nodes.push(p);
  }
  return nodes;
}

function entityChip(type, label, prefix = "", group = "context") {
  const link = document.createElement("a");
  link.className = `entity-chip entity-${type} entity-group-${group}${type === "productions" ? " entity-chip-featured" : ""}`;
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
  const productionGroups = [
    ["productions", "Production", splitEntityList(record.production_title).slice(0, 4)],
  ].filter(([, , values]) => values.length);
  const contextGroups = [
    ["companies", "Company", splitEntityList(record.company).slice(0, 3)],
    ["venues", "Venue", splitEntityList(record.venue).slice(0, 2)],
    ["cities", "City", splitCityList(record.city).slice(0, 2)],
    ["collections", "Series", collectionNames(record).filter((name) => name === "Short Takes")],
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

  if (!productionGroups.length && !contextGroups.length && !peopleGroups.length) return null;
  const wrap = document.createElement("div");
  wrap.className = "article-entity-groups";

  if (productionGroups.length) wrap.append(articleEntityGroup("Production", productionGroups, "production"));
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
    values.forEach((value) => nav.append(entityChip(type, value, groupType === "production" ? "" : prefix, groupType)));
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

  const body = document.createElement("div");
  body.className = "article-body";
  body.replaceChildren(...paragraphNodes(markdown, record));

  const articleParts = [date, title];
  if (titleParts.deck) articleParts.push(deck);
  articleParts.push(meta);
  const entityLinks = articleEntityLinks(record);
  if (entityLinks) articleParts.push(entityLinks);
  articleParts.push(body);
  els.article.replaceChildren(...articleParts);
  els.articleView.hidden = false;
  els.articleView.scrollIntoView({ behavior: "auto", block: "start" });
}

function route() {
  const hash = window.location.hash || "#home";
  els.drawer.classList.remove("is-open");
  els.articleView.hidden = true;
  els.indexView.hidden = true;
  els.mapView.hidden = true;
  document.body.classList.remove("article-open", "index-open", "map-open", "search-open");

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

  if (hash.startsWith("#section:")) {
    const section = hash.replace("#section:", "");
    document.body.classList.add("index-open");
    renderLandingPage(section);
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#map") {
    document.body.classList.add("map-open");
    renderMapView();
    els.mapView.hidden = false;
    els.mapView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#explore") {
    document.body.classList.add("index-open");
    renderExploreToolV2();
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#timeline") {
    document.body.classList.add("index-open");
    renderTimelineToolV2();
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#about") {
    document.body.classList.add("index-open");
    renderAboutPage();
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#subscribe") {
    document.body.classList.add("index-open");
    renderSubscribePage();
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#critics-circle") {
    document.body.classList.add("index-open");
    renderCriticsCirclePage();
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
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

  if (hash === "#search") {
    document.body.classList.add("search-open");
    resetArchiveControls();
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
  renderCurrentFeature();
  renderHomeMap();
  renderTiles();
  renderSecondaryCollections();
  renderIndexTiles();
  renderResults();
  route();
}

els.menuButton.addEventListener("click", () => {
  els.drawer.classList.toggle("is-open");
});

document.addEventListener("click", (event) => {
  if (!els.drawer.classList.contains("is-open")) return;
  if (els.drawer.contains(event.target) || els.menuButton.contains(event.target)) return;
  els.drawer.classList.remove("is-open");
});

els.drawer.addEventListener("click", (event) => {
  if (event.target.closest("a")) els.drawer.classList.remove("is-open");
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
