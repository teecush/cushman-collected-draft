# Cushman Collected — design comparison

Main: https://teecush.github.io/cushman-collected-draft/website/
Preview: https://teecush.github.io/cushman-collected-draft/design-preview/
Comparison and review checklist: https://teecush.github.io/cushman-collected-draft/design-review/

## Design changes rolled back

### D01 — Desktop navigation

**Main site:** The earlier search icon and Current, Browse, Explore and About menus, including their dropdown links.

**Preview:** The simplified Catalog, Collections, Latest writing, About and labelled Search navigation.

Menu labels, grouping and search placement are restored; links still use the repaired routes.

### D02 — Phone navigation

**Main site:** The earlier grouped, expandable drawer menu.

**Preview:** A shorter flat list of primary links.

Menu opening, closing, Escape handling and accessible state remain working in both versions.

### D03 — Homepage introduction

**Main site:** The original longer introduction about Robert, with its large drop cap and left-aligned editorial layout.

**Preview:** A shorter centred introduction giving 1963–2026 coverage and the live article count.

The original “over forty years” wording is back for comparison; the catalog still contains writing from 1963 to 2026.

### D04 — Homepage search

**Main site:** The grey Search the Archive panel directly beneath the introduction.

**Preview:** A dedicated search-and-button row with four prominent starting links.

The original placement and appearance are back. The search itself retains the improved matching and filters.

### D05 — Homepage directories

**Main site:** The four earlier directories: Search & Browse, Works & People, Collections, and Explore, with detailed links and counts.

**Preview:** Four broad starting buttons: Browse all articles, Find a work, Find a person, and Browse collections.

The original Browse the Archive heading and directory content are restored. Counts reflect the corrected data.

### D06 — Featured writing

**Main site:** The larger original feature, before the directories, with its photograph, Latest current article label, Open Current Collection link and Newest sidebar.

**Preview:** A smaller feature below the starting links, labelled Latest writing. On phones the redesigned feature hides the photo and Newest sidebar.

The earlier size, ordering and image treatment return. Both versions show the same latest article.

### D07 — Homepage map

**Main site:** The Archive Map section and its Open full map link appear above the exploration cards.

**Preview:** The homepage map is hidden to shorten the page.

The map is back in its original position. Its resources load as it approaches the screen.

### D08 — Article result cards

**Main site:** Large editorial cards, bold headline treatment, stronger top rules and larger photographs. Unsearched lists can lead with the work or production; searches lead with the article headline.

**Preview:** Compact rows with smaller serif headlines, lighter separators, smaller thumbnails and article-first titles.

Pagination, match explanations, incomplete-source labels and result counts remain.

### D09 — Reading details

**Main site:** Production, cast and other metadata are expanded above the article text.

**Preview:** Metadata is initially collapsed behind an expandable details panel.

The original expanded presentation is restored. Jump to article text remains available.

### D10 — Current landing page

**Main site:** The earlier image-led Current gallery with its introductory text and large latest article card.

**Preview:** A filtered catalog of Latest writing.

The gallery is back; opening an article and returning now retains the Current context.

### D11 — Collections, Browse and Indexes landing pages

**Main site:** The original introductory text and card grids for Collections, Browse and Indexes.

**Preview:** New collection descriptions/cards; Browse and Indexes entry links lead directly into the shared catalog.

These landing pages are restored. Searchable people/works indexes and scoped article results remain the improved versions.

### D12 — About page content

**Main site:** Biography heading and the earlier biography/photo layout.

**Preview:** About Robert and the archive heading, plus a new section explaining archive coverage, transcription, gaps and collection overlaps.

The additional archive explanation is removed from the main About page and remains available in the preview. Article-level source notes remain.

### D13 — Contact, newsletter and donation wording

**Main site:** Subscribe & Contact page, the earlier newsletter placeholder, Subscribe footer and Donate labels.

**Preview:** Contact-only page/footer and the longer Donate on the original site label.

The earlier content and labels are restored. Newsletter signup is still explicitly described as unconnected; the existing contact and donation destinations are unchanged.

### D14 — Catalog and control styling

**Main site:** Search the Archive heading, earlier archive width/spacing, square controls, underlined fields and stronger black rules that fit the original visual style.

**Preview:** Catalog heading, more restrained archive spacing and the redesigned rounded/outlined fields, tabs and control treatment.

The controls themselves remain because they provide the retained navigation improvements.

## Improvements retained

### K01 — Search and filtering

Visible usability improvement. Titles, works, credited people and places remain searchable. Publication, year range, subject, form, collection and advanced company/place/person/role/source filters remain, with removable active-filter labels and clear empty states.

### K02 — Optional article-text search

Visible usability improvement. Readers can choose to search article text. The separate text index is downloaded only when requested.

### K03 — Searchable people and works indexes

Visible usability improvement. Given-name and surname matching, role/kind selection, A–Z filtering and most-covered ordering remain. Results load in groups of 100 instead of rendering every entry at once.

### K04 — Article return and browser Back

Navigation repair. Query, filters, Shakespeare subgroup, sort order, loaded result count and browse origin remain in the URL/context. Returning from an article restores the result list and position. Direct article visits show an honest Browse more link.

### K05 — Complete, scoped results

Navigation repair. The catalog starts with up to 36 articles and offers more. People/work counts follow the selected scope. Selected entries retain that scope, with an explicit option to expand to all coverage. Category and collection links retain the corrected shared result path.

### K06 — Guided Explorer

Visible usability improvement. The revised functional Explorer remains: combinable selectors, a visible total, an 18-article preview and View all matching articles. Its selections can be bookmarked. The old branching widget has not been restored.

### K07 — Timeline

Visible usability improvement. The working Chronology alias, year selector, previous/next-year controls and keyboard-operable slider remain. Year and loaded count are preserved. The old drag-only visual timeline has not been restored.

### K08 — Map filtering and place scope

Visible usability improvement. Filtering actually hides non-matches. Search, List/Map and list choices, and layer controls remain outside the map. Same-named venues retain their city scope, including an explicit city-not-recorded value. A list provides an alternative to map interaction.

### K09 — Reading tools

Visible usability improvement. Explicit Share, Cite, Print, Suggest a correction and Jump to article text remain. Safe emphasis and other supported Markdown formatting render correctly. These tools remain visible even though expanded metadata and older card styling have returned.

### K10 — Source transparency and transcripts

Content/accessibility improvement. Incomplete surviving source notices, editorial gaps, date notes, correspondence links and the two source-checked March 1969 letter transcripts remain. Other letters retain their existing images/descriptions where no checked transcript exists.

### K11 — Month-accurate dates

Metadata repair. Tom and Viv and Jumpers is displayed as May 1985. The Impression of Impotence is displayed as March 1969 with the month explicitly identified as inferred. Normalized first-of-month dates are not presented as known publication days.

### K12 — Company names and categories

Metadata/navigation repair. 7:84 Company remains repaired. All 31 source categories have explicit filter mappings. Shakespeare consistently includes all 346 explicitly identified articles, including the 18 Thoughts & Context articles.

### K13 — Reliable exports

Internal improvement. The metadata parser preserves colons inside entity names. Deterministic tie-breaking prevents subject inference changing unpredictably between builds.

### K14 — Faster and bounded delivery

Internal improvement. Compact catalog data, per-article detail loading, on-demand text search, deferred map assets, cached indexes and 110 derived thumbnails remain. The catalog payload is about 45% smaller than the full metadata export. Preservation images are unchanged.

### K15 — Readable article URLs and discovery

Internal improvement. All 3,206 articles retain readable HTML pages, individual titles/metadata, canonical URLs and sitemap entries. Existing article hash links and aliases continue to work. The custom unavailable-page handling remains.

### K16 — Accessibility and stale-page repairs

Internal/usability repair. The hidden-element CSS repair, focus outlines, skip link, button state labels, usable phone controls and unknown-route recovery remain. Navigating to a bad route no longer leaves unrelated previous content on screen.

### K17 — Legacy pages

Internal improvement. The UK draft and CushBot retain explanatory links to the main archive and noindex notices. No older archival source or private material was newly published for this comparison.

### K18 — Independent comparison navigation

Comparison support. The preview has its own article-return context and preview article links. Browsing it does not switch a reader into the main design. Both designs use the same corrected public archive data.
