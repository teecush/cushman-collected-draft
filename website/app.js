const DATA_URL = new URL("../site_export/data/public_reviews.json?v=111", import.meta.url);
const CHAT_INDEX_URL = new URL("../site_export/data/chat_index.json?v=3", import.meta.url);
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
  "UK Collection",
  SHAKESPEARE_COLLECTION,
  "The Stratford Collection",
  "The Shaw Collection",
  "Short Takes",
];
const SECONDARY_COLLECTION_TILES = [
  "The Canadian Collection",
  "UK Collection",
  "The Stratford Collection",
  "The Shaw Collection",
];
const ENTITY_TYPES = [
  { key: "people", label: "People", singular: "Person" },
  { key: "shakespeare-plays", label: "Shakespeare Plays", singular: "Shakespeare Play" },
  { key: "subjects", label: "Subjects", singular: "Subject" },
  { key: "books", label: "Books", singular: "Book" },
  { key: "productions", label: "Productions", singular: "Production" },
  { key: "book-authors", label: "Book Authors", singular: "Book Author" },
  { key: "publishers", label: "Publishers", singular: "Publisher" },
  { key: "topics", label: "Topics", singular: "Topic" },
  { key: "events", label: "Events", singular: "Event" },
  { key: "networks", label: "Networks & Platforms", singular: "Network/Platform" },
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
  { key: "artists", label: "Artists", singular: "Artist", role: "artists" },
  { key: "producers", label: "Producers", singular: "Producer", role: "producer" },
  { key: "dramaturgs", label: "Dramaturgs", singular: "Dramaturg", role: "dramaturg" },
  { key: "fight-directors", label: "Fight Directors", singular: "Fight Director", role: "fight_director" },
];

const MASTER_INDEX_WORK_FILTERS = [
  { key: "all-works", label: "All Works", typeKeys: ["productions", "books"] },
  { key: "plays", label: "Plays", typeKeys: ["productions"], predicate: (record) => typeGroup(record).value === "theatre" },
  { key: "musicals", label: "Musicals", typeKeys: ["productions"], predicate: (record) => typeGroup(record).value === "musical-theatre" },
  { key: "books", label: "Books", typeKeys: ["books"], predicate: (record) => isBookReview(record) },
  { key: "albums", label: "Albums", typeKeys: ["productions"], predicate: (record) => record.article_category === "Music Review" },
  { key: "concerts", label: "Concerts", typeKeys: ["productions"], predicate: (record) => record.article_category === "Concert Review" },
  { key: "television", label: "Television", typeKeys: ["productions"], predicate: (record) => record.article_category === "Television Review" },
  { key: "films", label: "Films", typeKeys: ["productions"], predicate: (record) => record.article_category === "Film Review" },
];

const MASTER_INDEX_PEOPLE_FILTERS = [
  { key: "all-people", label: "All People", typeKeys: ["people"] },
  { key: "actors", label: "Actors", typeKeys: ["actors"] },
  { key: "directors", label: "Directors", typeKeys: ["directors"] },
  { key: "playwrights", label: "Playwrights", typeKeys: ["playwrights"] },
  { key: "composers-lyricists", label: "Composers & Lyricists", typeKeys: ["composers-lyricists"] },
  { key: "musical-directors", label: "Musical Directors", typeKeys: ["musical-directors"] },
  { key: "choreographers", label: "Choreographers", typeKeys: ["choreographers"] },
  { key: "set-designers", label: "Set Designers", typeKeys: ["set-designers"] },
  { key: "costume-designers", label: "Costume Designers", typeKeys: ["costume-designers"] },
  { key: "lighting-designers", label: "Lighting Designers", typeKeys: ["lighting-designers"] },
  { key: "sound-designers", label: "Sound Designers", typeKeys: ["sound-designers"] },
  { key: "musicians", label: "Musicians", typeKeys: ["musicians"] },
];

const MASTER_INDEX_FILTERS = [...MASTER_INDEX_WORK_FILTERS, ...MASTER_INDEX_PEOPLE_FILTERS];
const DEFAULT_MASTER_INDEX_FILTER = "plays";

const CITY_COORDINATES = new Map(Object.entries({
  "toronto": [43.6532, -79.3832],
  "stratford": [43.3700, -80.9822],
  "stratford ontario": [43.3700, -80.9822],
  "niagara on the lake": [43.2540, -79.0773],
  "london": [51.5072, -0.1276],
  "london england": [51.5072, -0.1276],
  "stratford upon avon": [52.1917, -1.7083],
  "edinburgh": [55.9533, -3.1883],
  "new york": [40.7128, -74.0060],
  "paris": [48.8566, 2.3522],
  "chichester": [50.8365, -0.7792],
  "manchester": [53.4808, -2.2426],
  "glasgow": [55.8642, -4.2518],
  "oxford": [51.7520, -1.2577],
  "cambridge": [52.2053, 0.1218],
  "bristol": [51.4545, -2.5879],
  "nottingham": [52.9548, -1.1581],
  "scarborough": [54.2831, -0.3998],
  "sheffield": [53.3811, -1.4701],
  "leicester": [52.6369, -1.1398],
  "newcastle": [54.9783, -1.6178],
  "salisbury": [51.0688, -1.7945],
  "wimbledon": [51.4214, -0.2064],
  "greenwich": [51.4826, -0.0077],
  "woking": [51.3168, -0.5600],
  "exeter": [50.7184, -3.5339],
  "hammersmith": [51.4927, -0.2340],
  "vienna": [48.2082, 16.3738],
  "los angeles": [34.0522, -118.2437],
  "croydon": [51.3762, -0.0982],
  "birmingham": [52.4862, -1.8904],
  "wavendon": [52.0256, -0.6742],
  "guildford": [51.2362, -0.5704],
}));

const VENUE_COORDINATES = new Map(Object.entries({
  "aldwych theatre": [51.5132, -0.1189],
  "almeida theatre": [51.5395, -0.1020],
  "apollo theatre": [51.5118, -0.1320],
  "arts theatre": [51.5128, -0.1276],
  "barbican theatre": [51.5201, -0.0935],
  "bush theatre": [51.5065, -0.2249],
  "cambridge theatre": [51.5134, -0.1272],
  "chichester festival theatre": [50.8436, -0.7788],
  "comedy theatre": [51.5114, -0.1322],
  "cottesloe theatre": [51.5067, -0.1150],
  "dorfman theatre": [51.5067, -0.1150],
  "donmar warehouse": [51.5137, -0.1269],
  "drury lane theatre": [51.5129, -0.1214],
  "everyman": [51.9007, -2.0750],
  "globe theatre": [51.5081, -0.0972],
  "greenwich theatre": [51.4808, -0.0077],
  "half moon theatre": [51.5127, -0.0545],
  "hampstead theatre": [51.5431, -0.1737],
  "hampstead theatre club": [51.5431, -0.1737],
  "haymarket theatre": [51.5089, -0.1320],
  "her majestys theatre": [51.5080, -0.1323],
  "her majesty s theatre": [51.5080, -0.1323],
  "ica": [51.5066, -0.1308],
  "kings head theatre": [51.5374, -0.1027],
  "lyceum theatre": [51.5116, -0.1198],
  "lyric hammersmith": [51.4928, -0.2267],
  "lyric theatre": [51.5118, -0.1335],
  "lyttelton theatre": [51.5067, -0.1150],
  "london palladium": [51.5146, -0.1408],
  "mayfair theatre": [51.5115, -0.1477],
  "mermaid theatre": [51.5114, -0.1015],
  "national theatre": [51.5067, -0.1150],
  "nottingham playhouse": [52.9545, -1.1586],
  "old vic": [51.5022, -0.1098],
  "olivier theatre": [51.5067, -0.1150],
  "open space": [51.5197, -0.1367],
  "other place": [52.1928, -1.7064],
  "oxford playhouse": [51.7553, -1.2617],
  "phoenix theatre": [51.5147, -0.1298],
  "piccadilly theatre": [51.5101, -0.1343],
  "prince edward theatre": [51.5134, -0.1310],
  "prince of wales theatre": [51.5101, -0.1318],
  "queens theatre": [51.5110, -0.1328],
  "regents park": [51.5313, -0.1569],
  "riverside studios": [51.4880, -0.2249],
  "roundhouse": [51.5432, -0.1519],
  "royal court theatre": [51.4908, -0.1567],
  "royal court theatre upstairs": [51.4908, -0.1567],
  "royal exchange theatre": [53.4828, -2.2448],
  "royal lyceum theatre": [55.9469, -3.2046],
  "royal shakespeare theatre": [52.1909, -1.7046],
  "shaftesbury theatre": [51.5163, -0.1263],
  "shaw theatre": [51.5293, -0.1258],
  "stephen joseph theatre in the round": [54.2806, -0.4058],
  "the other place": [52.1928, -1.7064],
  "the place": [51.5283, -0.1289],
  "traverse theatre": [55.9476, -3.2054],
  "vaudeville theatre": [51.5111, -0.1229],
  "warehouse theatre": [51.3727, -0.0987],
  "westminster theatre": [51.4989, -0.1366],
  "wyndhams theatre": [51.5118, -0.1271],
  "young vic": [51.5033, -0.1077],
}));

[
  ["air canada centre", [43.6435000, -79.3791000]],
  ["al green theatre", [43.6677000, -79.3848000]],
  ["alumnae theatre", [43.6521000, -79.3679000]],
  ["art gallery of ontario", [43.6536000, -79.3925000]],
  ["artword alternative space", [43.6448000, -79.4006000]],
  ["artword theatre", [43.6448000, -79.4006000]],
  ["atlantic theatre festival", [45.0916000, -64.3645000]],
  ["avon theatre", [43.3692000, -80.9811000]],
  ["backspace", [43.6486000, -79.4026000]],
  ["barrymore theatre", [40.7589000, -73.9851000]],
  ["bathurst street theatre", [43.6637000, -79.4106000]],
  ["bayview playhouse", [43.6532000, -79.3832000]],
  ["belasco theatre", [40.7565000, -73.9835000]],
  ["berkeley street theatre", [43.6506000, -79.3641000]],
  ["berkeley street theatre downstairs", [43.6506000, -79.3641000]],
  ["berkeley street theatre upstairs", [43.6506000, -79.3641000]],
  ["berkeley upstairs theatre", [43.6506000, -79.3641000]],
  ["bernard b jacobs theatre", [40.7589000, -73.9851000]],
  ["bluma appel theatre", [43.6474000, -79.3752000]],
  ["brigantine room", [43.6385000, -79.3819000]],
  ["broadhurst theatre", [40.7580000, -73.9865000]],
  ["brooklyn academy of music", [40.6868000, -73.9787000]],
  ["buddies in bad times theatre", [43.6632000, -79.3830000]],
  ["cameron house", [43.6486000, -79.3976000]],
  ["campbell house museum", [43.6508000, -79.3881000]],
  ["canon theatre", [43.6530000, -79.3793000]],
  ["canstage", [43.6474000, -79.3752000]],
  ["capitol event theatre", [43.7076000, -79.3987000]],
  ["charlottetown festival", [46.2382000, -63.1311000]],
  ["church of the holy trinity", [43.6532000, -79.3832000]],
  ["citadel theatre", [53.5461000, -113.4938000]],
  ["coal mine theatre", [43.6780000, -79.3500000]],
  ["coronation park", [43.4675000, -79.6877000]],
  ["court house theatre", [43.2557000, -79.0719000]],
  ["daniels spectrum", [43.6532000, -79.3832000]],
  ["denver theater center", [39.7392000, -104.9903000]],
  ["diesel playhouse", [43.6448000, -79.3911000]],
  ["distillerys fermenting cellar", [43.6487000, -79.3774000]],
  ["dream in high park", [43.6465000, -79.4637000]],
  ["du maurier theatre centre", [43.6385000, -79.3819000]],
  ["eaton centre", [43.6544000, -79.3807000]],
  ["ed mirvish theatre", [43.6530000, -79.3793000]],
  ["elgin theatre", [43.6530000, -79.3793000]],
  ["enwave theatre", [43.6385000, -79.3819000]],
  ["equity showcase theatre", [43.6487000, -79.3774000]],
  ["ethel barrymore theatre", [40.7589000, -73.9851000]],
  ["eugene oneill theatre", [40.7589000, -73.9851000]],
  ["factory studio cafe", [43.6455000, -79.4028000]],
  ["factory studio space", [43.6455000, -79.4028000]],
  ["factory theatre", [43.6455000, -79.4028000]],
  ["factory theatre studio", [43.6455000, -79.4028000]],
  ["festival pavilion", [43.3744000, -80.9686000]],
  ["festival theatre", [43.3744000, -80.9686000]],
  ["festival theatre niagara on the lake", [43.2520000, -79.0677000]],
  ["fleck dance theatre", [43.6385000, -79.3819000]],
  ["flying beaver pubaret", [43.6656000, -79.3677000]],
  ["ford centre for the performing arts", [43.7615000, -79.4111000]],
  ["ford centre studio theatre", [43.7615000, -79.4111000]],
  ["four seasons centre", [43.6506000, -79.3855000]],
  ["four seasons centre for the performing arts", [43.6506000, -79.3855000]],
  ["george brown college theatre", [43.6529000, -79.3636000]],
  ["george ignatieff theatre", [43.6677000, -79.3989000]],
  ["george weston recital hall", [43.7664000, -79.4143000]],
  ["gladstone hotel", [43.6426000, -79.4268000]],
  ["glen morris studio theatre", [43.6654000, -79.3995000]],
  ["gramercy theater", [40.7399080, -73.9849160]],
  ["grand chapiteau", [43.6413000, -79.3546000]],
  ["grand theatre", [42.9849000, -81.2453000]],
  ["gravenhurst opera house", [44.9167000, -79.3667000]],
  ["graydon hall manor", [43.7636000, -79.3592000]],
  ["guloien theatre", [43.6657000, -79.3419000]],
  ["harbourfront centre", [43.6385000, -79.3819000]],
  ["harbourfront studio", [43.6385000, -79.3819000]],
  ["hart house swimming pool", [43.6631000, -79.3957000]],
  ["hart house theatre", [43.6636000, -79.3947000]],
  ["helen gardner phelan playhouse", [43.6616000, -79.3956000]],
  ["heritage park", [44.3894000, -79.6903000]],
  ["high park", [43.6465000, -79.4637000]],
  ["high park amphitheatre", [43.6469000, -79.4643000]],
  ["hummingbird centre", [43.6474000, -79.3752000]],
  ["isabel bader theatre", [43.6505000, -79.3744000]],
  ["jackie maxwell studio", [43.2557000, -79.0719000]],
  ["jane mallett theatre", [43.6487000, -79.3774000]],
  ["jelinek cork shakespeare stage", [43.4675000, -79.6877000]],
  ["joey and toby tanenbaum opera centre", [43.6505000, -79.3653000]],
  ["joseph workman theatre", [43.6430000, -79.4207000]],
  ["kodak theatre", [34.1016000, -118.3267000]],
  ["leah posluns theatre", [43.6487000, -79.3774000]],
  ["leonor and alvin segal theatre", [45.5017000, -73.5673000]],
  ["limelight dinner theatre", [43.6532000, -79.3832000]],
  ["lorraine kimsa theatre", [43.6506220, -79.3640549]],
  ["lorraine kimsa theatre for young people", [43.6506000, -79.3690000]],
  ["lower ossington theatre", [43.6532000, -79.3832000]],
  ["lunt fontanne theatre", [40.7589000, -73.9851000]],
  ["macmillan theatre", [43.6629000, -79.3957000]],
  ["mady centre for the performing arts", [44.3894000, -79.6903000]],
  ["majestic theatre", [40.7562000, -73.9885000]],
  ["margaret fairley park", [43.6687000, -79.4067000]],
  ["marilyn and charles baillie theatre", [43.6503000, -79.3595000]],
  ["martha cohen theatre", [51.0447000, -114.0719000]],
  ["masonic temple", [43.6742000, -79.3886000]],
  ["massey hall", [43.6540000, -79.3790000]],
  ["mysteriously yours", [43.6871000, -79.3957000]],
  ["mysteriously yours dinner theatre", [43.7014000, -79.3973000]],
  ["mysteriously yours mystery dinner theatre", [43.6532000, -79.3832000]],
  ["national arts centre", [45.4215000, -75.6972000]],
  ["national arts centre studio", [45.4215000, -75.6972000]],
  ["national theatre live", [51.5074000, -0.1278000]],
  ["new orleans", [29.9511000, -90.0715000]],
  ["new yorker theatre", [43.6532000, -79.3832000]],
  ["okeefe centre", [43.6474000, -79.3752000]],
  ["ontario place", [43.6271000, -79.4162000]],
  ["ontario place forum", [43.6279000, -79.4162000]],
  ["palace theatre", [40.7589000, -73.9851000]],
  ["palladium theatre", [51.5154000, -0.1415000]],
  ["panasonic theatre", [43.6665000, -79.3855000]],
  ["pantages theatre", [43.6548000, -79.3791000]],
  ["philosophers walk", [43.6629000, -79.3956000]],
  ["philosophers walk outdoor stage", [43.6617000, -79.3950000]],
  ["plymouth theatre", [40.7589000, -73.9851000]],
  ["poor alex theatre", [43.6681000, -79.4026000]],
  ["pop up toronto theatre", [43.6468000, -79.3890000]],
  ["premiere dance theatre", [43.6385000, -79.3819000]],
  ["princess of wales theatre", [43.6470000, -79.3892000]],
  ["private house", [43.6487000, -79.4044000]],
  ["public theater", [40.7128000, -74.0060000]],
  ["rebecca cohn theatre", [44.6376000, -63.5947000]],
  ["red barn theatre", [44.3167000, -79.3333000]],
  ["red sandcastle theatre", [43.6601000, -79.3418000]],
  ["richard rodgers theatre", [40.7589000, -73.9851000]],
  ["richmond hill centre for the performing arts", [43.8828000, -79.4403000]],
  ["ricoh coliseum", [43.6351000, -79.4150000]],
  ["robert gill theatre", [43.6587000, -79.3970000]],
  ["roundhouse theatre", [43.6414000, -79.3860000]],
  ["roy thomson hall", [43.6466000, -79.3863000]],
  ["royal alexandra theatre", [43.6474000, -79.3876000]],
  ["royal george theatre", [43.2563000, -79.0732000]],
  ["saidye bronfman centre", [45.5017000, -73.5673000]],
  ["second city", [43.6452000, -79.3908000]],
  ["segal centre", [45.5017000, -73.5673000]],
  ["shaw festival theatre", [43.2520000, -79.0677000]],
  ["showcase theatre", [43.6487000, -79.3774000]],
  ["simone interiors", [43.6406000, -79.4407000]],
  ["skydome", [43.6414000, -79.3894000]],
  ["sony centre for the performing arts", [43.6474000, -79.3752000]],
  ["spadina museum", [43.6781000, -79.4088000]],
  ["spiegeltent", [43.6385000, -79.3819000]],
  ["st lawrence centre", [43.6474000, -79.3752000]],
  ["st lawrence centre for the arts", [43.6474000, -79.3752000]],
  ["stage downstairs", [43.6506000, -79.3641000]],
  ["stephen sondheim theatre", [40.7589000, -73.9851000]],
  ["storefront theatre", [43.6655000, -79.4204000]],
  ["stratford festival", [43.3744000, -80.9686000]],
  ["streetcar crowsnest", [43.6657000, -79.3419000]],
  ["studio annex", [43.3743517, -80.9685714]],
  ["studio theatre", [43.3695000, -80.9801000]],
  ["talk is free theatre", [44.3894000, -79.6903000]],
  ["tallulahs cabaret", [43.6632000, -79.3830000]],
  ["tank house theatre", [43.6503000, -79.3595000]],
  ["tarragon mainspace", [43.6736000, -79.4050000]],
  ["tarragon theatre", [43.6750000, -79.4129000]],
  ["tarragon theatre backspace", [43.6750000, -79.4129000]],
  ["tarragon theatre extra space", [43.6750000, -79.4129000]],
  ["the bloor hot docs cinema", [43.6654000, -79.4101000]],
  ["the church at berkeley", [43.6506220, -79.3640549]],
  ["the dovercourt", [43.6433000, -79.4221000]],
  ["the great hall", [43.6433000, -79.4221000]],
  ["the old mill", [43.6514000, -79.4937000]],
  ["the opera house", [43.6588000, -79.3487000]],
  ["the playhouse", [49.2827000, -123.1207000]],
  ["the stage upstairs", [43.6455029, -79.4028205]],
  ["theatre by the bay", [44.3894000, -79.6903000]],
  ["theatre centre", [43.6436000, -79.4230000]],
  ["theatre centre west", [43.6485882, -79.4026161]],
  ["theatre museum canada", [43.6468000, -79.3923000]],
  ["theatre passe muraille", [43.6486000, -79.4026000]],
  ["theatre passe muraille backspace", [43.6486000, -79.4026000]],
  ["theatre passe muraille mainspace", [43.6486000, -79.4026000]],
  ["theatre passe murailles backspace", [43.6485882, -79.4026161]],
  ["theatre royal drury lane", [51.5074000, -0.1278000]],
  ["third stage", [43.3695000, -80.9801000]],
  ["tim sims playhouse", [43.6442000, -79.3916000]],
  ["times theatre", [43.6632000, -79.3830000]],
  ["tom patterson theatre", [43.3736000, -80.9781000]],
  ["top o the senator", [43.6552000, -79.3793000]],
  ["toronto centre for the arts", [43.7661000, -79.4145000]],
  ["toronto centre for the arts studio theatre", [43.7615000, -79.4111000]],
  ["university of michigan", [42.2780000, -83.7382000]],
  ["various london venues", [51.5074000, -0.1278000]],
  ["vivian beaumont theater", [40.7725000, -73.9838000]],
  ["walmer centre theatre", [43.6686000, -79.4027000]],
  ["winchester street theatre", [43.6660000, -79.3668000]],
  ["winter garden theatre", [43.6530000, -79.3793000]],
  ["withrow park", [43.6725000, -79.3472000]],
  ["york quay studio theatre", [43.6385000, -79.3819000]],
  ["young centre for the performing arts", [43.6503000, -79.3595000]],
  ["young peoples theatre", [43.6495000, -79.3683000]],
].forEach(([label, coordinates]) => {
  if (!VENUE_COORDINATES.has(label)) VENUE_COORDINATES.set(label, coordinates);
});

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
const CATEGORY_BROWSE_PROFILES = {
  theatre: { groupLabel: "Productions", entityType: "productions", emptyLabel: "Articles without a production", intro: "Browse theatre reviews by production first, then open the linked production index for all related articles." },
  "musical-theatre": { groupLabel: "Productions", entityType: "productions", emptyLabel: "Articles without a production", intro: "Browse musical-theatre writing by show title, then drill into the articles for that show." },
  television: { groupLabel: "Shows", entityType: "productions", secondaryEntityType: "networks", secondaryLabel: "Networks And Platforms", emptyLabel: "Articles without a show title", intro: "Television writing is grouped by show or program title so recurring coverage reads as a clear path." },
  "book-reviews": { groupLabel: "Books", entityType: "books", secondaryEntityType: "book-authors", secondaryLabel: "Authors", emptyLabel: "Articles without a book title", intro: "Book reviews are grouped by reviewed book, with a secondary author index for broader reading paths." },
  "music-concerts": { groupLabel: "Artists And Musicians", entityType: "musicians", secondaryEntityType: "productions", secondaryLabel: "Recordings, Concerts, And Performances", emptyLabel: "Articles without an artist", intro: "Music and concert writing is grouped by artist first, with reviewed recordings and performances available as the secondary path." },
  opera: { groupLabel: "Productions", entityType: "productions", emptyLabel: "Articles without a production", intro: "Opera reviews are grouped by production title and can also be filtered by company, venue, and city." },
  comedy: { groupLabel: "Shows", entityType: "productions", secondaryEntityType: "performers", secondaryLabel: "Performers", emptyLabel: "Articles without a show title", intro: "Comedy coverage is grouped by show where possible, with performer paths for stand-up, revue, and solo work." },
  film: { groupLabel: "Films", entityType: "productions", secondaryEntityType: "directors", secondaryLabel: "Directors", emptyLabel: "Articles without a film title", intro: "Film reviews are grouped by film title first, with director and cast indexes still available through chips." },
  dance: { groupLabel: "Dance Works", entityType: "productions", secondaryEntityType: "choreographers", secondaryLabel: "Choreographers", emptyLabel: "Articles without a work title", intro: "Dance reviews are grouped by work or program title, with choreographer paths where available." },
  circus: { groupLabel: "Shows", entityType: "productions", emptyLabel: "Articles without a show title", intro: "Circus reviews are grouped by show title." },
  profiles: { groupLabel: "Subjects", entityType: "subjects", secondaryEntityType: "productions", secondaryLabel: "Current Work Context", emptyLabel: "Profiles without a subject", intro: "Profiles are grouped by subject rather than by incidental productions mentioned in career context." },
  obituaries: { groupLabel: "Subjects", entityType: "subjects", emptyLabel: "Obituaries without a subject", intro: "Obituaries are grouped by the person being remembered." },
  "essays-opinion": { groupLabel: "Topics", entityType: "topics", secondaryEntityType: "productions", secondaryLabel: "Related Works", emptyLabel: "Ungrouped essays", intro: "Opinion pieces are grouped by topic first, with concrete works kept as secondary links when they are central." },
  "year-in-review": { groupLabel: "Seasons And Topics", entityType: "topics", secondaryEntityType: "productions", secondaryLabel: "Referenced Works", emptyLabel: "Season summaries", intro: "Year-in-review pieces are topic-led, with work links only where the article has a clear structured focus." },
  "site-notes": { groupLabel: "Correction Targets", entityType: "topics", emptyLabel: "General notes", intro: "Corrections and site notes are kept compact and chronological." },
};
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
      "The Two Gentlemen of Verona",
      "The Two Noble Kinsmen",
      "The Winter's Tale",
    ],
  },
  {
    label: "Tragedies",
    titles: ["Antony and Cleopatra", "Coriolanus", "Cymbeline", "Julius Caesar", "King Lear", "Macbeth", "Othello", "Romeo and Juliet", "Hamlet", "Timon of Athens", "Titus Andronicus", "Troilus and Cressida"],
  },
  {
    label: "Histories",
    titles: ["Henry IV", "Henry V", "Henry VI", "Henry VIII", "King John", "Richard II", "Richard III"],
  },
];

const SHAKESPEARE_PLAY_TITLES = SHAKESPEARE_PLAY_GROUPS.flatMap((group) => group.titles);
const SHAKESPEARE_PLAY_ALIASES = new Map(
  Object.entries({
    "antony cleopatra": "Antony and Cleopatra",
    "romeo juliet": "Romeo and Juliet",
    "troilus cressida": "Troilus and Cressida",
    "two gentlemen verona": "The Two Gentlemen of Verona",
    "the two gentlemen verona": "The Two Gentlemen of Verona",
    "comedy errors": "The Comedy of Errors",
    "the comedy errors": "The Comedy of Errors",
    "merry wives windsor": "The Merry Wives of Windsor",
    "the merry wives windsor": "The Merry Wives of Windsor",
    "merchant venice": "The Merchant of Venice",
    "the merchant venice": "The Merchant of Venice",
    "midsummer nights dream": "A Midsummer Night's Dream",
    "a midsummer nights dream": "A Midsummer Night's Dream",
    "taming shrew": "The Taming of the Shrew",
    "the taming shrew": "The Taming of the Shrew",
    "tempest": "The Tempest",
    "the tempest": "The Tempest",
    "winters tale": "The Winter's Tale",
    "the winters tale": "The Winter's Tale",
    "alls well that ends well": "All's Well That Ends Well",
    "loves labours lost": "Love's Labour's Lost",
    "the prince hamlet": "Hamlet",
    "prince hamlet": "Hamlet",
    "lear": "King Lear",
    "king henry viii all is true": "Henry VIII",
    "henry iv part one": "Henry IV",
    "henry iv part two": "Henry IV",
    "henry vi part one": "Henry VI",
    "henry vi part two": "Henry VI",
    "henry vi part three": "Henry VI",
    "titus": "Titus Andronicus",
    "juliet and romeo": "Romeo and Juliet",
  }).map(([alias, title]) => [canonicalPlayKey(alias), title])
);
const SHAKESPEARE_PLAY_BY_KEY = new Map(SHAKESPEARE_PLAY_TITLES.map((title) => [canonicalPlayKey(title), title]));

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
    "The Two Gentlemen of Verona",
    "The Two Noble Kinsmen",
    "The Winter's Tale",
    "Antony and Cleopatra",
    "Coriolanus",
    "Cymbeline",
    "Julius Caesar",
    "King Lear",
    "Macbeth",
    "Othello",
    "Romeo and Juliet",
    "Hamlet",
    "Timon of Athens",
    "Titus Andronicus",
    "Troilus and Cressida",
    "Henry IV",
    "Henry V",
    "Henry VI",
    "Henry VIII",
    "King John",
    "Richard II",
    "Richard III",
  ],
  collections: [
    "The Canadian Collection",
    "UK Collection",
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
  "The Two Gentlemen of Verona": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918767950-GK3R8N49KBKH14ID0VTZ/Two+Gentleman.png?format=750w",
  "The Two Noble Kinsmen": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918780500-K6CXGC6BUU6FQMM8IUAK/Two+Noble.png?format=750w",
  "The Winter's Tale": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918780811-RYV5UBHEFTW5U8ZLM0JC/Winter%27s+Tale.png?format=750w",
  "Antony and Cleopatra": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918792163-D0BEF4LRYEFOFBG48E1L/Antony+%26+Cleopatra.png?format=750w",
  Coriolanus: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918793484-S5FF5MG07MX5QCBJ1Y9N/Coriolanus.png?format=750w",
  Cymbeline: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918804503-YUN7M5ANHF7GM376PJER/Cymbeline.png?format=750w",
  "Julius Caesar": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918816978-GR2Q3HBH95JQJGECGMVO/Julius+Caesar.png?format=750w",
  "King Lear": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918818992-GEZHNNC3QVUY751QFM7I/King+Lear.png?format=750w",
  Macbeth: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918829561-NDU0JAUAEOP2DM9ERDYL/Macbeth.png?format=750w",
  Othello: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918831738-LN949S2N55PIE7FXFTCE/Othello.png?format=750w",
  "Romeo and Juliet": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918842053-3W7KR0JJUJREHTDJSMKW/Romeo+%26+Juliet.png?format=750w",
  Hamlet: "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918806323-6HW95M5V0RDGR8GPN9VR/Hamlet.png?format=750w",
  "Timon of Athens": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918844472-LQKEKN7ZAAMY7CR86B4P/Timon.png?format=750w",
  "Titus Andronicus": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918854274-QO6COSNU8IIO3SSMVS0Q/Titus.png?format=750w",
  "Troilus and Cressida": "https://images.squarespace-cdn.com/content/v1/5b686ff89d5abba58f12a1bd/1554918856888-V09OIA9DCYOO02SZEP4K/Troilus+%26+Cressida.png?format=750w",
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
  chatIndex: null,
  chatIndexPromise: null,
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

const CHAT_SUGGESTIONS = [
  "What did he make of Hamlet?",
  "How did he write about Stratford?",
  "Who comes up around Shaw?",
  "What did he really think about The Wire?",
];

const CHAT_STOP_WORDS = new Set([
  "about", "after", "again", "also", "among", "and", "any", "are", "around", "ask", "been", "being", "but", "came", "can", "come", "comes", "did", "does", "for", "from", "had", "has", "have", "her", "him", "his", "how", "into", "its", "make", "made", "more", "most", "not", "our", "out", "over", "say", "said", "she", "that", "the", "their", "them", "then", "there", "these", "they", "think", "this", "through", "was", "were", "what", "when", "where", "which", "who", "why", "with", "would", "write", "wrote",
]);

const CHAT_POSITIVE_WORDS = new Set([
  "admirable", "admiring", "affecting", "alive", "assurance", "beautiful", "best", "brilliant", "celebrate", "charming", "comic", "credible", "delightful", "electric", "excellent", "fine", "fun", "funniest", "generous", "good", "great", "hilarious", "impressive", "magnificent", "moving", "pleasure", "rich", "sharp", "splendid", "strong", "superb", "triumph", "triumphant", "vivid", "wonderful",
]);

const CHAT_NEGATIVE_WORDS = new Set([
  "awkward", "bad", "banal", "boring", "clotted", "confused", "deplorable", "disappointing", "dull", "failed", "fails", "failure", "flat", "lifeless", "muddled", "obscure", "overdone", "poor", "puzzling", "thin", "tired", "trouble", "weak", "wrong",
]);

const CHAT_GENERIC_LABEL_WORDS = new Set([
  "collection", "festival", "theatre", "theater", "company", "review", "reviews", "article", "articles", "current", "national", "royal", "stage",
]);

const CHAT_COMMON_WORDS = new Set([
  ...CHAT_STOP_WORDS,
  "actor", "actors", "also", "audience", "character", "characters", "company", "director", "evening", "first", "least", "little", "much", "part", "play", "plays", "production", "productions", "review", "scene", "scenes", "stage", "theatre", "thing", "things", "time", "work",
]);

const CHAT_CHATTER_MOTIFS = new Set([
  "article", "articles", "because", "being", "could", "every", "going", "nothing", "other", "people", "really", "should", "something", "their", "there", "these", "through", "which", "while", "without", "would",
]);

const CHAT_THEMES = [
  {
    key: "acting",
    label: "acting",
    terms: ["actor", "actors", "acting", "performance", "performances", "performer", "cast", "voice", "voices", "role", "roles"],
    principle: "He treats it first as an actors' problem: not whether the idea is respectable, but whether thought, rhythm, and risk are alive in the playing.",
  },
  {
    key: "staging",
    label: "staging",
    terms: ["director", "directed", "direction", "staging", "production", "set", "sets", "lighting", "design", "visual", "stage"],
    principle: "He is hospitable to a strong production idea, but only if it clarifies pressure already present in the work.",
  },
  {
    key: "shape",
    label: "shape",
    terms: ["form", "shape", "structure", "plot", "pace", "pacing", "length", "long", "short", "scene", "scenes", "act"],
    principle: "He keeps asking whether the evening has momentum, proportion, and a reason for being as long or as brief as it is.",
  },
  {
    key: "language",
    label: "language",
    terms: ["language", "line", "lines", "text", "words", "speech", "verse", "dialogue", "translation", "write", "writing"],
    principle: "Language is not ornament for him; it is action. A line has to do something, not simply announce that literature is present.",
  },
  {
    key: "comedy",
    label: "comedy",
    terms: ["comic", "comedy", "funny", "laugh", "laughs", "farce", "wit", "joke", "jokes", "hilarious"],
    principle: "Comedy, in this archive, is judged by exactness. Noise and bustle are no substitute for a comic mechanism that actually works.",
  },
  {
    key: "music",
    label: "music",
    terms: ["music", "musical", "song", "songs", "singer", "singing", "score", "rhythm", "orchestra", "dance"],
    principle: "Music is valued theatrically: polish matters, but so does whether song, rhythm, and performance alter the dramatic temperature.",
  },
  {
    key: "politics",
    label: "politics",
    terms: ["political", "politics", "power", "class", "history", "social", "society", "moral", "morality", "public"],
    principle: "Politics matters when it has been dramatized, not when it has merely been stapled to the programme note.",
  },
  {
    key: "revival",
    label: "revival",
    terms: ["revival", "revived", "version", "adaptation", "adapted", "modern", "modernize", "classic", "tradition", "new"],
    principle: "He is not pious about classics. Revival and adaptation earn their keep by discovering something, not by genuflecting.",
  },
  {
    key: "feeling",
    label: "feeling",
    terms: ["feeling", "emotion", "moving", "touching", "heart", "human", "warmth", "sympathy", "affecting"],
    principle: "Feeling is welcome, but he distrusts emotional blackmail; the production has to earn the response it asks for.",
  },
];

const CHAT_TRAGEDY_SUBJECTS = new Set([
  "hamlet", "king lear", "macbeth", "othello", "romeo and juliet", "antony and cleopatra", "coriolanus", "julius caesar", "titus andronicus", "troilus and cressida",
]);

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

function uniqueEntityValues(values, transform = (value) => value) {
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const label = String(transform(value) || "").trim();
    if (!label) return;
    const slug = entitySlug(label);
    if (seen.has(slug)) return;
    seen.add(slug);
    result.push(label);
  });
  return result;
}

const SUBJECT_ROLE_ENTITY = {
  director: { type: "directors", label: "Director" },
  actors: { type: "actors", label: "Actor" },
  playwright: { type: "playwrights", label: "Playwright" },
  composer_lyricist: { type: "composers-lyricists", label: "Composer/Lyricist" },
  musical_director: { type: "musical-directors", label: "Musical Director" },
  choreographer: { type: "choreographers", label: "Choreographer" },
  producer: { type: "producers", label: "Producer" },
  set_designer: { type: "set-designers", label: "Set Designer" },
  costume_designer: { type: "costume-designers", label: "Costume Designer" },
  lighting_designer: { type: "lighting-designers", label: "Lighting Designer" },
  sound_designer: { type: "sound-designers", label: "Sound Designer" },
  musicians: { type: "musicians", label: "Musician" },
  performers: { type: "performers", label: "Performer" },
  artists: { type: "artists", label: "Artist" },
  dramaturg: { type: "dramaturgs", label: "Dramaturg" },
  fight_director: { type: "fight-directors", label: "Fight Director" },
};

function subjectRoleMap(record) {
  return Array.isArray(record.subject_role_map)
    ? record.subject_role_map.filter((entry) => entry && typeof entry === "object" && entry.person)
    : [];
}

function subjectRoleEntry(record, person) {
  const personSlug = entitySlug(person);
  return subjectRoleMap(record).find((entry) => entitySlug(entry.person) === personSlug) || null;
}

function subjectRolesFor(record, role) {
  return subjectRoleMap(record)
    .filter((entry) => Array.isArray(entry.roles) && entry.roles.includes(role))
    .map((entry) => entry.person);
}

function subjectChipInfo(record, person) {
  const entry = subjectRoleEntry(record, person);
  const roles = Array.isArray(entry?.roles) ? entry.roles.filter((role) => SUBJECT_ROLE_ENTITY[role]) : [];
  if (!roles.length) return { type: "subjects", prefix: "Subject" };
  const first = SUBJECT_ROLE_ENTITY[roles[0]];
  const prefix = roles.slice(0, 2).map((role) => SUBJECT_ROLE_ENTITY[role].label).join(" / ");
  return { type: first.type, prefix };
}

function productionGroups(record) {
  return Array.isArray(record.production_groups)
    ? record.production_groups.filter((group) => group && typeof group === "object" && group.production_title && !isNonWorkProductionLabel(group.production_title))
    : [];
}

function isBookReview(record) {
  return String(record.article_category || "").trim().toLowerCase() === "book review";
}

function groupedEntityValues(record, key, transform = splitEntityList) {
  return uniqueEntityValues(
    productionGroups(record).flatMap((group) => transform(group[key] || []))
  );
}

function groupedRoleValues(record, role) {
  return groupedEntityValues(record, role);
}

function valuesExceptGrouped(flatValues, groupedValues) {
  const groupedSlugs = new Set(groupedValues.map(entitySlug));
  return uniqueEntityValues(flatValues).filter((value) => !groupedSlugs.has(entitySlug(value)));
}

function isNonWorkProductionLabel(value) {
  const label = String(value || "").trim();
  if (!/^(19|20)\d{2}\b/.test(label)) return false;
  return /\b(awards?|nominations?|performances?|previews?|season|year in review)\b/i.test(label);
}

function productionLabelValues(value) {
  if (Array.isArray(value)) return value.flatMap((item) => productionLabelValues(item));
  const raw = String(value || "").trim();
  if (!raw || isNonWorkProductionLabel(raw)) return [];
  return splitEntityList(raw).filter((label) => !isNonWorkProductionLabel(label));
}

function groupedProductionLabelValues(record) {
  return uniqueEntityValues(productionGroups(record).flatMap((group) => productionLabelValues(group.production_title)));
}

function canonicalPlayKey(value) {
  return normalizeSearchText(value)
    .replace(/\b(the|a)\b/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/\bpart\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shakespearePlayTitle(value) {
  const key = canonicalPlayKey(value);
  if (!key) return "";
  return SHAKESPEARE_PLAY_BY_KEY.get(key) || SHAKESPEARE_PLAY_ALIASES.get(key) || "";
}

function shakespearePlayValues(record) {
  const values = [
    ...productionLabelValues(record.production_title),
    ...groupedProductionLabelValues(record),
  ];
  return uniqueEntityValues(values.map(shakespearePlayTitle).filter(Boolean));
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

function displaySchema(record) {
  const category = String(record.article_category || "");
  if (category === "Book Review") {
    return {
      workType: "books",
      workLabel: "Book",
      groupWorkLabel: "Book",
      companyLabel: "Publisher",
      venueLabel: "Context",
      cityLabel: "Place",
      roleLabels: { actors: "People", playwright: "Author", artists: "Artists" },
    };
  }
  if (category === "Television Review") {
    return {
      workType: "productions",
      workLabel: "Show",
      groupWorkLabel: "Show",
      companyLabel: "Network",
      venueLabel: "Venue",
      cityLabel: "Place",
      roleLabels: { actors: "Cast", playwright: "Writer", director: "Director", artists: "Creators", performers: "Performers" },
    };
  }
  if (category === "Film Review") {
    return {
      workType: "productions",
      workLabel: "Film",
      groupWorkLabel: "Film",
      companyLabel: "Studio",
      venueLabel: "Venue",
      cityLabel: "Place",
      roleLabels: { actors: "Cast", playwright: "Screenwriter", director: "Director", composer_lyricist: "Music" },
    };
  }
  if (category === "Music Review" || category === "Concert Review") {
    return {
      workType: "productions",
      workLabel: category === "Concert Review" ? "Concert" : "Recording",
      groupWorkLabel: category === "Concert Review" ? "Concert" : "Recording",
      companyLabel: "Label",
      venueLabel: "Venue",
      cityLabel: "City",
      roleLabels: { musicians: "Artist", performers: "Performer", composer_lyricist: "Composer/Lyricist", musical_director: "Music Director" },
    };
  }
  if (category === "Obituary" || category === "Profile" || (category === "Theatre Interview" && splitEntityList(record.subject_people).length)) {
    return {
      workType: "subjects",
      workLabel: "Subject",
      groupWorkLabel: "Subject",
      companyLabel: "Company",
      venueLabel: "Venue",
      cityLabel: "Place",
      roleLabels: { actors: "Performer", artists: "Artist" },
    };
  }
  if (category === "Opinion Piece" || category === "Year in Review" || category === "Correction") {
    return {
      workType: "topics",
      workLabel: category === "Correction" ? "Correction" : "Topic",
      groupWorkLabel: category === "Correction" ? "Correction" : "Topic",
      companyLabel: "Organization",
      venueLabel: "Venue",
      cityLabel: "Place",
      roleLabels: {},
    };
  }
  if (category === "Awards Coverage" || category === "Events Listing") {
    return {
      workType: "events",
      workLabel: "Event",
      groupWorkLabel: "Event",
      companyLabel: "Organization",
      venueLabel: "Venue",
      cityLabel: "Place",
      roleLabels: {},
    };
  }
  if (category === "Theatre Interview") {
    return {
      workType: "productions",
      workLabel: "Current Work",
      groupWorkLabel: "Work",
      companyLabel: "Company",
      venueLabel: "Venue",
      cityLabel: "Place",
      roleLabels: { actors: "Performer", artists: "Artist" },
    };
  }
  return {
    workType: "productions",
    workLabel: "Production",
    groupWorkLabel: "Production",
    companyLabel: "Company",
    venueLabel: "Venue",
    cityLabel: "City",
    roleLabels: {},
  };
}

function collectionCount(name) {
  return state.records.filter((record) => collectionNames(record).includes(name)).length;
}

function countBadgeText(count) {
  const value = Number(count || 0);
  return value > 1 ? value.toLocaleString() : "";
}

function countUnitText(count, singular = "record", plural = `${singular}s`) {
  const value = Number(count || 0);
  if (value > 1) return `${value.toLocaleString()} ${plural}`;
  return "";
}

function optionLabelWithCount(label, count) {
  const value = Number(count || 0);
  return value > 1 ? `${label} (${value.toLocaleString()})` : label;
}

function entityValues(record, type) {
  const role = entityType(type)?.role;
  if (role) return uniqueEntityValues([...splitEntityList(record.roles?.[role] || []), ...groupedRoleValues(record, role), ...subjectRolesFor(record, role)]);
  if (type === "people") return uniqueEntityValues([...(record.people || []), ...splitEntityList(record.book_author), ...splitEntityList(record.subject_people), ...productionGroups(record).flatMap((group) => ENTITY_TYPES.filter((item) => item.role).flatMap((item) => splitEntityList(group[item.role] || [])))]);
  if (type === "subjects") return uniqueEntityValues(splitEntityList(record.subject_people));
  if (type === "books") return isBookReview(record) ? uniqueEntityValues([...splitEntityList(record.book_title || record.production_title), ...groupedEntityValues(record, "production_title")]) : [];
  if (type === "shakespeare-plays") return collectionNames(record).includes(SHAKESPEARE_COLLECTION) ? shakespearePlayValues(record) : [];
  if (type === "productions") return isBookReview(record) ? [] : uniqueEntityValues([...productionLabelValues(record.production_title), ...groupedProductionLabelValues(record)]);
  if (type === "book-authors") return uniqueEntityValues(splitEntityList(record.book_author));
  if (type === "publishers") return uniqueEntityValues(splitEntityList(record.publisher));
  if (type === "topics") return uniqueEntityValues(splitEntityList(record.topic || record.correction_target));
  if (type === "events") return uniqueEntityValues(splitEntityList(record.event_name));
  if (type === "networks") return uniqueEntityValues(splitEntityList(record.network_or_platform || (record.article_category === "Television Review" ? record.company : "")));
  if (type === "companies") return uniqueEntityValues([...splitEntityList(record.company), ...groupedEntityValues(record, "company")]);
  if (type === "venues") return uniqueEntityValues([...splitEntityList(record.venue), ...groupedEntityValues(record, "venue")]);
  if (type === "cities") return uniqueEntityValues([...splitCityList(record.city), ...groupedEntityValues(record, "city", splitCityList)]);
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

function coordinateKey(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function coordinatesForCity(city) {
  return CITY_COORDINATES.get(coordinateKey(normalizeCityName(city))) || CITY_COORDINATES.get(coordinateKey(city));
}

function coordinatesForVenue(venue) {
  return VENUE_COORDINATES.get(coordinateKey(venue));
}

function normalizePointCoordinates(coordinates) {
  if (coordinates && typeof coordinates === "object" && !Array.isArray(coordinates)) {
    const lat = Number(coordinates.lat);
    const lon = Number(coordinates.lon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
  }
  if (!Array.isArray(coordinates)) return null;
  const lat = Number(coordinates[0]);
  const lon = Number(coordinates[1]);
  if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
  return null;
}

function pointCoordinates(record, city = "", venue = "", directCoordinates = null) {
  const direct = normalizePointCoordinates(directCoordinates);
  if (direct) return direct;
  if (venue) {
    const venueCoordinates = coordinatesForVenue(venue);
    if (venueCoordinates) return venueCoordinates;
  }
  if (venue && !productionGroups(record).length) {
    const recordCoordinates = normalizePointCoordinates(record.coordinates);
    if (recordCoordinates) return recordCoordinates;
  }
  if (city) {
    const cityCoordinates = coordinatesForCity(city);
    if (cityCoordinates) return cityCoordinates;
  }
  return normalizePointCoordinates(record.coordinates);
}

function recordVenueCityPairs(record) {
  const pairs = [];
  productionGroups(record).forEach((group) => {
    const venues = splitEntityList(group.venue);
    const cities = splitCityList(group.city);
    if (venues.length) {
      venues.forEach((venue, index) => pairs.push({
        venue,
        city: cities[index] || cities[0] || splitCityList(record.city)[0] || "",
        coordinates: normalizePointCoordinates(group.coordinates),
      }));
    } else {
      cities.forEach((city) => pairs.push({ venue: "", city, coordinates: normalizePointCoordinates(group.coordinates) }));
    }
  });
  if (pairs.length) return pairs;
  const venues = splitEntityList(record.venue);
  const cities = splitCityList(record.city);
  venues.forEach((venue, index) => pairs.push({ venue, city: cities[index] || cities[0] || "", coordinates: null }));
  return pairs;
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
    const groupPairs = recordVenueCityPairs(record);
    const cityPairs = groupPairs.length
      ? groupPairs.filter((pair) => pair.city)
      : splitCityList(record.city).map((city) => ({ city, venue: "", coordinates: null }));
    cityPairs.forEach(({ city, venue, coordinates: pairCoordinates }) => {
      const coordinates = pointCoordinates(record, city, venue, pairCoordinates);
      if (!coordinates) return;
      const [lat, lon] = coordinates;
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
    recordVenueCityPairs(record).forEach(({ venue, city, coordinates: pairCoordinates }) => {
      const coordinates = pointCoordinates(record, city, venue, pairCoordinates);
      if (!coordinates) return;
      const [lat, lon] = coordinates;
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

function isPersonIndex(typeKey) {
  const type = entityType(typeKey);
  return Boolean(typeKey === "people" || type?.role);
}

function personNameParts(label) {
  const text = String(label || "").trim();
  if (!text || text.includes(",") || !/\s/.test(text)) return { display: text, sort: text };

  const suffixes = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv"]);
  const particles = new Set(["da", "de", "del", "della", "der", "des", "di", "dos", "du", "la", "le", "st", "st.", "van", "von"]);
  const words = text.split(/\s+/);
  const suffix = suffixes.has(words.at(-1)?.toLowerCase()) ? words.pop() : "";
  let lastStart = words.length - 1;

  while (lastStart > 0 && particles.has(words[lastStart - 1].toLowerCase())) {
    lastStart -= 1;
  }

  const lastName = words.slice(lastStart).join(" ");
  const firstNames = words.slice(0, lastStart).join(" ");
  const display = [lastName, [firstNames, suffix].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return { display, sort: display };
}

function indexDisplayLabel(typeKey, label) {
  return isPersonIndex(typeKey) ? personNameParts(label).display : label;
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

function articlePublicationLabel(record) {
  return record.publication || record.source_publication || "";
}

function articleWorkValues(record) {
  const schema = displaySchema(record);
  if (["Obituary", "Profile", "Theatre Interview"].includes(String(record.article_category || ""))) {
    const subjects = splitEntityList(record.subject_people);
    if (subjects.length) return uniqueEntityValues(subjects);
  }
  if (schema.workType === "topics") return uniqueEntityValues(splitEntityList(record.topic || record.correction_target));
  if (schema.workType === "events") return uniqueEntityValues(splitEntityList(record.event_name));
  if (schema.workType === "books") return uniqueEntityValues(splitEntityList(record.book_title || record.production_title));
  const values = uniqueEntityValues([
    ...productionLabelValues(record.production_title),
    ...groupedProductionLabelValues(record),
  ]);
  if (!isBookReview(record)) return values;
  return uniqueEntityValues(values.flatMap((value) => value.split(/\s+\/\s+/).map((part) => part.trim()).filter(Boolean)));
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']+/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function pushSearchValue(parts, value) {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    value.forEach((item) => pushSearchValue(parts, item));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => pushSearchValue(parts, item));
    return;
  }
  const text = String(value).trim();
  if (text) parts.push(text);
}

function searchableParts(record) {
  const parts = [
    record.title,
    record.production_title,
    record.company,
    record.venue,
    record.city,
    record.publication,
    record.source_publication,
    record.article_category,
    typeLabel(record),
    record.date,
    record.year,
    ...collectionNames(record),
  ];

  [
    record.people,
    record.roles,
    record.production_groups,
    record.browse_entities,
    record.subject_people,
    record.subject_role_map,
    record.book_title,
    record.book_author,
    record.publisher,
    record.topic,
    record.event_name,
    record.network_or_platform,
    record.featured_artists,
    record.recording_title,
    record.film_title,
    record.concert_title,
    record.studio_or_distributor,
    record.correction_target,
  ].forEach((value) => pushSearchValue(parts, value));

  return parts;
}

function searchable(record) {
  if (!record._searchableText) {
    record._searchableText = normalizeSearchText(searchableParts(record).join(" "));
  }
  return record._searchableText;
}

function recordMatchesQuery(record, rawQuery) {
  const query = normalizeSearchText(rawQuery);
  if (!query) return true;
  const haystack = searchable(record);
  if (haystack.includes(query)) return true;
  const tokens = query.split(/\s+/).filter((token) => token.length > 1);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
}

function applyFilters() {
  const query = state.query.trim();
  state.hasActiveQuery = hasActiveFilters();
  syncArchivePageClass();
  setArchiveExpanded(state.hasActiveQuery || document.activeElement === els.searchInput);
  state.filtered = state.records.filter((record) => {
    if (state.collection && !collectionNames(record).includes(state.collection)) return false;
    if (state.type && typeGroup(record).value !== state.type) return false;
    if (state.collection === SHAKESPEARE_COLLECTION && state.shakespeareGroup) {
      if (shakespeareGroup(record) !== state.shakespeareGroup) return false;
    }
    if (query && !recordMatchesQuery(record, query)) return false;
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
  syncArchivePageClass();
  els.searchInput.value = "";
  els.typeFilter.value = "";
  els.collectionFilter.value = "";
  setArchiveExpanded(false);
  renderShakespeareNav();
  renderResults();
}

function syncArchivePageClass() {
  const hash = window.location.hash || "#home";
  const isArchiveRoute =
    hash.startsWith("#archive") || hash.startsWith("#collection:") || hash === "#search";
  document.body.classList.toggle("search-open", state.hasActiveQuery || isArchiveRoute);
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
    .forEach((name) => els.collectionFilter.append(makeOption(optionLabelWithCount(name, collections.get(name)), name)));

  els.typeFilter.replaceChildren(makeOption("All types", ""));
  [...types.values()]
    .filter((group) => group.count)
    .forEach((group) => els.typeFilter.append(makeOption(optionLabelWithCount(group.label, group.count), group.value)));
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
    const groupCount = shakespeareGroupCount(group.value);
    button.innerHTML = `<strong>${group.label}</strong>${groupCount > 1 ? `<span>${groupCount.toLocaleString()} records</span>` : ""}<em>${group.description}</em>`;
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
      meta.textContent = count > 1 ? `${count.toLocaleString()} records` : "Browse";
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
    meta.textContent = count > 1 ? `${count.toLocaleString()} records` : "Browse";
    const description = document.createElement("p");
    description.textContent = tileDescription(title);
    link.replaceChildren(heading, meta, description);
    return link;
  });
  els.secondaryTiles.replaceChildren(...tiles);
}

function renderIndexTiles() {
  const tiles = MASTER_INDEX_FILTERS.map((filter) => {
    const count = masterIndexEntryCount(filter);
    if (!count) return null;
    const link = document.createElement("a");
    link.className = "tile index-tile";
    link.href = masterIndexHref(filter);
    const heading = document.createElement("strong");
    heading.textContent = filter.label;
    const meta = document.createElement("span");
    meta.textContent = count > 1 ? `${count.toLocaleString()} entries` : "Browse";
    const description = document.createElement("p");
    description.textContent = masterIndexDescription(filter.key);
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

function categoryBrowseProfile(typeValue, records = []) {
  if (CATEGORY_BROWSE_PROFILES[typeValue]) return CATEGORY_BROWSE_PROFILES[typeValue];
  const counts = new Map();
  records.forEach((record) => {
    const group = typeGroup(record).value;
    counts.set(group, (counts.get(group) || 0) + 1);
  });
  const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return CATEGORY_BROWSE_PROFILES[dominant] || {
    groupLabel: "Works And Subjects",
    entityType: "productions",
    secondaryEntityType: "subjects",
    secondaryLabel: "Subjects",
    emptyLabel: "Ungrouped Articles",
    intro: "This path groups articles by the strongest available work or subject metadata, then leaves the remaining records in chronological order.",
  };
}

function recordsForCollectionSlug(slug) {
  const collection = collectionFromSlug(slug);
  return collection ? state.records.filter((record) => collectionNames(record).includes(collection)) : [];
}

function groupedBrowseEntries(records, entityTypeKey) {
  const grouped = new Map();
  const ungrouped = [];
  records.forEach((record) => {
    const values = entityValues(record, entityTypeKey);
    const labels = new Map();
    values.forEach((value) => {
      const label = String(value || "").trim();
      if (label) labels.set(entitySlug(label), label);
    });
    if (!labels.size) {
      ungrouped.push(record);
      return;
    }
    labels.forEach((label, slug) => {
      const entry = grouped.get(slug) || { slug, label, records: [] };
      entry.records.push(record);
      grouped.set(slug, entry);
    });
  });
  return {
    entries: [...grouped.values()].sort((a, b) =>
      b.records.length - a.records.length ||
      indexSortText(a.label, entityTypeKey).localeCompare(indexSortText(b.label, entityTypeKey)) ||
      a.label.localeCompare(b.label)
    ),
    ungrouped: sortRecords(ungrouped),
  };
}

function groupedBrowseCard(entry, entityTypeKey) {
  const link = document.createElement("a");
  link.className = "browse-group-card";
  link.href = `#entity:${entityTypeKey}:${entry.slug}`;
  const title = document.createElement("strong");
  title.textContent = indexDisplayLabel(entityTypeKey, entry.label);
  const count = document.createElement("em");
  count.textContent = entry.records.length > 1 ? `${entry.records.length.toLocaleString()} articles` : "";
  const examples = document.createElement("span");
  examples.textContent = sortRecords(entry.records)
    .slice(0, 3)
    .map((record) => [record.date ? String(record.date).slice(0, 4) : "", record.title].filter(Boolean).join(" "))
    .join(" / ");
  link.replaceChildren(title, count, examples);
  return link;
}

function renderGroupedBrowsePage({ title, countLabel, intro, records, profile, backHref = "#section:browse" }) {
  const heading = document.createElement("h1");
  heading.textContent = title;
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = countLabel || countUnitText(records.length, "article", "articles");
  const copy = document.createElement("p");
  copy.className = "landing-intro";
  copy.textContent = intro || profile.intro || "";
  const back = document.createElement("a");
  back.className = "index-back";
  back.href = backHref;
  back.textContent = "Back to browse";

  const primary = groupedBrowseEntries(records, profile.entityType);
  const sections = [heading, count, copy, back];
  const primarySection = document.createElement("section");
  primarySection.className = "grouped-browse-section";
  const primaryTitle = document.createElement("h2");
  primaryTitle.textContent = profile.groupLabel;
  const primaryGrid = document.createElement("div");
  primaryGrid.className = "browse-group-grid";
  primaryGrid.replaceChildren(...primary.entries.map((entry) => groupedBrowseCard(entry, profile.entityType)));
  primarySection.replaceChildren(primaryTitle, primaryGrid);
  sections.push(primarySection);

  if (profile.secondaryEntityType) {
    const secondary = groupedBrowseEntries(records, profile.secondaryEntityType);
    if (secondary.entries.length) {
      const secondarySection = document.createElement("section");
      secondarySection.className = "grouped-browse-section grouped-browse-section-secondary";
      const secondaryTitle = document.createElement("h2");
      secondaryTitle.textContent = profile.secondaryLabel || entityType(profile.secondaryEntityType)?.label || "Related Index";
      const secondaryGrid = document.createElement("div");
      secondaryGrid.className = "browse-group-grid browse-group-grid-compact";
      secondaryGrid.replaceChildren(...secondary.entries.slice(0, 48).map((entry) => groupedBrowseCard(entry, profile.secondaryEntityType)));
      secondarySection.replaceChildren(secondaryTitle, secondaryGrid);
      sections.push(secondarySection);
    }
  }

  if (primary.ungrouped.length && profile.showUngrouped !== false) {
    const ungrouped = document.createElement("section");
    ungrouped.className = "grouped-browse-section";
    const ungroupedTitle = document.createElement("h2");
    ungroupedTitle.textContent = profile.emptyLabel || "Ungrouped Articles";
    const list = document.createElement("div");
    list.className = "results entity-results";
    list.replaceChildren(...primary.ungrouped.slice(0, 36).map((record) => resultCard(record)));
    ungrouped.replaceChildren(ungroupedTitle, list);
    sections.push(ungrouped);
  }

  els.indexContent.replaceChildren(...sections);
}

function renderCategoryBrowsePage(typeValue) {
  const group = TYPE_GROUPS.find((item) => item.value === typeValue);
  if (!group) return;
  const records = recordsForTypeValue(typeValue);
  renderGroupedBrowsePage({
    title: group.label,
    countLabel: countUnitText(records.length, "article", "articles"),
    intro: categoryBrowseProfile(typeValue, records).intro,
    records,
    profile: categoryBrowseProfile(typeValue, records),
    backHref: "#section:browse",
  });
}

function renderCollectionBrowsePage(slug) {
  const collection = collectionFromSlug(slug);
  if (!collection) return;
  const records = recordsForCollectionSlug(slug);
  const profile = slug === "shakespeare"
    ? { groupLabel: "Plays", entityType: "shakespeare-plays", showUngrouped: false, intro: "Shakespeare collection articles are grouped by Shakespeare play. Essays, adaptations, and broader Shakespeare criticism remain available through search and the master index." }
    : categoryBrowseProfile("", records);
  renderGroupedBrowsePage({
    title: collection.replace(/^The\s+/, ""),
    countLabel: countUnitText(records.length, "article", "articles"),
    intro: profile.intro,
    records,
    profile,
    backHref: "#section:collections",
  });
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
        return landingItem(group.label, `#browse-group:${value}`, countForTypeValue(value), tileDescription(group.label), recordsForTypeValue(value));
      }),
      landingItem("Site Notes", "#browse-group:site-notes", countForTypeValue("site-notes"), tileDescription("Site Notes"), recordsForTypeValue("site-notes")),
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
        return landingItem(title.replace(/^The\s+/, ""), `#browse-collection:${slugForCollection(title)}`, countForTile(title, "collections"), tileDescription(title), state.records.filter((record) => collectionNames(record).includes(collection)));
      }),
    ];
  }

  if (kind === "indexes") {
    return MASTER_INDEX_FILTERS.map((filter) => {
      const count = masterIndexEntryCount(filter);
      return landingItem(filter.label, masterIndexHref(filter), count, masterIndexDescription(filter.key), [], "entries");
    }).filter((item) => item.count);
  }

  if (kind === "shakespeare") {
    return SHAKESPEARE_GROUPS.map((group) => {
      const href = group.value ? `#collection:shakespeare?group=${group.value}` : "#browse-collection:shakespeare";
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
      items: [landingItem("Current Collection", "#section:current", countForTile("Current Collection", "collections"), "", state.records.filter((record) => collectionNames(record).includes("Current Collection")))],
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
    meta.textContent = productionParts(record).join(" / ");
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
  intro.textContent = "A play-by-play route through the Shakespeare collection.";
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
  els.indexContent.replaceChildren(title, count, intro, playHeading, plays);
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
  count.textContent = item.count > 1 ? `${item.count.toLocaleString()} ${item.unit}` : item.count ? "Browse" : "Not yet published";
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
      href: `#browse-group:${type.value}`,
      count: state.records.filter((record) => typeGroup(record).value === type.value).length,
    }))
    .filter((item) => item.count)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const collectionLinks = [
    { label: "Shakespeare Collection", href: "#browse-collection:shakespeare", count: countForTile("Shakespeare"), featured: true },
    { label: "Canadian Collection", href: "#browse-collection:canadian", count: collectionCount("The Canadian Collection") },
    { label: "UK Collection", href: "#browse-collection:uk", count: collectionCount("UK Collection") },
    { label: "Stratford Collection", href: "#browse-collection:stratford", count: collectionCount("The Stratford Collection") },
    { label: "Shaw Collection", href: "#browse-collection:shaw", count: collectionCount("The Shaw Collection") },
  ];

  const indexLinks = MASTER_INDEX_FILTERS
    .map((filter) => ({
      label: filter.label,
      href: masterIndexHref(filter),
      count: masterIndexEntryCount(filter),
    }))
    .filter((item) => item.count);
  const publicationLinks = [...entityMap("publications").values()]
    .map((entry) => ({
      label: entry.label,
      href: `#entity:publications:${entry.slug}`,
      count: entry.records.length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const sections = [
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
    {
      id: "publicationStart",
      className: "frontpage-section",
      label: "Sources",
      title: "Publications",
      titleHref: "#index:publications",
      links: publicationLinks,
      limit: 10,
    },
  ];

  els.frontpageDirectory.replaceChildren(...sections.map(frontpageSection));
}

function renderCurrentFeature() {
  if (!els.currentFeature) return;
  const currentRecords = state.records
    .filter((record) => collectionNames(record).includes("Current Collection"))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const current = currentRecords[0];
  if (!current) {
    els.currentFeature.replaceChildren();
    return;
  }
  const media = current.media?.[0];
  const card = document.createElement("article");
  card.className = "current-feature-card";
  if (media?.local_path) {
    const imageLink = document.createElement("a");
    imageLink.className = "current-feature-image";
    imageLink.href = `#review:${current.slug}`;
    const img = document.createElement("img");
    img.src = new URL(`../site_export/content/${media.local_path}`, import.meta.url);
    img.alt = media.alt || media.caption || current.title;
    imageLink.append(img);
    card.append(imageLink);
  }
  const copy = document.createElement("div");
  copy.className = "current-feature-copy";
  const kicker = document.createElement("span");
  kicker.className = "current-feature-kicker";
  kicker.textContent = "Latest current article";
  const title = document.createElement("h2");
  title.textContent = current.title;
  const meta = document.createElement("p");
  meta.textContent = [formatDate(current.date), ...productionParts(current)].filter(Boolean).join(" / ");
  const readLink = document.createElement("a");
  readLink.className = "current-read-link";
  readLink.href = `#review:${current.slug}`;
  readLink.textContent = "Read latest";
  const currentLink = document.createElement("a");
  currentLink.className = "current-page-link";
  currentLink.href = "#section:current";
  currentLink.textContent = "Open Current Collection";
  copy.replaceChildren(kicker, title, meta, readLink, currentLink);
  const latest = document.createElement("aside");
  latest.className = "current-feature-latest";
  const latestTitle = document.createElement("span");
  latestTitle.textContent = "Newest";
  latest.append(latestTitle);
  currentRecords.slice(0, 5).forEach((record) => {
    const item = document.createElement("a");
    item.href = `#review:${record.slug}`;
    item.innerHTML = `<strong>${record.title}</strong><em>${formatDate(record.date)}</em>`;
    latest.append(item);
  });
  card.append(copy, latest);
  els.currentFeature.replaceChildren(card);
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
    count.textContent = countBadgeText(item.count);
    link.replaceChildren(label, count);
    list.append(link);
  });

  article.replaceChildren(kicker, title, list);
  if (section.examples?.length) {
    const examples = document.createElement("div");
    examples.className = "frontpage-latest";
    section.examples.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.innerHTML = `<span>${item.label}</span>${item.date ? `<em>${item.date}</em>` : ""}`;
      examples.append(link);
    });
    article.append(examples);
  }
  return article;
}

function indexDescription(type) {
  return {
    people: "Artists, writers, directors, performers, and other named people.",
    subjects: "People who are the focus of non-production pieces.",
    books: "Reviewed books and book-length works.",
    productions: "Reviewed shows, broadcasts, recordings, and staged works.",
    "book-authors": "Authors and editors of reviewed books.",
    publishers: "Publishers of reviewed books.",
    topics: "Topic-led essays, year-end pieces, and corrections.",
    events: "Awards, listings, and other event-led articles.",
    networks: "Television networks and platforms.",
    companies: "Theatre companies, festivals, broadcasters, and producers.",
    venues: "Theatres and performance spaces.",
    cities: "Places represented in the archive.",
    publications: "Newspapers and publication sources.",
    categories: "Public-facing article categories.",
    collections: "Editorial collections and special paths.",
    directors: "Directors credited in structured production metadata.",
    actors: "Actors credited in structured production metadata.",
    playwrights: "Playwrights and dramatic source authors.",
    "composers-lyricists": "Composers, lyricists, and musical writers.",
    "musical-directors": "Musical directors.",
    choreographers: "Choreographers.",
    "set-designers": "Set designers.",
    "costume-designers": "Costume designers.",
    "lighting-designers": "Lighting designers.",
    "sound-designers": "Sound designers.",
    musicians: "Musicians.",
    performers: "Performers outside standard cast credits.",
    artists: "Named artists and public figures whose exact production role is not represented elsewhere.",
    producers: "Producers and producing credits.",
    dramaturgs: "Dramaturgs.",
    "fight-directors": "Fight directors.",
  }[type] || "";
}

function indexSortText(label, typeKey = "") {
  return String(indexDisplayLabel(typeKey, label) || "")
    .replace(/^[\s"'‘’“”.,;:!?()[\]{}]+/, "")
    .trim();
}

function indexGroupLabel(label, typeKey = "") {
  const text = indexSortText(label, typeKey);
  if (/^\d/.test(text)) return "0-9";
  const match = text.match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

function groupedIndexEntries(entries, displayTypeKey = "") {
  const groups = new Map();
  entries.forEach((entry) => {
    const letter = indexGroupLabel(entry.label, entry.typeKey || displayTypeKey);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(entry);
  });
  return groups;
}

function alphaNavForGroups(groups, idPrefix, label) {
  const nav = document.createElement("nav");
  nav.className = "alpha-nav";
  nav.setAttribute("aria-label", `${label} alphabet`);
  [...groups.keys()].forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter;
    button.addEventListener("click", () => {
      document.querySelector(`#${idPrefix}-${entitySlug(letter)}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    nav.append(button);
  });
  return nav;
}

function alphaListForGroups(groups, typeKey, idPrefix) {
  const list = document.createElement("div");
  list.className = "alpha-list";
  [...groups].forEach(([letter, items]) => {
    const section = document.createElement("section");
    section.id = `${idPrefix}-${entitySlug(letter)}`;
    const heading = document.createElement("h2");
    heading.textContent = letter;
    const links = document.createElement("div");
    links.className = "alpha-links";
    items.forEach((entry) => {
      const entryTypeKey = entry.typeKey || typeKey;
      const link = document.createElement("a");
      link.href = `#entity:${entryTypeKey}:${entry.slug}`;
      const label = document.createElement("span");
      label.textContent = indexDisplayLabel(entryTypeKey, entry.label);
      const count = document.createElement("em");
      count.textContent = countBadgeText(entry.records.length);
      link.replaceChildren(label, count);
      links.append(link);
    });
    section.replaceChildren(heading, links);
    list.append(section);
  });
  return list;
}

function renderEntityIndex(typeKey) {
  const type = entityType(typeKey);
  if (!type) return;
  const entries = [...entityMap(typeKey).values()].sort((a, b) =>
    indexSortText(a.label, typeKey).localeCompare(indexSortText(b.label, typeKey)) || a.label.localeCompare(b.label)
  );
  const groups = groupedIndexEntries(entries, typeKey);

  const title = document.createElement("h1");
  title.textContent = type.label;
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = countUnitText(entries.length, "entry", "entries");
  const nav = alphaNavForGroups(groups, typeKey, type.label);
  const list = alphaListForGroups(groups, typeKey, typeKey);
  els.indexContent.replaceChildren(title, count, nav, list);
}

function masterIndexFilter(filterKey) {
  return MASTER_INDEX_FILTERS.find((filter) => filter.key === filterKey) || MASTER_INDEX_FILTERS.find((filter) => filter.key === DEFAULT_MASTER_INDEX_FILTER);
}

function masterIndexEntries(filter) {
  const map = new Map();
  state.records.forEach((record) => {
    if (filter.predicate && !filter.predicate(record)) return;
    filter.typeKeys.forEach((typeKey) => {
      entityValues(record, typeKey).forEach((value) => {
        const label = String(value || "").trim();
        if (!label) return;
        const slug = entitySlug(label);
        const key = `${typeKey}:${slug}`;
        const existing = map.get(key) || { slug, label, typeKey, records: [], recordSlugs: new Set() };
        if (!existing.recordSlugs.has(record.slug)) {
          existing.records.push(record);
          existing.recordSlugs.add(record.slug);
        }
        map.set(key, existing);
      });
    });
  });
  return [...map.values()]
    .map(({ recordSlugs, ...entry }) => entry)
    .sort((a, b) =>
      indexSortText(a.label, a.typeKey).localeCompare(indexSortText(b.label, b.typeKey)) ||
      a.label.localeCompare(b.label) ||
      a.typeKey.localeCompare(b.typeKey)
    );
}

function masterIndexEntryCount(filter) {
  return masterIndexEntries(filter).length;
}

function orderedMasterPeopleFilters() {
  const allPeople = MASTER_INDEX_PEOPLE_FILTERS.find((filter) => filter.key === "all-people");
  const actors = MASTER_INDEX_PEOPLE_FILTERS.find((filter) => filter.key === "actors");
  const rest = MASTER_INDEX_PEOPLE_FILTERS
    .filter((filter) => !["all-people", "actors"].includes(filter.key))
    .sort((a, b) => masterIndexEntryCount(b) - masterIndexEntryCount(a) || a.label.localeCompare(b.label));
  return [allPeople, actors, ...rest].filter(Boolean);
}

function masterIndexHref(filter) {
  return filter.key === DEFAULT_MASTER_INDEX_FILTER ? "#master-index" : `#master-index:${filter.key}`;
}

function masterIndexDescription(filterKey) {
  return {
    "all-works": "All indexed works across plays, musicals, books, recordings, television, films, and concerts.",
    plays: "Stage plays and theatre productions.",
    musicals: "Musicals, operettas, and musical-theatre productions.",
    books: "Reviewed books and book-length works.",
    albums: "Albums and recordings reviewed in the archive.",
    concerts: "Concerts and live music events.",
    television: "Television programs, broadcasts, and series.",
    films: "Films and cinema-related works.",
    "all-people": "All indexed people across credited and subject roles.",
    actors: "Actors credited in structured production metadata.",
    directors: "Directors credited in structured production metadata.",
    playwrights: "Playwrights and dramatic source authors.",
    "composers-lyricists": "Composers, lyricists, and musical writers.",
    "musical-directors": "Musical directors.",
    choreographers: "Choreographers.",
    "set-designers": "Set designers.",
    "costume-designers": "Costume designers.",
    "lighting-designers": "Lighting designers.",
    "sound-designers": "Sound designers.",
    musicians: "Musicians.",
  }[filterKey] || "Filtered master index entries.";
}

function masterIndexButton(filter, activeKey) {
  const link = document.createElement("a");
  link.className = "master-index-filter";
  link.href = masterIndexHref(filter);
  link.setAttribute("aria-pressed", String(filter.key === activeKey));
  const label = document.createElement("span");
  label.textContent = filter.label;
  const count = document.createElement("em");
  count.textContent = countBadgeText(masterIndexEntries(filter).length);
  link.replaceChildren(label, count);
  return link;
}

function masterIndexFilterGroup(titleText, filters, activeKey) {
  const group = document.createElement("section");
  group.className = "master-index-filter-group";
  const title = document.createElement("h2");
  title.textContent = titleText;
  const controls = document.createElement("div");
  controls.className = "master-index-filter-row";
  controls.replaceChildren(...filters.map((filter) => masterIndexButton(filter, activeKey)));
  group.replaceChildren(title, controls);
  return group;
}

function renderMasterIndex(filterKey = DEFAULT_MASTER_INDEX_FILTER) {
  const filter = masterIndexFilter(filterKey);
  const activeKey = filter.key;
  const entries = masterIndexEntries(filter);
  const groups = groupedIndexEntries(entries);

  const title = document.createElement("h1");
  title.textContent = "Master Index";
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = `${filter.label} / ${entries.length.toLocaleString()} ${entries.length === 1 ? "entry" : "entries"}`;

  const sticky = document.createElement("div");
  sticky.className = "master-index-sticky";
  const filters = document.createElement("div");
  filters.className = "master-index-panel";
  const current = document.createElement("div");
  current.className = "master-index-current";
  const currentLabel = document.createElement("span");
  currentLabel.textContent = "Viewing";
  const currentValue = document.createElement("strong");
  currentValue.textContent = filter.label;
  const currentCount = document.createElement("em");
  currentCount.textContent = `${entries.length.toLocaleString()} ${entries.length === 1 ? "entry" : "entries"}`;
  current.replaceChildren(currentLabel, currentValue, currentCount);
  filters.replaceChildren(
    current,
    masterIndexFilterGroup("Works", MASTER_INDEX_WORK_FILTERS, activeKey),
    masterIndexFilterGroup("People", orderedMasterPeopleFilters(), activeKey)
  );
  const nav = alphaNavForGroups(groups, `master-${activeKey}`, filter.label);
  sticky.replaceChildren(filters, nav);

  const list = alphaListForGroups(groups, filter.typeKeys[0], `master-${activeKey}`);
  els.indexContent.replaceChildren(title, count, sticky, list);
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
  count.textContent = entry.records.length > 1 ? `${type.singular} index / ${entry.records.length.toLocaleString()} articles` : `${type.singular} index`;
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
    { key: "collection", label: "Curated Paths", next: "company" },
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
      if (branch === "company") values = entityValues(record, "companies");
      if (branch === "city") values = entityValues(record, "cities");
      if (branch === "production") values = entityValues(record, "productions");
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
          if (branch === "company") return entityValues(record, "companies").includes(label);
          if (branch === "city") return entityValues(record, "cities").includes(label);
          if (branch === "production") return entityValues(record, "productions").includes(label);
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
    button.innerHTML = `<span>${item.label}</span><em>${countBadgeText(item.count)}</em>`;
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
    button.innerHTML = `<strong>${year}</strong><span>${countBadgeText(records.length)}</span>`;
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
  intro.textContent = "Choose a path, open a branch, and keep narrowing until the article list feels manageable.";
  const tool = document.createElement("div");
  tool.className = "explore-tool explore-pill-tool";
  const controls = document.createElement("div");
  controls.className = "explore-navigation";
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.textContent = "Back";
  const forwardButton = document.createElement("button");
  forwardButton.type = "button";
  forwardButton.textContent = "Forward";
  const collapseButton = document.createElement("button");
  collapseButton.type = "button";
  collapseButton.textContent = "Collapse search";
  controls.replaceChildren(backButton, forwardButton, collapseButton);
  const scroller = document.createElement("div");
  scroller.className = "explore-pill-scroller";
  const columns = document.createElement("div");
  columns.className = "explore-pill-columns";
  scroller.append(columns);
  tool.append(controls, scroller);

  const path = [];
  const branches = [
    { key: "type", label: "Categories", next: "era" },
    { key: "era", label: "Eras", next: "collection" },
    { key: "collection", label: "Collections", next: "company" },
    { key: "company", label: "Companies", next: "city" },
    { key: "city", label: "Cities", next: "production" },
    { key: "production", label: "Productions", next: "type" },
  ];
  const branchMeta = new Map(branches.map((branch, index) => [branch.key, { ...branch, color: index }]));
  let openBranch = "type";
  let pendingScroll = null;
  const history = [{ path: [], openBranch }];
  let historyIndex = 0;

  const snapshot = () => ({ path: path.map((step) => ({ ...step })), openBranch });
  const sameSnapshot = (a, b) => JSON.stringify(a.path.map((step) => [step.branch, step.label])) === JSON.stringify(b.path.map((step) => [step.branch, step.label])) && a.openBranch === b.openBranch;
  const pushHistory = () => {
    const next = snapshot();
    if (sameSnapshot(history[historyIndex], next)) return;
    history.splice(historyIndex + 1);
    history.push(next);
    historyIndex = history.length - 1;
  };
  const restoreHistory = (index) => {
    const entry = history[index];
    if (!entry) return;
    path.splice(0, path.length, ...entry.path.map((step) => ({ ...step })));
    openBranch = entry.openBranch;
    historyIndex = index;
    pendingScroll = "options";
    renderTree();
  };

  const filteredRecords = () => path.reduce((records, step) => records.filter((record) => step.test(record)), state.records);
  const valuesForBranch = (records, branch) => {
    const counts = new Map();
    records.forEach((record) => {
      let values = [];
      if (branch === "type") values = [typeLabel(record)];
      if (branch === "era") values = [record.year ? `${String(record.year).slice(0, 3)}0s` : ""];
      if (branch === "collection") values = collectionNames(record);
      if (branch === "company") values = entityValues(record, "companies");
      if (branch === "city") values = entityValues(record, "cities");
      if (branch === "production") values = entityValues(record, "productions");
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
          if (branch === "company") return entityValues(record, "companies").includes(label);
          if (branch === "city") return entityValues(record, "cities").includes(label);
          if (branch === "production") return entityValues(record, "productions").includes(label);
          return true;
        },
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  };

  const makeColumn = (label, sublabel = "") => {
    const column = document.createElement("section");
    column.className = "explore-pill-column";
    const heading = document.createElement("h2");
    heading.textContent = label;
    column.append(heading);
    if (sublabel) {
      const meta = document.createElement("p");
      meta.textContent = sublabel;
      column.append(meta);
    }
    return column;
  };

  const makePill = (item, onClick, options = {}) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `explore-pill explore-pill-${options.color ?? 0}${options.active ? " is-active" : ""}`.trim();
    const label = document.createElement("span");
    label.textContent = item.label;
    const count = document.createElement("em");
    count.textContent = countBadgeText(item.count);
    button.append(label, count);
    button.addEventListener("click", onClick);
    return button;
  };

  const renderResults = (records) => {
    const list = document.createElement("section");
    list.className = "explore-articles explore-pill-results";
    const listTitle = document.createElement("h2");
    listTitle.textContent = `${records.length.toLocaleString()} articles`;
    list.append(listTitle);
    sortRecords(records).slice(0, 18).forEach((record) => {
      const link = document.createElement("a");
      link.href = `#review:${record.slug}`;
      const media = record.media?.[0];
      if (media?.local_path) {
        link.className = "has-thumb";
        const thumb = document.createElement("img");
        thumb.src = new URL(`../site_export/content/${media.local_path}`, import.meta.url);
        thumb.alt = media.alt || media.caption || record.title || "";
        thumb.loading = "lazy";
        link.append(thumb);
      }
      const label = document.createElement("span");
      label.textContent = record.title;
      link.append(label);
      list.append(link);
    });
    return list;
  };

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      scroller.scrollTo({ left: scroller.scrollWidth, behavior: "smooth" });
    });
  };
  const scrollToColumn = (column) => {
    requestAnimationFrame(() => {
      scroller.scrollTo({ left: Math.max(0, column.offsetLeft - 18), behavior: "smooth" });
    });
  };

  const renderTree = () => {
    const records = filteredRecords();
    columns.replaceChildren();

    const startColumn = makeColumn("Start", `${state.records.length.toLocaleString()} public records`);
    startColumn.append(makePill({ label: "All articles", count: state.records.length }, () => {
      path.splice(0);
      openBranch = "type";
      pushHistory();
      renderTree();
    }, { color: 0, active: !path.length }));
    branches.forEach((branch, index) => {
      startColumn.append(makePill({ label: branch.label, count: state.records.length }, () => {
        openBranch = branch.key;
        pendingScroll = "options";
        pushHistory();
        renderTree();
      }, { color: index, active: !path.length && openBranch === branch.key }));
    });
    columns.append(startColumn);

    path.forEach((step, index) => {
      const meta = branchMeta.get(step.branch);
      const column = makeColumn(meta?.label || "Path", `${step.count.toLocaleString()} records`);
      column.classList.add("is-path-column");
      column.append(makePill(step, () => {
        if (index === path.length - 1) {
          const removed = path.pop();
          openBranch = removed.branch;
        } else {
          path.splice(index + 1);
          openBranch = step.next;
        }
        pendingScroll = "options";
        pushHistory();
        renderTree();
      }, { color: meta?.color ?? 0, active: true }));
      columns.append(column);
    });

    const branch = openBranch || path.at(-1)?.next || "type";
    const activeMeta = branchMeta.get(branch);
    const optionsColumn = makeColumn(activeMeta?.label || "Choose", `${records.length.toLocaleString()} in current set`);
    optionsColumn.classList.add("is-options-column");
    valuesForBranch(records, branch).slice(0, 18).forEach((item) => {
      optionsColumn.append(makePill(item, () => {
        path.push(item);
        openBranch = item.next;
        pendingScroll = "end";
        pushHistory();
        renderTree();
      }, { color: activeMeta?.color ?? 0 }));
    });
    columns.append(optionsColumn, renderResults(records));
    if (pendingScroll === "end") {
      pendingScroll = null;
      scrollToEnd();
    } else if (pendingScroll === "options") {
      pendingScroll = null;
      scrollToColumn(optionsColumn);
    }
    backButton.disabled = historyIndex <= 0;
    forwardButton.disabled = historyIndex >= history.length - 1;
    collapseButton.disabled = !path.length && openBranch === "type";
  };
  backButton.addEventListener("click", () => restoreHistory(historyIndex - 1));
  forwardButton.addEventListener("click", () => restoreHistory(historyIndex + 1));
  collapseButton.addEventListener("click", () => {
    path.splice(0);
    openBranch = "type";
    pendingScroll = null;
    pushHistory();
    renderTree();
  });
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
      const media = record.media?.[0];
      if (media?.local_path) {
        link.className = "has-thumb";
        const thumb = document.createElement("img");
        thumb.src = new URL(`../site_export/content/${media.local_path}`, import.meta.url);
        thumb.alt = media.alt || media.caption || record.title || "";
        thumb.loading = "lazy";
        link.append(thumb);
      }
      const copy = document.createElement("span");
      copy.className = "timeline-copy";
      copy.innerHTML = `<strong>${split.headline}</strong>${split.deck ? `<span>${split.deck}</span>` : ""}<em>${formatDate(record.date) || record.year || ""} / ${typeLabel(record)}</em>`;
      link.append(copy);
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
  for (let year = Math.ceil(minYear / 5) * 5; year <= maxYear; year += 5) {
    const guide = document.createElement("span");
    guide.className = "timeline-guide";
    guide.style.left = `${((year - minYear) / yearSpan) * 100}%`;
    guide.textContent = year;
    track.append(guide);
  }
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

function renderChatbotPage(initialQuestion = "") {
  const title = document.createElement("h1");
  title.textContent = "CushBot";
  const count = document.createElement("p");
  count.className = "index-count";
  count.textContent = "Ask about a show, person, place, or period";

  const page = document.createElement("div");
  page.className = "chat-page";
  const transcript = document.createElement("div");
  transcript.className = "chat-transcript";
  transcript.setAttribute("aria-live", "polite");
  appendChatMessage(transcript, "bot", [
    "Well? What shall we talk about?",
  ]);

  const suggestions = document.createElement("div");
  suggestions.className = "chat-suggestions";
  CHAT_SUGGESTIONS.forEach((suggestion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = suggestion;
    suggestions.append(button);
  });

  const form = document.createElement("form");
  form.className = "chat-form";
  const label = document.createElement("label");
  label.className = "chat-input";
  const labelText = document.createElement("span");
  labelText.textContent = "Question";
  const input = document.createElement("textarea");
  input.rows = 2;
  input.placeholder = "Ask about Hamlet, Stratford, Shaw, The Wire, a performer, or a venue";
  label.replaceChildren(labelText, input);
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Ask";
  form.replaceChildren(label, submit);

  suggestions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      form.requestSubmit();
    });
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    form.requestSubmit();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    input.focus();
    appendChatMessage(transcript, "user", [question]);
    const pending = appendChatMessage(transcript, "bot", ["Let me think."]);
    submit.disabled = true;
    try {
      const index = await ensureChatIndex();
      count.textContent = "Ask about a show, person, place, or period";
      const analysis = analyzeChatQuestion(question, index);
      const answer = composeChatAnswer(question, analysis);
      replaceChatMessage(pending, answer.paragraphs, answer.sources);
    } catch (error) {
      console.error("Could not answer chat question", error);
      replaceChatMessage(pending, [
        "I cannot get at the material just now. Try again once the page has finished loading.",
      ]);
    } finally {
      submit.disabled = false;
    }
  });

  page.replaceChildren(transcript, suggestions, form);
  els.indexContent.replaceChildren(title, count, page);
  requestAnimationFrame(() => {
    input.focus();
    if (initialQuestion) {
      input.value = initialQuestion;
      form.requestSubmit();
    }
  });
}

function appendChatMessage(transcript, speaker, paragraphs, sources = []) {
  const message = document.createElement("article");
  message.className = `chat-message chat-message-${speaker}`;
  const label = document.createElement("strong");
  label.className = "chat-speaker";
  label.textContent = speaker === "user" ? "You" : "CushBot";
  const body = document.createElement("div");
  body.className = "chat-message-body";
  fillChatMessageBody(body, paragraphs, sources);
  message.replaceChildren(label, body);
  transcript.append(message);
  transcript.scrollTop = transcript.scrollHeight;
  return message;
}

function replaceChatMessage(message, paragraphs, sources = []) {
  const body = message.querySelector(".chat-message-body");
  fillChatMessageBody(body, paragraphs, sources);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function fillChatMessageBody(body, paragraphs, sources = []) {
  body.replaceChildren();
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    body.append(p);
  });
  if (sources.length) body.append(chatSourceList(sources));
}

function chatSourceList(sources) {
  const list = document.createElement("div");
  list.className = "chat-sources";
  const heading = document.createElement("span");
  heading.textContent = "Reviews cited";
  list.append(heading);
  sources.forEach((source) => {
    const link = document.createElement("a");
    link.href = `#review:${source.record.slug}`;
    const title = document.createElement("strong");
    title.textContent = source.record.title || "Untitled";
    const meta = document.createElement("em");
    meta.textContent = [formatDate(source.record.date), source.record.publication, source.record.category].filter(Boolean).join(" / ");
    const quote = document.createElement("q");
    quote.textContent = source.snippet;
    link.replaceChildren(title, meta, quote);
    list.append(link);
  });
  return list;
}

async function ensureChatIndex() {
  if (state.chatIndex) return state.chatIndex;
  if (!state.chatIndexPromise) {
    state.chatIndexPromise = fetch(CHAT_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load chat index (${response.status})`);
        return response.json();
      })
      .then(prepareChatIndex);
  }
  state.chatIndex = await state.chatIndexPromise;
  return state.chatIndex;
}

function prepareChatIndex(index) {
  const records = Array.isArray(index.records) ? index.records : [];
  records.forEach((record) => {
    record._titleSearch = chatNormalize(record.title);
    record._productionSearch = chatNormalize(record.production);
    record._peopleSearch = chatNormalize((record.people || []).join(" "));
    record._placeSearch = chatNormalize([record.venue, record.city].join(" "));
    record._search = chatNormalize([
      record.title,
      record.production,
      record.company,
      record.venue,
      record.city,
      record.publication,
      record.category,
      ...(record.collections || []),
      ...(record.people || []),
    ].join(" "));
  });
  (index.chunks || []).forEach((chunk) => {
    chunk._record = records[chunk.r];
    chunk._textSearch = chatNormalize(chunk.t);
    chunk._search = `${chunk._textSearch} ${chunk._record?._search || ""}`;
  });
  return index;
}

function chatNormalize(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function chatTerms(question) {
  const seen = new Set();
  return chatNormalize(question)
    .split(/\s+/)
    .filter((term) => term.length > 2 && !CHAT_STOP_WORDS.has(term))
    .filter((term) => {
      if (seen.has(term)) return false;
      seen.add(term);
      return true;
    })
    .slice(0, 14);
}

function analyzeChatQuestion(question, index) {
  const terms = chatTerms(question);
  if (!terms.length) return emptyChatAnalysis(question, terms);
  const intent = chatIntent(question);
  const subject = detectChatSubject(question, index, terms);
  const matches = rankChatChunks(question, index, terms, subject);
  const records = aggregateChatRecords(index, matches, terms, subject).slice(0, 48);
  const evidence = selectChatEvidence(index, records, matches, terms, subject).slice(0, 90);
  if (!records.length || !evidence.length) return emptyChatAnalysis(question, terms, subject);
  const coreRecords = chatCoreSubjectRecords(records, subject);
  const coreSlugs = new Set(coreRecords.map((record) => record.slug));
  const coreEvidence = evidence.filter((item) => coreSlugs.has(item.record.slug));
  const focusedEvidence = coreEvidence.length ? coreEvidence : evidence;
  const themes = chatThemeProfile(focusedEvidence, subject);
  const stance = chatStanceProfile(focusedEvidence);
  const motifs = chatMotifs(focusedEvidence, terms, subject).slice(0, 8);
  const sources = uniqueChatSources(focusedEvidence, terms, 5);
  return {
    question,
    terms,
    intent,
    subject,
    subjectLabel: chatSubjectLabel(subject, terms),
    matches,
    records,
    coreRecords,
    evidence,
    coreEvidence,
    focusedEvidence,
    themes,
    stance,
    motifs,
    sources,
  };
}

function emptyChatAnalysis(question, terms = [], subject = null) {
  return {
    question,
    terms,
    intent: chatIntent(question),
    subject,
    subjectLabel: chatSubjectLabel(subject, terms),
    matches: [],
    records: [],
    coreRecords: [],
    evidence: [],
    coreEvidence: [],
    focusedEvidence: [],
    themes: [],
    stance: { mood: "thin", summary: "thin", average: 0, positive: 0, negative: 0 },
    motifs: [],
    sources: [],
  };
}

function detectChatSubject(question, index, terms) {
  const normalizedQuestion = chatNormalize(question);
  const phrase = terms.join(" ");
  let best = null;
  (index.records || []).forEach((record) => {
    chatRecordLabels(record).forEach((candidate) => {
      const label = candidate.label.trim();
      const normalized = chatNormalize(label);
      if (!normalized || normalized.length < 3) return;
      const labelTerms = normalized.split(/\s+/).filter((term) => term.length > 2 && !CHAT_GENERIC_LABEL_WORDS.has(term));
      if (!labelTerms.length) return;
      const hits = labelTerms.filter((term) => terms.includes(term)).length;
      let score = hits * 12 + candidate.weight;
      if (phrase && normalized === phrase) score += 80;
      if (phrase && normalized.includes(phrase)) score += 48;
      if (normalizedQuestion.includes(normalized) && normalized.length > 4) score += 34;
      if (terms.some((term) => normalized.split(/\s+/).includes(term))) score += 14;
      score += Math.min(labelTerms.length, 4) * 2;
      if (terms.length === 1 && normalized !== terms[0]) {
        if (["title", "production"].includes(candidate.kind) && labelTerms.length > 2) score -= 34;
        if (["city", "venue", "company", "collection"].includes(candidate.kind) && normalized.includes(terms[0])) score += 14;
      }
      if (!hits && !(phrase && normalizedQuestion.includes(normalized))) return;
      if (!best || score > best.score || (score === best.score && label.length < best.label.length)) {
        best = { label, normalized, terms: labelTerms, kind: candidate.kind, score };
      }
    });
  });
  if (best) return best;
  return { label: terms.map(titleCaseWord).join(" "), normalized: terms.join(" "), terms, kind: "query", score: 0 };
}

function chatRecordLabels(record) {
  return [
    { label: record.title || "", kind: "title", weight: 12 },
    ...splitChatList(record.production).map((label) => ({ label, kind: "production", weight: 18 })),
    ...(record.people || []).map((label) => ({ label, kind: "person", weight: 17 })),
    ...splitChatList(record.company).map((label) => ({ label, kind: "company", weight: 12 })),
    ...splitChatList(record.venue).map((label) => ({ label, kind: "venue", weight: 10 })),
    ...splitChatList(record.city).map((label) => ({ label, kind: "city", weight: 9 })),
    ...(record.collections || []).map((label) => ({ label, kind: "collection", weight: 8 })),
    { label: record.category || "", kind: "category", weight: 4 },
    { label: record.publication || "", kind: "publication", weight: 3 },
  ].filter((item) => item.label);
}

function rankChatChunks(question, index, terms = chatTerms(question), subject = null) {
  if (!terms.length) return [];
  const phrase = chatSubjectPhrase(subject, terms);
  const strictPhrase = chatSubjectRequiresPhrase(subject);
  const subjectTerms = subject?.terms?.length ? subject.terms : terms;
  const scored = [];
  (index.chunks || []).forEach((chunk) => {
    const record = chunk._record;
    if (!record) return;
    if (strictPhrase && !chatRecordHasSubjectPhrase(record, subject)) return;
    const score = chatChunkScore(chunk, record, terms, subjectTerms, phrase, strictPhrase);
    if (score > 0) scored.push({ chunk, record, score });
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 320);
}

function chatRecordHasSubjectPhrase(record, subject) {
  if (!subject?.normalized) return true;
  const phrase = subject.normalized;
  return [
    record._titleSearch,
    record._productionSearch,
    record._peopleSearch,
  ].some((value) => String(value || "").includes(phrase));
}

function chatCoreSubjectRecords(records, subject) {
  if (!subject?.normalized || !["production", "title", "person"].includes(subject.kind)) return records;
  const core = records.filter((record) => chatRecordIsCoreSubject(record, subject));
  return core.length ? core : records;
}

function chatRecordIsCoreSubject(record, subject) {
  const phrase = subject?.normalized || "";
  if (!phrase) return false;
  if (subject.kind === "production") {
    return splitChatList(record.production).some((label) => chatNormalize(label) === phrase);
  }
  if (subject.kind === "person") {
    return (record.people || []).some((label) => chatNormalize(label) === phrase);
  }
  const title = chatNormalize(record.title);
  return title === phrase || title.startsWith(`${phrase} `) || title.startsWith(`${phrase}:`);
}

function chatChunkScore(chunk, record, terms, subjectTerms, phrase = "", strictPhrase = false) {
  const textSignal = chatChunkTextSignal(chunk, [...subjectTerms, ...terms], phrase, strictPhrase);
  if (!textSignal) return 0;
  let score = 0;
  if (phrase.length > 5 && chunk._textSearch.includes(phrase)) score += 44;
  subjectTerms.forEach((term) => {
    if (!term) return;
    score += boundedTermCount(chunk._textSearch, term, 5) * 10;
    score += boundedTermCount(record._search, term, 3) * 13;
    if (record._titleSearch.includes(term)) score += 24;
    if (record._productionSearch.includes(term)) score += 28;
    if (record._peopleSearch.includes(term)) score += 22;
    if (record._placeSearch.includes(term)) score += 12;
  });
  terms.forEach((term) => {
    score += boundedTermCount(chunk._textSearch, term, 3) * 3;
    if (record._search.includes(term)) score += 4;
  });
  return score;
}

function chatChunkTextSignal(chunk, terms, phrase = "", strictPhrase = false) {
  if (strictPhrase && phrase.length > 5) return chunk._textSearch.includes(phrase) ? 1 : 0;
  if (phrase.length > 5 && chunk._textSearch.includes(phrase)) return 1;
  return terms.some((term) => term && chunk._textSearch.includes(term)) ? 1 : 0;
}

function chatSubjectPhrase(subject, terms) {
  if (subject?.normalized && chatSubjectRequiresPhrase(subject)) return subject.normalized;
  return terms.length > 1 ? terms.join(" ") : terms[0] || "";
}

function chatSubjectRequiresPhrase(subject) {
  if (!subject?.normalized || !subject.normalized.includes(" ")) return false;
  return ["title", "production", "person"].includes(subject.kind);
}

function aggregateChatRecords(index, matches, terms, subject) {
  const bySlug = new Map();
  const subjectTerms = subject?.terms?.length ? subject.terms : terms;
  const strictPhrase = chatSubjectRequiresPhrase(subject);
  (index.records || []).forEach((record) => {
    if (strictPhrase && !chatRecordHasSubjectPhrase(record, subject)) return;
    let score = chatRecordSubjectScore(record, terms, subjectTerms);
    if (score > 0) bySlug.set(record.slug, { record, score, chunks: [] });
  });
  matches.forEach((match) => {
    if (strictPhrase && !chatRecordHasSubjectPhrase(match.record, subject)) return;
    const entry = bySlug.get(match.record.slug) || { record: match.record, score: 0, chunks: [] };
    entry.score += match.score;
    entry.chunks.push(match);
    bySlug.set(match.record.slug, entry);
  });
  return [...bySlug.values()]
    .sort((a, b) => b.score - a.score || String(b.record.date).localeCompare(String(a.record.date)))
    .map((entry) => entry.record);
}

function chatRecordSubjectScore(record, terms, subjectTerms) {
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

function selectChatEvidence(index, records, matches, terms, subject) {
  const recordSlugs = new Set(records.map((record) => record.slug));
  const subjectTerms = subject?.terms?.length ? subject.terms : terms;
  const evidence = [];
  const evidenceIds = new Set(matches.map((match) => chatEvidenceId(match.chunk)));
  matches.slice(0, 180).forEach((match) => {
    if (recordSlugs.has(match.record.slug)) evidence.push(match);
  });
  (index.chunks || []).forEach((chunk) => {
    const record = chunk._record;
    if (!record || !recordSlugs.has(record.slug)) return;
    const id = chatEvidenceId(chunk);
    if (evidenceIds.has(id)) return;
    const phrase = chatSubjectPhrase(subject, terms);
    const strictPhrase = chatSubjectRequiresPhrase(subject);
    if (!chatChunkTextSignal(chunk, [...subjectTerms, ...terms], phrase, strictPhrase)) return;
    const score = chatChunkScore(chunk, record, terms, subjectTerms, phrase, strictPhrase);
    if (score > 16) {
      evidence.push({ chunk, record, score });
      evidenceIds.add(id);
    }
  });
  if (evidence.length < Math.min(18, records.length)) {
    const metadataScores = new Map(records.map((record) => [record.slug, chatRecordSubjectScore(record, terms, subjectTerms)]));
    (index.chunks || []).forEach((chunk) => {
      const record = chunk._record;
      if (!record || !recordSlugs.has(record.slug)) return;
      const id = chatEvidenceId(chunk);
      if (evidenceIds.has(id)) return;
      const metadataScore = metadataScores.get(record.slug) || 0;
      if (metadataScore <= 0) return;
      evidence.push({ chunk, record, score: metadataScore * 0.7 });
      evidenceIds.add(id);
    });
  }
  const perRecord = new Map();
  return evidence
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      const count = perRecord.get(item.record.slug) || 0;
      if (count >= 3) return false;
      perRecord.set(item.record.slug, count + 1);
      return true;
    });
}

function chatEvidenceId(chunk) {
  return `${chunk.r}:${chunk.t.slice(0, 40)}`;
}

function boundedTermCount(text, term, maxCount) {
  let count = 0;
  let cursor = 0;
  while (count < maxCount) {
    const index = text.indexOf(term, cursor);
    if (index < 0) break;
    count += 1;
    cursor = index + term.length;
  }
  return count;
}

function composeChatAnswer(question, analysis) {
  if (!analysis.records.length || !analysis.evidence.length) {
    return {
      paragraphs: [
        "I cannot make a useful case on that from the material at hand. Try a more specific production, performer, venue, publication, or year.",
        "A verdict without particulars is only an opinion wearing a false moustache.",
      ],
      sources: [],
    };
  }
  const special = chatSpecialSubjectParagraphs(analysis);
  const paragraphs = special
    || (analysis.intent === "people" ? chatPeopleParagraphs(analysis) : chatSubjectParagraphs(analysis));
  return {
    paragraphs: paragraphs.filter(Boolean).slice(0, 3),
    sources: analysis.sources,
  };
}

function chatSpecialSubjectParagraphs(analysis) {
  const subject = chatNormalize(analysis.subjectLabel);
  const categories = commonChatValues(chatAnswerRecords(analysis), (record) => [record.category], 2);
  if (subject === "the wire" && categories.some((category) => /television/i.test(category))) {
    return [
      "The Wire is not really a cop show, except in the sense that Greek tragedy is a domestic drama. Baltimore is the protagonist: police, schools, docks, City Hall, the paper, each institution passing its failure downwards until a child, a dealer, or a half-decent officer has to cash the cheque.",
      "The admiration is very high. I place it in the HBO company of The Sopranos and Deadwood, and near The Sopranos as its only peer: less juicy in single characters, wider and more civic in reach. The reservations matter - the newspaper season is the weakest, and plot sometimes elbows character aside - but the thing itself remains tragic, dryly funny when it can bear to be, and rightly ending with a montage because this is a world, not a case file. Worlds go on. Wires, alas, conduct.",
    ];
  }
  if (subject === "hamlet" && categories.some((category) => /theatre|profile/i.test(category))) {
    return [
      "Hamlet is the great stress-test: can an actor make thought visible without turning thought into a pose? The danger is always the same - reverence, mist, and a prince who has mistaken sulking for metaphysics.",
      "The versions that work have speed, shape, and pressure from the whole court, not just a handsome misery in black. A strong concept is welcome; a concept that turns Hamlet into an exhibit is not. The play has to argue in front of us, skull and all.",
    ];
  }
  if (subject === "stratford") {
    return [
      "Stratford is a working theatre, not a shrine with parking. At its best it gives you scale, repertory, ensemble, and old words made playable; at its worst it assumes that the Festival name has already done half the acting.",
      "The argument is seasonal and comparative: Shakespeare, classics, Canadian work, visiting stars, directors with ideas and sometimes with Ideas. Praise comes when inherited prestige is converted into present-tense theatre; impatience when heritage, bustle, or concept is offered in place of pressure. One need not genuflect at the Avon, even the Ontario branch.",
    ];
  }
  if (subject === "angels in america") {
    return [
      "Angels in America is a dangerous machine, and danger is one of its virtues. But it must keep its feet on the American ground: politics, sex, sickness, fear, the whole untidy republic of bodies.",
      "When the celestial apparatus takes over, I begin to miss the country in the title. The best of it is not the wings, but the wounded, argumentative, frightened people underneath them.",
    ];
  }
  if (subject === "shaw" && analysis.intent === "people") {
    const people = distinctChatPeople(commonChatValues(chatAnswerRecords(analysis), (record) => record.people || [], 12))
      .filter((person) => chatNormalize(person) !== "george bernard shaw")
      .slice(0, 8);
    return [
      `Around Shaw you get, first of all, people who can make talk behave like action: ${formatList(people)}. Shaw is deadly if merely lectured; he needs actors and directors who can make argument flirt, sting, and keep moving.`,
      "So the interesting names are not ornaments around the author. They are the means by which the plays escape the pamphlet and become theatre, which is where Shaw, for all his fondness for being right, is at his most dangerous.",
    ];
  }
  return null;
}

function chatSubjectParagraphs(analysis) {
  const category = chatDominantCategory(chatAnswerRecords(analysis));
  if (/television/i.test(category)) return chatTelevisionParagraphs(analysis);
  if (/book/i.test(category)) return chatBookParagraphs(analysis);
  return chatStageParagraphs(analysis);
}

function chatPeopleParagraphs(analysis) {
  const subject = analysis.subjectLabel || "the subject";
  const records = chatAnswerRecords(analysis);
  const people = distinctChatPeople(commonChatValues(records, (record) => record.people || [], 12)).slice(0, 9);
  const places = commonChatValues(records, (record) => [record.company, record.venue, record.city], 4);
  if (!people.length) return chatSubjectParagraphs(analysis);
  return [
    `Around ${subject}, I would start with ${formatList(people)}. Not as a roll call, but because those are the people through whom the work either catches fire or remains a very intelligent lecture.`,
    `${chatContentThreadSentence(analysis)} ${places.length ? `${formatList(places)} keeps the conversation practical; reputations look different when they have to survive a stage, a season, and an audience.` : "The point is not celebrity spotting; it is whether presence, wit, nerve, and usefulness turn into theatre."}`,
  ];
}

function distinctChatPeople(people) {
  const normalized = people.map((person) => chatNormalize(person));
  return people.filter((person, index) => {
    const current = normalized[index];
    return !normalized.some((other, otherIndex) => (
      otherIndex !== index
      && other.length > current.length
      && other.endsWith(` ${current}`)
    ));
  });
}

function chatTelevisionParagraphs(analysis) {
  const subject = analysis.subjectLabel || "the programme";
  const signals = chatSignalProfile(analysis.focusedEvidence || analysis.evidence, [
    {
      key: "world",
      terms: ["city", "politics", "school", "schools", "press", "paper", "newsroom", "docks", "department", "system", "corruption", "priority", "priorities", "institution", "institutions", "america"],
      line: "the real subject is the world around the plot: institutions, habits, bargains, and the consequences they pass down",
    },
    {
      key: "form",
      terms: ["season", "series", "episode", "finale", "penultimate", "plot", "structure", "montage", "focus"],
      line: "the form matters because serial television can accumulate pressure in a way a single evening cannot",
    },
    {
      key: "character",
      terms: ["character", "characters", "acting", "actor", "actors", "performance", "free", "will"],
      line: "character is judged by freedom under pressure, not by charm alone",
    },
    {
      key: "morality",
      terms: ["moral", "tragedy", "tragic", "hopelessness", "redemption", "good", "bad", "compromise"],
      line: "the moral interest is in compromised choices, not clean lessons",
    },
  ]);
  return [
    `I do not much care whether ${subject} has a clever premise; television is full of clever premises, many of them dead by the second commercial break. The question is whether the world keeps pressing on the people inside it.`,
    `${signals[0]?.line ? titleCaseFirst(signals[0].line) + "." : chatContentThreadSentence(analysis)} ${chatAdmirationSentence(analysis)} ${chatReservationSentence(analysis)}`,
  ];
}

function chatBookParagraphs(analysis) {
  const subject = analysis.subjectLabel || "the book";
  const theme = analysis.themes[0] || CHAT_THEMES[3];
  return [
    `With ${subject}, I would want more than a noble subject. I want an argument with blood circulating in it, and style doing work rather than drawing attention to its cuffs.`,
    `${chatThemeVoice(theme)} ${chatAdmirationSentence(analysis)} The useful test, as so often, is whether intelligence has turned into action, or merely sat down handsomely on the page.`,
  ];
}

function chatStageParagraphs(analysis) {
  const subject = analysis.subjectLabel || "the subject";
  const themes = analysis.themes.slice(0, 2);
  const firstTheme = themes[0] || CHAT_THEMES[0];
  const secondTheme = themes[1] || CHAT_THEMES[1];
  return [
    `${subject} has to earn its place in the room. A reputation, a good cause, even a bold idea will get you only as far as the footlights; after that something has to happen.`,
    `${chatThemeVoice(firstTheme)} ${chatContentThreadSentence(analysis)} ${chatReservationSentence(analysis)}`,
  ];
}

function chatAnswerRecords(analysis) {
  return analysis.coreRecords?.length ? analysis.coreRecords : analysis.records;
}

function chatDominantCategory(records) {
  return commonChatValues(records || [], (record) => [record.category], 1)[0] || "";
}

function chatSignalProfile(evidence, signals) {
  return signals
    .map((signal) => ({
      ...signal,
      count: chatSignalCount(evidence, signal.terms),
    }))
    .filter((signal) => signal.count)
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function chatSignalCount(evidence, terms) {
  return (evidence || []).reduce((sum, item) => {
    const text = item.chunk?._textSearch || chatNormalize(item.chunk?.t);
    return sum + terms.reduce((termSum, term) => termSum + boundedTermCount(text, chatNormalize(term), 3), 0);
  }, 0);
}

function chatThemeVoice(theme) {
  if (!theme) return "The test is whether the work has discovered a necessity.";
  if (theme.key === "acting") return "The acting has to show thought in motion; personality, however radiant, is not the same thing as performance.";
  if (theme.key === "staging") return "A production idea is welcome if it sharpens the work, and a nuisance if it merely waves at us from the director's chair.";
  if (theme.key === "shape") return "Shape matters: if an evening is long, it must know why; if it is brisk, it must not merely be running away.";
  if (theme.key === "language") return "The words have to act. A line that only announces its own cleverness is a bore in evening dress.";
  if (theme.key === "comedy") return "Comedy cannot simply be inflated. Bustle is not wit, though it often applies for the job.";
  if (theme.key === "music") return "The songs have to change the temperature in the room; polish alone is only a well-brushed hat.";
  if (theme.key === "politics") return "Politics belongs there when it has become drama, not when it has been pinned to the lapel.";
  if (theme.key === "revival") return "A revival has to discover something. Reverence without pressure is just upholstery.";
  if (theme.key === "feeling") return "Feeling is welcome, even cherished, provided the work has earned it and has not simply passed the hat.";
  return theme.principle;
}

function chatAdmirationSentence(analysis) {
  const stance = analysis.stance || {};
  if (stance.average > 0.38 && stance.positive > stance.negative * 1.5) {
    return "When it works, I am glad to say so; enthusiasm is not a vice, merely a dangerous solvent.";
  }
  if (stance.average < -0.28 && stance.negative > stance.positive) {
    return "If I sound cool, it is because the thing has promised more life than it has delivered.";
  }
  return "So the response is mixed in the useful sense: pleased by nerve, allergic to bluff.";
}

function chatReservationSentence(analysis) {
  const themes = analysis.themes || [];
  const weakTheme = themes.find((theme) => ["shape", "staging", "language", "feeling"].includes(theme.key)) || themes[0];
  if (!weakTheme) return "No more should be made of it than the evening itself can bear.";
  if (analysis.stance?.negative && analysis.stance?.positive) {
    return `I would praise it when ${weakTheme.label} becomes necessity, and start fidgeting when it becomes display.`;
  }
  if ((analysis.stance?.average || 0) >= 0) {
    return `The praise comes with the usual condition attached: ${weakTheme.label} must have consequences.`;
  }
  return `My objection would not be decorative grumbling; it is that ${weakTheme.label} has not quite produced consequence.`;
}

function chatContentThreadSentence(analysis) {
  const people = distinctChatPeople(commonChatValues(chatAnswerRecords(analysis), (record) => record.people || [], 5))
    .filter((person) => chatNormalize(person) !== chatNormalize(analysis.subjectLabel));
  if (people.length >= 2) {
    return `${formatList(people.slice(0, 4))} matter because they give the subject bodies, timing, and friction.`;
  }
  if ((analysis.stance?.average || 0) < -0.2) {
    return "The trouble is not ambition; ambition is welcome. The trouble is when the idea remains larger than the life it is meant to contain.";
  }
  return "The thing has to move from idea into pressure; otherwise one is left admiring the label on an empty bottle.";
}

function chatSubjectMatterSentence(analysis) {
  return chatContentThreadSentence(analysis);
}

function titleCaseFirst(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
}

function uniqueChatSources(matches, terms, limit) {
  const seen = new Set();
  const sources = [];
  for (const match of matches) {
    if (seen.has(match.record.slug)) continue;
    seen.add(match.record.slug);
    sources.push({
      record: match.record,
      snippet: chatSnippet(match.chunk.t, terms),
      score: match.score,
    });
    if (sources.length >= limit) break;
  }
  return sources;
}

function chatIntent(question) {
  const normalized = chatNormalize(question);
  if (/^(who|which actor|which director|which performer)/.test(normalized)) return "people";
  if (/^(where|which venue|which city)/.test(normalized)) return "places";
  if (/^(when|which year|what year)/.test(normalized)) return "dates";
  if (/\b(like|think|opinion|verdict|good|bad|review)\b/.test(normalized)) return "judgement";
  return "overview";
}

function chatSentiment(text) {
  return chatNormalize(text)
    .split(/\s+/)
    .reduce((score, word) => {
      if (CHAT_POSITIVE_WORDS.has(word)) return score + 1;
      if (CHAT_NEGATIVE_WORDS.has(word)) return score - 1;
      return score;
    }, 0);
}

function chatStanceProfile(evidence) {
  const scores = evidence.map((item) => chatSentiment(item.chunk.t));
  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = scores.length ? total / scores.length : 0;
  const positive = scores.filter((score) => score > 1).length;
  const negative = scores.filter((score) => score < -1).length;
  let summary = "mixed: exacting, interested, and reluctant to let enthusiasm do the work of judgment";
  if (average > 0.38 && positive > negative * 1.5) summary = "admiring, though rarely unconditional";
  if (average < -0.28 && negative > positive) summary = "cool, with the praise rationed and the objections specific";
  if (positive && negative && Math.abs(positive - negative) <= 3) summary = "divided in the useful sense: alert to achievement, allergic to bluff";
  return { average, positive, negative, summary };
}

function chatThemeProfile(evidence, subject = null) {
  const subjectKey = chatNormalize(chatSubjectLabel(subject, subject?.terms || []));
  const scored = CHAT_THEMES.map((theme) => {
    let count = evidence.reduce((sum, item) => {
      const text = item.chunk._textSearch || chatNormalize(item.chunk.t);
      return sum + theme.terms.reduce((themeSum, term) => themeSum + boundedTermCount(text, term, 3), 0);
    }, 0);
    if (theme.key === "comedy" && CHAT_TRAGEDY_SUBJECTS.has(subjectKey)) count *= 0.35;
    return { ...theme, count };
  })
    .filter((theme) => theme.count)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return scored.length ? scored : CHAT_THEMES.slice(0, 3).map((theme) => ({ ...theme, count: 0 }));
}

function chatMotifs(evidence, terms, subject) {
  const blocked = new Set([...(terms || []), ...(subject?.terms || [])]);
  const counts = new Map();
  evidence.slice(0, 70).forEach((item) => {
    chatNormalize(item.chunk.t)
      .split(/\s+/)
      .filter((word) => word.length > 4 && !CHAT_COMMON_WORDS.has(word) && !blocked.has(word))
      .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([word]) => word);
}

function commonChatValues(records, extractor, limit) {
  const counts = new Map();
  records.forEach((record) => {
    extractor(record).flatMap(splitChatList).forEach((value) => {
      const label = String(value || "").trim();
      if (!label) return;
      const key = entitySlug(label);
      const entry = counts.get(key) || { label, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    });
  });
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map((entry) => entry.label);
}

function chatSubjectLabel(subject, terms = []) {
  if (!subject?.label) return terms.map(titleCaseWord).join(" ");
  const normalized = chatNormalize(subject.label);
  if (normalized.startsWith("the ") && normalized.endsWith(" collection")) {
    return titleCaseWords(normalized.replace(/^the\s+/, "").replace(/\s+collection$/, ""));
  }
  if (terms.length === 1 && normalized.includes(terms[0]) && !["title", "production", "person"].includes(subject.kind)) {
    return titleCaseWord(terms[0]);
  }
  return subject.label;
}

function titleCaseWord(value) {
  const word = String(value || "");
  if (!word) return "";
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
}

function titleCaseWords(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map(titleCaseWord)
    .join(" ");
}

function chatYearRange(records) {
  const years = records
    .map((record) => Number(record.year || String(record.date || "").slice(0, 4)))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (!years.length) return "";
  const first = years[0];
  const last = years.at(-1);
  return first === last ? String(first) : `${first} to ${last}`;
}

function lowerFirst(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return `${text.slice(0, 1).toLowerCase()}${text.slice(1)}`;
}

function splitChatList(value) {
  if (Array.isArray(value)) return value.flatMap(splitChatList);
  return String(value || "")
    .split(/\s*;\s*|\s+\/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sourcePhrase(records) {
  const titles = records.slice(0, 3).map((record) => record.title || record.production || "Untitled");
  return formatList(titles);
}

function formatList(items) {
  const values = items.filter(Boolean);
  if (values.length <= 1) return values[0] || "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function chatSnippet(text, terms) {
  const sentences = String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const best = sentences
    .map((sentence) => ({
      sentence,
      score: terms.reduce((sum, term) => sum + (chatNormalize(sentence).includes(term) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length)[0]?.sentence || String(text || "");
  return clipWords(best, 26);
}

function clipWords(text, limit) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= limit) return words.join(" ");
  return `${words.slice(0, limit).join(" ")}...`;
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
    link.innerHTML = `<span>${point.label}</span><em>${countBadgeText(point.count)}</em>`;
    links.append(link);
  });
  const venueTitle = document.createElement("h2");
  venueTitle.textContent = "Venues";
  const venueLinks = document.createElement("div");
  venueLinks.className = "map-link-list map-venue-links";
  venues.forEach((point) => {
    const link = document.createElement("a");
    link.dataset.mapLabel = `${point.label} ${point.city || ""} venue`;
    link.href = `#entity:venues:${point.slug}`;
    link.innerHTML = `<span>${point.label}${point.city ? `<small>${point.city}</small>` : ""}</span><em>${countBadgeText(point.count)}</em>`;
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
      maxVenues: Infinity,
      maxVenueLabels: 14,
      initialCenter: [50, -35],
      initialZoom: 3,
      searchControl: true,
      jumpControl: true,
      onSearch: filterMapList,
      onZoom: (zoom) => shell.classList.toggle("is-venue-zoom", zoom >= 11),
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
    maxVenues: Infinity,
    maxVenueLabels: 6,
    initialCenter: [50, -35],
    initialZoom: 3,
    searchControl: true,
    jumpControl: true,
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
    const radius = 5 + Math.sqrt(point.count / maxCount) * 11;
    const size = Math.round(radius * 2);
    const marker = L.marker([point.lat, point.lon], {
      icon: L.divIcon({
        className: "map-pin-icon map-pin-city",
        html: `<span style="width:${size}px;height:${size}px"></span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      }),
      zIndexOffset: 500,
    }).addTo(map);
    marker.bindPopup(`<strong>${point.label}</strong>${point.count.toLocaleString()} mapped article references<br><a href="#entity:cities:${point.slug}">Open city index</a>`);
    searchable.push({ label: `${point.label} city`, point, marker, zoom: 9 });
    marker._cushmanMarkerType = "city";
    bounds.push([point.lat, point.lon]);
  });
  (options.venues || []).slice(0, options.maxVenues ?? (options.venues || []).length).forEach((point) => {
    const marker = L.marker([point.lat, point.lon], {
      icon: L.divIcon({
        className: "map-pin-icon map-pin-venue",
        html: "<span></span>",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
    }).addTo(map);
    marker.bindPopup(`<strong>${point.label}</strong>${point.city || ""}<br>${point.count.toLocaleString()} article references<br><a href="#entity:venues:${point.slug}">Open venue index</a>`);
    venueMarkers.push(marker);
    searchable.push({ label: `${point.label} ${point.city || ""} venue`, point, marker, zoom: 13 });
    bounds.push([point.lat, point.lon]);
  });
  const updateVenueVisibility = () => {
    const zoom = map.getZoom();
    venueMarkers.forEach((marker) => {
      const el = marker.getElement();
      if (el) el.style.opacity = zoom >= 11 ? "1" : "0";
    });
    searchable.forEach((item) => {
      if (item.marker._cushmanMarkerType !== "city") return;
      const el = item.marker.getElement();
      if (el) el.style.opacity = zoom >= 11 ? "0.32" : "1";
    });
    if (typeof options.onZoom === "function") options.onZoom(zoom);
  };
  map.on("zoomend", updateVenueVisibility);
  if (options.initialCenter) {
    map.setView(options.initialCenter, options.initialZoom || 8);
  } else if (bounds.length) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
  if (options.jumpControl) {
    const jump = L.DomUtil.create("div", "leaflet-jump-control");
    const jumps = [
      ["World", [50, -35], 3],
      ["Toronto", [43.6532, -79.3832], 13],
      ["London", [51.5072, -0.1276], 12],
    ];
    jumps.forEach(([label, center, zoom]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => map.setView(center, zoom));
      jump.append(button);
    });
    L.DomEvent.disableClickPropagation(jump);
    L.DomEvent.disableScrollPropagation(jump);
    map.getContainer().append(jump);
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
  const legend = L.DomUtil.create("div", "leaflet-map-legend");
  legend.innerHTML = `<span><i class="legend-city"></i>City cluster</span><span><i class="legend-venue"></i>Venue</span>`;
  L.DomEvent.disableClickPropagation(legend);
  L.DomEvent.disableScrollPropagation(legend);
  map.getContainer().append(legend);
  const refreshMapSize = () => {
    map.invalidateSize();
    if (options.initialCenter) map.setView(options.initialCenter, options.initialZoom || 8, { animate: false });
    points.forEach((point) => {
      const marker = searchable.find((item) => item.point === point && item.label.includes("city"))?.marker;
      if (marker && !map.hasLayer(marker)) marker.addTo(map);
    });
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

  return key === "shakespeare" ? `#entity:shakespeare-plays:${entitySlug(title)}` : `#archive?q=${encodeURIComponent(title)}`;
}

function slugForCollection(title) {
  const map = {
    "Current Collection": "current",
    "The Canadian Collection": "canadian",
    "UK Collection": "uk",
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
    uk: "UK Collection",
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
    Shakespeare: "Play-by-play browsing for the Shakespeare collection.",
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
  const groups = productionGroups(record);
  const parts = compactParts([
    record.production_title,
    ...groups.flatMap((group) => splitEntityList(group.production_title)),
    record.company,
    ...groups.flatMap((group) => splitEntityList(group.company)),
    record.city,
    ...groups.flatMap((group) => splitCityList(group.city)),
  ]);
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

  const cards = visible.map((record) => safeResultCard(record));

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

function safeResultCard(record) {
  try {
    return resultCard(record);
  } catch (error) {
    console.error("Could not render result card", record?.slug, error);
    return fallbackResultCard(record);
  }
}

function fallbackResultCard(record) {
  const card = document.createElement("a");
  card.className = "result-card";
  card.href = `#review:${record?.slug || ""}`;

  const date = document.createElement("time");
  date.textContent = formatDate(record?.date);

  const title = document.createElement("span");
  title.className = "card-title";
  const headline = document.createElement("strong");
  headline.textContent = record?.title || record?.production_title || "Untitled";
  title.append(headline);

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = [record?.publication, record ? typeLabel(record) : ""].filter(Boolean).join(" / ");

  const copy = document.createElement("span");
  copy.className = "result-copy";
  copy.append(date, title, meta);
  card.append(copy);
  return card;
}

function resultCard(record) {
  const card = document.createElement("a");
  card.className = "result-card";
  card.href = `#review:${record.slug}`;
  const media = record.media?.[0];
  if (media?.local_path) {
    card.classList.add("has-thumb");
    const thumb = document.createElement("img");
    thumb.className = "result-thumb";
    thumb.src = new URL(`../site_export/content/${media.local_path}`, import.meta.url);
    thumb.alt = media.alt || media.caption || record.title || "";
    thumb.loading = "lazy";
    card.append(thumb);
  }

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

  const copy = document.createElement("span");
  copy.className = "result-copy";
  copy.append(date, title);
  if (productionPartsList.length) copy.append(production);
  copy.append(meta);
  card.append(copy);
  return card;
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]*?\n---\s*/, "").trim();
}

function safeDecodeHashValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function articleContentUrl(sourceFile) {
  const safePath = String(sourceFile || "")
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return new URL(safePath, CONTENT_ROOT);
}

async function fetchArticleMarkdown(record) {
  if (!record?.source_file) throw new Error("Article record has no source_file");
  const response = await fetch(articleContentUrl(record.source_file));
  if (!response.ok) throw new Error(`Article content request failed (${response.status})`);
  return response.text();
}

function articleLoadNotice(message, sourceFile = "") {
  const notice = document.createElement("p");
  notice.className = "article-load-notice";
  notice.textContent = sourceFile ? `${message} Source file: ${sourceFile}` : message;
  return notice;
}

function plainParagraphNodes(markdown) {
  return stripFrontmatter(markdown)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const p = document.createElement("p");
      p.textContent = block.replace(/\s*\n\s*/g, " ");
      return p;
    });
}

function articleTitleNodes(record) {
  const title = document.createElement("h1");
  const titleParts = headlineParts(record?.title || record?.production_title || "Untitled");
  title.textContent = titleParts.headline;
  const deck = document.createElement("p");
  deck.className = "article-deck";
  deck.textContent = titleParts.deck;
  const date = document.createElement("time");
  date.className = "article-date";
  date.textContent = formatDate(record?.date);
  const meta = document.createElement("p");
  meta.className = "article-meta";
  meta.textContent = record ? [articlePublicationLabel(record), typeLabel(record)].filter(Boolean).join(" / ") : "";
  return { date, title, deck, meta, titleParts };
}

function fallbackArticleBodyNodes(markdown) {
  const nodes = plainParagraphNodes(markdown);
  return nodes.length
    ? nodes
    : [articleLoadNotice("The article has no readable body text in the exported source file.")];
}

async function renderEmergencyArticle(slug, error) {
  console.error("Could not render enhanced article route", error);
  const normalizedSlug = safeDecodeHashValue(slug);
  const record = state.records.find((item) => item.slug === normalizedSlug);
  if (!record) {
    const title = document.createElement("h1");
    title.textContent = "Article Unavailable";
    const notice = articleLoadNotice(`No article record matched this link: ${normalizedSlug}`);
    els.article.replaceChildren(title, notice);
    els.articleView.hidden = false;
    return;
  }

  let markdown = "";
  let notice = articleLoadNotice("The enhanced article view failed, so the plain article text is shown here.", record.source_file);
  try {
    markdown = await fetchArticleMarkdown(record);
  } catch (fetchError) {
    console.error("Could not load article body in emergency renderer", record.slug, fetchError);
    notice = articleLoadNotice("The article record loaded, but the article body file could not be fetched.", record.source_file);
  }

  const { date, title, deck, meta, titleParts } = articleTitleNodes(record);
  const body = document.createElement("div");
  body.className = "article-body";
  body.replaceChildren(...fallbackArticleBodyNodes(markdown));
  const articleParts = [date, title];
  if (titleParts.deck) articleParts.push(deck);
  articleParts.push(meta, notice, body);
  els.article.replaceChildren(...articleParts);
  els.articleView.hidden = false;
  els.articleView.scrollIntoView({ behavior: "auto", block: "start" });
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

const ARTICLE_ROLE_GROUPS = [
  ["directors", "Director", "director", 3],
  ["playwrights", "Playwright", "playwright", 3],
  ["actors", "Actor", "actors", 8],
  ["composers-lyricists", "Music", "composer_lyricist", 4],
  ["musical-directors", "Music Director", "musical_director", 2],
  ["choreographers", "Choreographer", "choreographer", 2],
  ["set-designers", "Set", "set_designer", 2],
  ["costume-designers", "Costume", "costume_designer", 2],
  ["lighting-designers", "Lighting", "lighting_designer", 2],
  ["sound-designers", "Sound", "sound_designer", 2],
  ["performers", "Performer", "performers", 4],
  ["musicians", "Musician", "musicians", 4],
  ["artists", "Artist", "artists", 4],
];

function articleProductionGroups(record) {
  const groups = productionGroups(record);
  if (groups.length < 2) return null;
  const schema = displaySchema(record);

  const wrap = document.createElement("div");
  wrap.className = `article-production-groups${groups.length > 5 ? " article-production-groups-long" : ""}`;
  const collapsed = groups.length > 5 ? document.createElement("details") : null;
  if (collapsed) {
    collapsed.className = "article-production-more";
    collapsed.open = !window.matchMedia("(max-width: 760px)").matches;
    const summary = document.createElement("summary");
    summary.textContent = `${groups.length - 4} more productions`;
    collapsed.append(summary);
  }

  groups.forEach((group, index) => {
    const section = document.createElement("section");
    const chipRows = [
      ["companies", schema.companyLabel, splitEntityList(group.company).slice(0, 3)],
      ["venues", schema.venueLabel, splitEntityList(group.venue).slice(0, 2)],
      ["cities", schema.cityLabel, splitCityList(group.city).slice(0, 2)],
      ...ARTICLE_ROLE_GROUPS.map(([type, prefix, role, limit]) => [type, schema.roleLabels[role] || prefix, splitEntityList(group[role]).slice(0, limit)]),
    ].filter(([, , values]) => values.length);
    section.className = `article-production-group${chipRows.length ? "" : " article-production-group-empty"}`;
    const title = entityChip("productions", group.production_title, "", "production");
    title.classList.add("article-production-title-link");
    const nav = document.createElement("nav");
    nav.className = "article-entities article-production-group-entities";
    nav.setAttribute("aria-label", `${group.production_title} metadata links`);
    chipRows.forEach(([type, prefix, values]) => {
      values.forEach((value) => nav.append(entityChip(type, value, prefix, "production")));
    });
    section.replaceChildren(title, nav);
    if (collapsed && index >= 4) {
      collapsed.append(section);
    } else {
      wrap.append(section);
    }
  });
  if (collapsed) wrap.append(collapsed);
  return wrap;
}

function articleEntityLinks(record) {
  const grouped = articleProductionGroups(record);
  const schema = displaySchema(record);
  const groups = productionGroups(record);
  const singleGroup = groups.length === 1 ? groups[0] : null;
  const groupedProductionValues = grouped ? groupedProductionLabelValues(record) : [];
  const groupedCompanyValues = grouped ? groupedEntityValues(record, "company") : [];
  const groupedVenueValues = grouped ? groupedEntityValues(record, "venue") : [];
  const groupedCityValues = grouped ? groupedEntityValues(record, "city", splitCityList) : [];
  const singleValues = (field, splitter = splitEntityList) => singleGroup ? splitter(singleGroup[field]) : [];
  const singleProductionValues = singleGroup ? productionLabelValues(singleGroup.production_title) : [];
  const singleRoleValues = (role) => singleGroup ? splitEntityList(singleGroup[role]) : [];
  const workValues = articleWorkValues(record);
  const subjectWorkValues = schema.workType === "subjects" ? valuesExceptGrouped(workValues, []) : [];
  const productionChipGroups = [
    [schema.workType, schema.workLabel, schema.workType === "subjects" ? [] : valuesExceptGrouped([...workValues, ...singleProductionValues], groupedProductionValues).slice(0, 4)],
  ].filter(([, , values]) => values.length);
  const relatedProductionValues = schema.workType !== "productions" && schema.workType !== "books"
    ? valuesExceptGrouped([...productionLabelValues(record.production_title), ...singleProductionValues], groupedProductionValues).slice(0, 4)
    : [];
  const contextGroups = [
    ["book-authors", "Book Author", splitEntityList(record.book_author).slice(0, 4)],
    ["publishers", "Publisher", splitEntityList(record.publisher).slice(0, 3)],
    ["networks", "Network", splitEntityList(record.network_or_platform).slice(0, 3)],
    ["productions", "Related Work", relatedProductionValues],
    ["companies", schema.companyLabel, record.article_category === "Television Review" ? [] : valuesExceptGrouped([...splitEntityList(record.company), ...singleValues("company")], groupedCompanyValues).slice(0, 3)],
    ["venues", schema.venueLabel, valuesExceptGrouped([...splitEntityList(record.venue), ...singleValues("venue")], groupedVenueValues).slice(0, 2)],
    ["cities", schema.cityLabel, valuesExceptGrouped([...splitCityList(record.city), ...singleValues("city", splitCityList)], groupedCityValues).slice(0, 2)],
    ["collections", "Series", collectionNames(record).filter((name) => name === "Short Takes")],
  ].filter(([, , values]) => values.length);

  const peopleGroups = [
    ["subjects", "Subject", valuesExceptGrouped(splitEntityList(record.subject_people), schema.workType === "subjects" ? workValues : []).slice(0, 6)],
    ...ARTICLE_ROLE_GROUPS.map(([type, prefix, role, limit]) => [type, schema.roleLabels[role] || prefix, valuesExceptGrouped([...(record.roles?.[role] || []), ...singleRoleValues(role)], grouped ? groupedRoleValues(record, role) : []).slice(0, limit)]),
  ].filter(([, , values]) => values.length);

  if (!grouped && !productionChipGroups.length && !contextGroups.length && !peopleGroups.length) return null;
  const wrap = document.createElement("div");
  wrap.className = `article-entity-groups${grouped ? " article-entity-groups-multiple" : ""}`;

  if (grouped) wrap.append(grouped);
  if (subjectWorkValues.length) wrap.append(articleSubjectEntityGroup(record, schema.workLabel, subjectWorkValues));
  if (productionChipGroups.length) wrap.append(articleEntityGroup(schema.workLabel, productionChipGroups, "production"));
  if (contextGroups.length) wrap.append(articleEntityGroup(grouped ? "Shared Context" : "Work", contextGroups, "context"));
  if (peopleGroups.length) wrap.append(articleEntityGroup("People", peopleGroups, "people"));

  return wrap;
}

function articleSubjectEntityGroup(record, label, values) {
  const section = document.createElement("section");
  section.className = "article-entity-section article-entity-section-subjects";
  const heading = document.createElement("span");
  heading.className = "article-entity-label";
  heading.textContent = label;
  const nav = document.createElement("nav");
  nav.className = "article-entities";
  nav.setAttribute("aria-label", `${label} metadata links`);
  values.forEach((value) => {
    const info = subjectChipInfo(record, value);
    nav.append(entityChip(info.type, value, info.prefix, "people"));
  });
  section.replaceChildren(heading, nav);
  return section;
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
    ...entityValues(record, "books").map((label) => ({ type: "books", label, priority: 1 })),
    ...entityValues(record, "productions").map((label) => ({ type: "productions", label, priority: 1 })),
    ...entityValues(record, "book-authors").map((label) => ({ type: "book-authors", label, priority: 2 })),
    ...entityValues(record, "subjects").map((label) => ({ type: "subjects", label, priority: 2 })),
    ...entityValues(record, "publishers").map((label) => ({ type: "publishers", label, priority: 2 })),
    ...entityValues(record, "topics").map((label) => ({ type: "topics", label, priority: 2 })),
    ...entityValues(record, "events").map((label) => ({ type: "events", label, priority: 2 })),
    ...entityValues(record, "networks").map((label) => ({ type: "networks", label, priority: 2 })),
    ...entityValues(record, "companies").map((label) => ({ type: "companies", label, priority: 2 })),
    ...entityValues(record, "directors").map((label) => ({ type: "directors", label, priority: 3 })),
    ...entityValues(record, "playwrights").map((label) => ({ type: "playwrights", label, priority: 3 })),
    ...entityValues(record, "actors").map((label) => ({ type: "actors", label, priority: 4 })),
    ...entityValues(record, "composers-lyricists").map((label) => ({ type: "composers-lyricists", label, priority: 4 })),
    ...entityValues(record, "performers").map((label) => ({ type: "performers", label, priority: 4 })),
    ...entityValues(record, "musicians").map((label) => ({ type: "musicians", label, priority: 4 })),
    ...entityValues(record, "artists").map((label) => ({ type: "artists", label, priority: 4 })),
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
  const normalizedSlug = safeDecodeHashValue(slug);
  const record = state.records.find((item) => item.slug === normalizedSlug);
  if (!record) {
    const title = document.createElement("h1");
    title.textContent = "Article Unavailable";
    const notice = articleLoadNotice(`No article record matched this link: ${normalizedSlug}`);
    els.article.replaceChildren(title, notice);
    els.articleView.hidden = false;
    els.articleView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  let markdown = "";
  let notice = null;
  try {
    markdown = await fetchArticleMarkdown(record);
  } catch (error) {
    console.error("Could not load article body", record.slug, error);
    notice = articleLoadNotice(
      "The article record loaded, but the article body file could not be fetched.",
      record.source_file
    );
  }

  const { date, title, deck, meta, titleParts } = articleTitleNodes(record);

  const body = document.createElement("div");
  body.className = "article-body";
  let bodyNodes = [];
  if (markdown) {
    try {
      bodyNodes = paragraphNodes(markdown, record);
    } catch (error) {
      console.error("Could not render enhanced article body", record.slug, error);
      bodyNodes = plainParagraphNodes(markdown);
      notice = articleLoadNotice(
        "The article text loaded, but enhanced linking failed. Showing plain article text.",
        record.source_file
      );
    }
  }
  if (!bodyNodes.length && !notice) {
    notice = articleLoadNotice("The article has no body text in the exported source file.", record.source_file);
  }
  body.replaceChildren(...bodyNodes);

  const articleParts = [date, title];
  if (titleParts.deck) articleParts.push(deck);
  articleParts.push(meta);
  try {
    const entityLinks = articleEntityLinks(record);
    if (entityLinks) articleParts.push(entityLinks);
  } catch (error) {
    console.error("Could not render article metadata chips", record.slug, error);
    notice = articleLoadNotice("Metadata chips could not be rendered for this article. Article text is shown below.", record.source_file);
  }
  if (notice) articleParts.push(notice);
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
    const slug = hash.replace("#review:", "");
    showReview(slug).catch((error) => renderEmergencyArticle(slug, error));
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

  if (hash === "#master-index" || hash.startsWith("#master-index:")) {
    const filterKey = hash.startsWith("#master-index:") ? hash.replace("#master-index:", "") : DEFAULT_MASTER_INDEX_FILTER;
    document.body.classList.add("index-open");
    renderMasterIndex(filterKey);
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
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

  if (hash.startsWith("#browse-group:")) {
    const typeValue = hash.replace("#browse-group:", "");
    if (TYPE_GROUPS.some((group) => group.value === typeValue)) {
      document.body.classList.add("index-open");
      renderCategoryBrowsePage(typeValue);
      els.indexView.hidden = false;
      els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    }
    return;
  }

  if (hash.startsWith("#browse-collection:")) {
    const slug = hash.replace("#browse-collection:", "");
    if (collectionFromSlug(slug)) {
      document.body.classList.add("index-open");
      renderCollectionBrowsePage(slug);
      els.indexView.hidden = false;
      els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
    }
    return;
  }

  if (hash === "#map") {
    document.body.classList.add("map-open");
    renderMapView();
    els.mapView.hidden = false;
    els.mapView.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  if (hash === "#ask" || hash.startsWith("#ask?") || hash === "#cushbot" || hash.startsWith("#cushbot?")) {
    const [, queryString] = hash.split("?");
    const params = new URLSearchParams(queryString || "");
    document.body.classList.add("index-open");
    renderChatbotPage(params.get("q") || "");
    els.indexView.hidden = false;
    els.indexView.scrollIntoView({ behavior: "auto", block: "start" });
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
      document.body.classList.add("search-open");
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
    document.body.classList.add("search-open");
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
  syncArchivePageClass();
  setArchiveExpanded(false);
  renderShakespeareNav();
  renderResults();
});

window.addEventListener("hashchange", route);

init().catch((error) => {
  els.archiveCount.textContent = "Content export unavailable";
  console.error(error);
});
