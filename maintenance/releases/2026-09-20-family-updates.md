# Family-approved site updates — 20 September 2026

The release retains the main site's earlier visual language and the independent September design preview. The pre-update baseline is Git tag `index-review-baseline-20260920` at `53ad05d7`. The existing full project backup remains in `backups/before-site-redesign-20260909-214831/project/`. No raw scrapbook photographs or PDFs are part of this release.

## Catalog and indexes

Search the Archive, Works A–Z, People A–Z and Publications use matching heading sizes and positions. Tabs remain in the same place, and the index fields have more breathing room. Find a Person, Role and Order share a row on desktop, with their selected values and bottom rules aligned. Fields stack on narrow screens.

Indexes render every matching entry. Sticky alphabet tabs scroll to a letter's section without hiding the other entries. Works and People default to A–Z. Counts appear only for two or more articles. Publications defaults to Most covered and has no alphabet strip in either sort order. Ten publications with at least five articles have feature cards; eight have verified mastheads and two use names. Twenty smaller publications appear as names.

Chris Abrahams was corrected to Chris Abraham in the director metadata of the 24 April 2003 Russell Hill review. The index now groups 41 articles under Chris Abraham. Only this one canonical source file changed; its article body did not change. A copy of that source and the pre-change canonical hash manifest are in this report directory.

Main archive keyword search waits for Enter or Search. People/Works index searches still narrow their lists while typing. Search article text stays visible, neatly aligned with the scope explanation on desktop. Other filters sit inside an initially collapsed Advanced Search disclosure. Clicking or typing in the main search field does not expand it. Returning to results restores the search, filters and list position; browser history restores article reading position. Home starts at the top.

## Home, menus and places

Current is now Recent throughout the main public interface; old Current links remain valid. The old latest-current feature has been replaced by Article Spotlight between Search and Browse: a different article each Toronto calendar day, shared consistently by visitors, showing the publication, date and an excerpt. The homepage Browse the Archive directory and map remain in place, as requested.

The Indexes menu contains All Works, All People, Publications and Places. The Publications submenu contains only National Post, The Observer, The Globe and Mail, The New York Times, The Guardian and Other Publications, in that order. Categories was removed from the Browse menu. Comparable action buttons use uppercase labels.

Places shows Browse Cities and Browse Venues, followed by the embedded map and a separate full-map link. The timeline again displays year bars with article counts, rather than a slider/dropdown. Year links, complete results and keyboard navigation remain. Fourteen records with dates but missing year fields now appear in year-based browsing; one genuinely undated article remains separate.

## Collections

Shakespeare retains its existing page. Sondheim has 18 show cards, all with artwork, and related essays below. Each card opens the matching articles under the same image. Musicals features 96 titles with at least two articles and lists the remaining 169 titles alphabetically below. Eighty featured musical titles have verified artwork; other titles have readable typeset cards.

Stratford and Shaw use matching zoomed venue maps, theatre cards and a season selector. Venue links retain festival, city and year scope. Selecting a season also shows the associated production titles. The optional theatre silhouettes and draggable season slider were not added; the map and season selector provide the requested navigation.

Television presents programme artwork in television frames. Albums uses record-cover cards on shelves, and Book Reviews uses a bookshelf with titles beneath the covers. Profiles & Obits groups articles by their actual subjects and uses labelled monochrome portraits, with name cards when a verified portrait was unavailable. Early Writing includes only dated articles from 1963 through 1966.

There are 399 verified artwork assignments using 386 local image files: 18 Sondheim, 80 Musicals, 100 Television, 41 Albums, 55 Books, 97 Profiles and 8 publication mastheads. Artwork missing a confident match uses a readable title/name card. `artwork/missing-artwork.json` lists those entries. Low-resolution artwork is served locally; public image credits list sources and licence details. Source URLs, access methods, rights notes and file hashes are recorded in `artwork/source-manifest.json`. Wikipedia/Wikimedia, Open Library and MusicBrainz/Cover Art Archive were explicitly approved by the user. No credentials or authenticated archive access were used.

Collection-only corrections distinguish books from recordings in mixed reviews, separate programmes in shared reviews, remove known straight plays from Musicals and identify profile subjects from the article text. These live in `website/collection-curation.json`, not in canonical transcriptions. Evidence is in `collection_curation_sources.json`.

## Early Cambridge investigation

The Trip 4 New Cambridge and Broadsheet PDFs contain five signed Robert Cushman articles absent from the catalog, plus one unsigned preview. These omissions predate the September redesign. The identified pages account for six additional distinct items, not a verified dozen; one scan duplicates two clippings. They are not yet transcribed or ingested. Two signed articles lack a visible publication date, and the unsigned preview needs authorship confirmation. See `reports/early_cambridge_2026-09-20/README.md` for exact titles, pages and evidence. This release does not claim to have restored those missing texts.

## Verification

Catalog, index and collection unit checks passed. Generated-page validation passed for all 3,206 article pages, their local assets, detail identities and sitemap entries. Chris Abraham has 41 references and the misspelling has zero. Canonical hashes confirm exactly one expected metadata correction.

Browser checks covered desktop and 390/320px phone layouts, no horizontal page overflow, full People index and sticky letter jumps, publications ordering/mastheads, submitted search and collapsed filters, home map/directory preservation, timeline counts and keyboard selection, festival/year/venue scoping, collection artwork/result links, image credits and article back/forward reading-position restoration. The Sopranos card opens 13 scoped results; Into the Woods opens four. Stratford 2017 Festival Theatre opens five; Shaw 2017 displays three theatre cards. The separate preview code has no changes.

## Rollback

The spelling correction is committed separately from the interface release. To undo the presentation as a whole while keeping corrected data, revert the interface release commit with an ordinary Git revert, then publish main. Do not reset or force-push history. The local release report records the final commits and deployment evidence.

For one requested adjustment, use the baseline tag as the reference and make a focused edit: index layout/letters/counts in `website/index-engine.js`, `catalog.js` and the appended `classic.css`; search controls and timeline in `catalog.js`; reading position, Recent and Spotlight in `app.js`; menu labels in `index.html`; collection grouping/artwork in `collections-engine.js`, `collection-views.js` and `collection-curation.json`; image presentation in `classic.css`. Keep the new catalog scope fields when retaining collection galleries. Regenerate static article shells after changing the common shell or cache version. The seven older presentation switches remain documented in `maintenance/README.md`.

Restoring the canonical spelling, if ever wanted, also requires restoring the saved canonical source before rebuilding exports. Reverting only the public export would be overwritten by the next source rebuild. Keep `design-preview/` unchanged when applying future main-site design choices.
