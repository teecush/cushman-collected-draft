# Famous Letters collection — 27 September 2026

## Scope

Built the temporary **Famous Letters** collection from the 15 user-provided PDFs in `incoming/Famous Letters`.

- 39 separate letters, notes, or telegrams
- 51 readable page images
- 14 correspondents / correspondent groups
- Document dates range from 1968 to 2001; several scans are undated

## Preservation and editorial treatment

The source PDFs were not edited. `source_manifest.json` records each source path, byte size, page count, and SHA-256 digest. The site uses JPEG reading derivatives under `site_export/content/media/correspondence/famous-letters/`.

The 8 November 2001 Stephen Sondheim scan contained two sideways pages in one image. Its web reading copy was rotated and split into two pages; the original PDF remains unchanged.

Apple Vision OCR was used only to help group pages and identify visible dates. OCR text is not published and must not be treated as a verified transcription. Undated documents remain labelled “Undated.”

The material is user-provided family archive content. No external source, account, or restricted archive was accessed.

## Site behavior

- Famous Letters is the second homepage collection card, immediately after Recent.
- It is listed under Browse → Collections in desktop and mobile navigation.
- The collection page groups complete letters by correspondent and date.
- Every white scan sits on a warm gray paper field with a fine edge and subtle shadow so the document remains distinct from the site background.
- Multi-page letters stay together; each page opens its full-size reading copy.

## Validation

- JSON structure and all 51 media paths validated.
- `git diff --check` passed.
- `node --check website/app.js` passed.
- `node --check website/home-collections.js` passed.
- `node maintenance/tests/catalog.test.mjs` passed.
- `python3 maintenance/tests/check_generated.py` passed for 3,211 static article pages.
- Local Chrome screenshots reviewed at 1440×1000 and 390×844.
