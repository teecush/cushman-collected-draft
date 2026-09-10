# Site maintenance and rollback

The September 2026 redesign preserves the static GitHub Pages architecture. The public site lives at https://teecush.github.io/cushman-collected-draft/website/.

## Undo one presentation choice

Run from this repository, then review the local site:

```sh
python3 maintenance/rollback.py --feature compactResults --value off
```

Independent switches in `website/features.js`:

| Switch | Off restores |
|---|---|
| `compactResults` | Large editorial result cards |
| `collapsedMetadata` | Always-expanded cast and production metadata |
| `simplifiedNavigation` | The earlier header and drawer menus; their routes still work |
| `redesignedHome` | The earlier home directory and featured layout |

Turn a choice on again with `--value on`. Reliability fixes remain active. Other changes can be reversed as a focused edit or a Git revert; the release notes identify the relevant files. No database migration is involved.

To publish a reviewed switch:

```sh
git add website/features.js
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
