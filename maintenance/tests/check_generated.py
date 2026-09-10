#!/usr/bin/env python3
import json, re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlparse,unquote
ROOT=Path(__file__).resolve().parents[2]
class Links(HTMLParser):
    def __init__(self):super().__init__();self.base=None;self.urls=[];self.h1=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='base':self.base=a.get('href')
        if tag=='h1':self.h1+=1
        for key in ('src','href'):
            if key in a:self.urls.append(a[key])
records=json.loads((ROOT/'site_export/data/catalog.json').read_text());bad=[]
for r in records:
    path=ROOT/'reviews'/r['slug']/'index.html';parser=Links();parser.feed(path.read_text())
    base=urljoin(path.as_uri(),parser.base or '')
    for url in parser.urls:
        if url.startswith('#'):continue
        result=urlparse(urljoin(base,url))
        if result.scheme!='file':continue
        target=Path(unquote(result.path))
        if not target.exists():bad.append((str(path.relative_to(ROOT)),url,str(target)))
    detail=json.loads((ROOT/'site_export/data'/r['detail_path'].split('?')[0]).read_text())
    assert detail['slug']==r['slug']
    assert 'editorial_notes' not in detail
sitemap=(ROOT/'sitemap.xml').read_text()
assert sitemap.count('<loc>')==len(records)+1
assert not bad,bad[:20]
print(f'PASS: {len(records)} static article pages, local asset links, detail identities and sitemap entries.')
