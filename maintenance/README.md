# Site maintenance and rollback

## Current release: earlier main appearance, preserved design preview

Since 10 September 2026, the main site uses the earlier presentation with the repaired catalog and data. The September redesign is independently preserved at:

- Main: https://teecush.github.io/cushman-collected-draft/website/
- Alternate: https://teecush.github.io/cushman-collected-draft/design-preview/
- Public comparison and detailed checklist: https://teecush.github.io/cushman-collected-draft/design-review/

The comparison register is `design-review/changes.json`. Run `python3 maintenance/build_design_review.py` after editing it to refresh its public HTML and Markdown. The page provides independent scrolling previews, per-item preferences/notes saved only in the visitor's browser, download and print controls. It does not publish a visitor's choices.

The main presentation is controlled by seven switches, currently all off. The preview keeps its own code, styles, flags and article-return session key, sharing only the approved public data/media with the main site. Result links and sharing within the preview use preview hash URLs so a new tab stays in that design. Do not overwrite `design-preview/` during routine rebuilding or change its visual assets while review is in progress.

`redesign-before-visual-rollback-20260910` saves the entire previously published redesign at `bb16c321`. The prior full project backup and pre-redesign tags remain intact. Neither this release nor an individual presentation adjustment rewrites history or removes corrected canonical sources.

| Main-site switch | Review choices | On enables |
|---|---|---|
| `simplifiedNavigation` | D01–D02 | Simplified desktop and phone menus |
| `redesignedHome` | D03–D07 | Short introduction, new search/starting links, smaller reordered feature, hidden homepage map |
| `compactResults` | D08 | Compact, article-first results |
| `collapsedMetadata` | D09 | Collapsed article metadata |
| `modernBrowseLandings` | D10–D11 | Revised Current/Collections/Browse/Indexes landing destinations |
| `revisedEditorialCopy` | D12–D13 | Revised About/Contact/footer/donation copy |
| `modernCatalogPresentation` | D14 | Modern catalog heading and control styling |

Each switch controls a related group; a single D-number can also be applied as a focused edit to `website/index.html`, the relevant home/copy renderer in `app.js`, the route renderer in `catalog.js`, or `classic.css`. Use the D-numbers when collecting decisions. The user can select a mix without changing the separate preview.

The improved searchable indexes, filters, Explorer, year controls, map controls and explicit article tools remain visible on the main site. They were intentionally retained as usability improvements (K01–K10), rather than restoring their earlier widgets. `classic.css` fits these controls to the earlier visual language. The underlying reliability, accessibility, metadata and delivery improvements remain active (K11–K18).

The switch tool now refreshes cache URLs and rebuilds static article pages automatically. After switching, run the two checks below and commit `website/` plus regenerated `reviews/` together. Always push the main branch by itself to trigger Pages; push tags separately.

The September 2026 redesign preserves the static GitHub Pages architecture. The public site lives at https://teecush.github.io/cushman-collected-draft/website/.

## Undo one presentation choice

Run from this repository, then review the local site:

```sh
python3 maintenance/rollback.py --feature compactResults --value off
```

Core switches in `website/features.js` (the full current list and D-number mapping are above):

| Switch | Off restores |
|---|---|
| `compactResults` | Large editorial result cards |
| `collapsedMetadata` | Always-expanded cast and production metadata |
| `simplifiedNavigation` | The earlier header and drawer menus; their routes still work |
| `redesignedHome` | The earlier home directory and featured layout |

Turn a choice on again with `--value on`. Reliability fixes remain active. Other changes can be reversed as a focused edit or a Git revert; the release notes identify the relevant files. No database migration is involved.

To publish a reviewed switch:

```sh
git add website reviews
git commit -m "Adjust site presentation after review"
git push origin HEAD:main
```

## Restore the whole earlier site

First save any current local edits. This creates an ordinary restore commit and preserves all history:

```sh
python3 maintenance/rollback.py --restore pre-redesign
git diff --cached --stat
git commit -m "Restore site before September catalog redesign"
git push origin HEAD:main
```

`pre-redesign` restores `site-audit-baseline-20260909`: the saved local work plus the latest public changes before redesign. `previous-public` restores `public-before-site-audit-20260909`: the exact previously published commit. The full project and canonical-source backup is outside this public repository; see the local September redesign report before rebuilding after a full rollback. Do not run a newer source rebuild over a restored old site unless you intend to reapply the newer content changes.

## Rebuild and check

The root project’s `scripts/merge_uk_draft_into_main_site.py` remains the canonical rebuild. It now calls `maintenance/build_site.py` after producing the approved public export.

To regenerate only website derivatives from that export:

```sh
python3 maintenance/build_site.py
node maintenance/tests/catalog.test.mjs
python3 maintenance/tests/check_generated.py
```

The builder generates compact catalog data, article detail JSON, optional full-text search data, thumbnails, article HTML, and the sitemap. It uses native `sips` on macOS or Pillow elsewhere. It neither downloads sources nor modifies preservation images. Unknown article categories fail the build.

Do not manually edit the generated `reviews/` or `site_export/data/catalog.json`. The HTML article URLs and old `#review:` links both remain supported. The legacy UK draft and CushBot are retained with noindex notices and links to the main catalog.
