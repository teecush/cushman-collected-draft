#!/usr/bin/env python3
"""Render the public family design checklist from its explicit change register."""
import html, json
from pathlib import Path
site = Path(__file__).resolve().parents[1]
folder = site / 'design-review'
data = json.loads((folder / 'changes.json').read_text())
esc = html.escape
options = ''.join(f'<option value="{esc(key)}" data-route="{esc(route)}">{esc(label)}</option>' for key,label,route in data['views'])
rows = []
for key,title,main,preview,view,note in data['design']:
    rows.append(f'''<tr id="{key}"><th scope="row"><span class="number">{key}</span>{esc(title)}<button type="button" data-view="{view}">Compare this area</button></th><td>{esc(main)}</td><td>{esc(preview)}</td><td><p>{esc(note)}</p><label for="choice-{key}">Your preference</label><select id="choice-{key}" data-save="{key}-choice"><option value="">Undecided</option><option>Main version</option><option>Preview version</option><option>A mix of both</option></select><label for="note-{key}">Notes</label><textarea id="note-{key}" rows="3" data-save="{key}-note"></textarea></td></tr>''')
kept = []
for key,title,detail,kind,view in data['kept']:
    compare = f'<button type="button" data-view="{view}">View this area</button>' if view else ''
    kept.append(f'<li id="{key}"><h3><span class="number">{key}</span>{esc(title)}</h3><span class="kind">{esc(kind)}</span><p>{esc(detail)}</p>{compare}</li>')
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Cushman Collected — design comparison</title><link rel="stylesheet" href="review.css?v=1"></head>
<body><a class="skip" href="#changes">Skip to change list</a><header><p class="eyebrow">Cushman Collected · {esc(data['date'])}</p><h1>Two designs. The same archive.</h1><p>The main site has its earlier presentation back, with bug fixes and useful navigation improvements retained. The alternate link preserves the September redesign for review.</p><nav class="top-links"><a href="../website/" target="_blank" rel="noopener">Open main site ↗</a><a href="../design-preview/" target="_blank" rel="noopener">Open design preview ↗</a><a href="#changes">14 design changes</a><a href="#kept">18 retained improvements</a></nav></header>
<main><section id="compare" aria-labelledby="compare-title"><h2 id="compare-title">Compare side by side</h2><div class="toolbar"><label for="page-choice">Page to compare</label><select id="page-choice">{options}</select><button id="show-pair" type="button">Load both versions</button></div><p class="hint">Each panel scrolls independently. Narrow panels show each site’s responsive layout. Use the links above or below for a full-width view in separate windows.</p><div class="pair" id="pair" hidden><section><h3>Main site · earlier appearance <a id="main-link" href="../website/" target="_blank" rel="noopener">Open ↗</a></h3><iframe title="Main site — earlier appearance with fixes" id="main-frame" src="about:blank"></iframe></section><section><h3>Alternate · September redesign <a id="preview-link" href="../design-preview/" target="_blank" rel="noopener">Open ↗</a></h3><iframe title="Alternate site — preserved September redesign" id="preview-frame" src="about:blank"></iframe></section></div><noscript><p>Open the two links above to compare the sites. The complete change list below works without JavaScript.</p></noscript></section>
<section id="changes"><h2>Design changes rolled back on the main site</h2><p>These are presentation and page-content choices you can reconsider individually. Functional changes that remain visible are listed separately below.</p><div class="notes-tools"><button id="export-notes" type="button">Download preferences and notes</button><button id="print-list" type="button">Print this list</button><span id="save-state" role="status">Preferences and notes stay in this browser; they are not shared automatically. Download them to share a copy.</span></div><div class="table-wrap"><table><caption>Earlier presentation on the main site compared with the preserved redesign</caption><thead><tr><th scope="col">Area</th><th scope="col">Main site — restored</th><th scope="col">Design preview — preserved</th><th scope="col">Review notes</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div></section>
<section id="kept"><h2>Improvements kept on the main site</h2><p>The rollback keeps the corrected archive and functioning tools. Some of these improvements have visible controls: the searchable indexes, filters, Explorer, timeline, map controls and reading tools still use their improved behaviour.</p><ol class="kept-list">{''.join(kept)}</ol></section>
<footer><p>Both versions currently contain 3,206 articles. The preview is a separate presentation copy, using the same public data and article sources as the main site. Future archive corrections can therefore appear in both.</p><p>This review page and the alternate design are public links, excluded from search indexing by a noindex instruction. The main homepage does not advertise them. Your selections here do not change either public site.</p></footer></main><script src="review.js?v=1"></script></body></html>'''
(folder / 'index.html').write_text(page)
report = ['# Cushman Collected — design comparison', '', 'Main: https://teecush.github.io/cushman-collected-draft/website/', 'Preview: https://teecush.github.io/cushman-collected-draft/design-preview/', 'Comparison and review checklist: https://teecush.github.io/cushman-collected-draft/design-review/', '', '## Design changes rolled back', '']
for key,title,main,preview,view,note in data['design']:
    report += [f'### {key} — {title}', '', f'**Main site:** {main}', '', f'**Preview:** {preview}', '', note, '']
report += ['## Improvements retained', '']
for key,title,detail,kind,view in data['kept']:
    report += [f'### {key} — {title}', '', f'{kind}. {detail}', '']
(folder / 'changes.md').write_text('\n'.join(report))
print('Rendered public comparison HTML and Markdown checklist.')
