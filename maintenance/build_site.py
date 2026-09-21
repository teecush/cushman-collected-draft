#!/usr/bin/env python3
"""Build public catalog derivatives and readable HTML from the approved public export.
Run after scripts/merge_uk_draft_into_main_site.py, or standalone from any directory.
Never reads canonical/private material or downloads anything.
"""
import calendar, hashlib, html, json, re, shutil, subprocess
from pathlib import Path
from urllib.parse import quote
SITE = Path(__file__).resolve().parents[1]
EXPORT = SITE / 'site_export'
DATA = EXPORT / 'data'
BASE = 'https://teecush.github.io/cushman-collected-draft/'
def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
def clean(value):
    if isinstance(value,dict):return {k:clean(v) for k,v in value.items() if v not in ('',[],{},None) and k not in ('source_photo','canonical_file','editorial_notes','source_path')}
    if isinstance(value,list):return [clean(v) for v in value]
    return value
def body_text(markdown, record):
    text=re.sub(r'^---[\s\S]*?\n---\s*','',markdown).strip()
    blocks=re.split(r'\n{2,}',text)
    has_image=bool(record.get('media')) or any(re.match(r'^!\[.*?\]\(.*?\)$',b) for b in blocks)
    return '\n\n'.join(b.strip() for b in blocks if b.strip() and not re.match(r'^(word count\s*:|credit\s*:|illustrations?\s*:|illustrations?$|e-?mail\s*:)',b,re.I) and not re.match(r'^(?:contact\s*:)?\s*[\w.+-]+@(?:sympatico|rogers|bell|gmail|hotmail|yahoo)\.[a-z]{2,}\s*$',b,re.I) and (has_image or not re.match(r'^(caption|photo caption)\s*:',b,re.I)))
def inline(text):
    escaped=html.escape(text)
    escaped=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',escaped)
    escaped=re.sub(r'\*([^*]+)\*',r'<em>\1</em>',escaped)
    return re.sub(r'_([^_]+)_',r'<em>\1</em>',escaped)
def rendered_body(body):
    result=[]
    for block in re.split(r'\n{2,}',body):
        image=re.fullmatch(r'!\[(.*?)\]\((.*?)\)',block.strip())
        if image:
            path=image[2]
            if path.startswith('../media/'):
                url='../site_export/content/'+path.removeprefix('../')
                result.append(f'<figure><img loading="lazy" src="{html.escape(url,quote=True)}" alt="{html.escape(image[1],quote=True)}"></figure>')
            continue
        cls=' class="article-editorial-note"' if re.match(r'^\*?(Editorial note:|\[)',block) else ''
        result.append(f'<p{cls}>{inline(re.sub(chr(10), " ", block))}</p>')
    return '\n'.join(result)
def display_date(r):
    date=r.get('date','')
    if not date:return 'Undated'
    year,month,day=date.split('-')
    if r.get('date_precision')=='year':return year
    if r.get('date_precision')=='month':return f'{calendar.month_name[int(month)]} {year}'
    return f'{calendar.month_abbr[int(month)]} {int(day)}, {year}'
def thumbnail(media):
    path=media.get('local_path','')
    if not path:return
    source=EXPORT/'content'/path
    if not source.is_file():raise ValueError(f'Missing media: {path}')
    if source.suffix.lower() not in ('.jpg','.jpeg','.png','.webp'):return
    digest=hashlib.sha256(source.read_bytes()).hexdigest()[:20]
    dest=EXPORT/'content/media/thumbnails'/f'{digest}.jpg'
    if not dest.exists():
        dest.parent.mkdir(parents=True,exist_ok=True)
        if shutil.which('sips'):
            subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','65','-Z','360',str(source),'--out',str(dest)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
        else:
            from PIL import Image
            image=Image.open(source).convert('RGB');image.thumbnail((360,360));image.save(dest,quality=65,optimize=True)
    media['thumbnail_path']=str(dest.relative_to(EXPORT/'content'))
def main():
    records=json.loads((DATA/'public_reviews.json').read_text())
    # Every category must have an explicit frontend mapping, preventing collapsed fallback counts.
    app=(SITE/'website/app.js').read_text();types=app[app.index('const TYPE_GROUPS = ['):app.index('const TYPE_BY_CATEGORY')]
    known=set(re.findall(r'"([^"]+)"',types))
    unknown=sorted({r['article_category'] for r in records}-known)
    if unknown:raise ValueError(f'Unmapped categories: {unknown}')
    catalog=[];texts={};urls=[BASE+'website/'];shell=(SITE/'website/index.html').read_text()
    shell=shell.replace('<head>','<head>\n    <base href="../../website/">',1)
    for raw in records:
        r=clean(raw);source=EXPORT/'content/reviews'/r['source_file']
        if not source.is_file():raise ValueError(f'Missing article: {source}')
        r['content_version']=hashlib.sha256(source.read_bytes()).hexdigest()[:12]
        body=body_text(source.read_text(),r)
        for media in r.get('media',[]):thumbnail(media)
        for item in r.get('correspondence',[]):
            for media in item.get('media',[]):thumbnail(media)
        write_json(DATA/'articles'/f'{r["slug"]}.json',r)
        light={k:v for k,v in r.items() if k not in ('browse_entities','display_schema','coordinate_points','media')}
        # Coordinates for maps are loaded on demand; catalog roles/production relationships remain complete.
        if r.get('media'):light['media']=r['media'][:1]
        detail_hash=hashlib.sha256(json.dumps(r,sort_keys=True).encode()).hexdigest()[:12]
        light['detail_path']=f'articles/{r["slug"]}.json?v={detail_hash}';catalog.append(light)
        texts[r['slug']]=re.sub(r'!\[.*?\]\(.*?\)','',body).replace('*','')
        url=BASE+'reviews/'+quote(r['slug'])+'/'
        author="Unsigned (authorship unconfirmed)" if r.get("authorship_note") else r.get("author") or "Robert Cushman"
        description=f'{r["title"]}, {author}. {r.get("publication") or r.get("source_publication","")}, {display_date(r)}.'
        title=html.escape(r['title']);page=shell.replace('<html lang="en">',f'<html lang="en" data-article-slug="{html.escape(r["slug"],quote=True)}">',1).replace('<body>','<body class="article-open">',1)
        page=re.sub(r'<title>.*?</title>',lambda m:f'<title>{title} | Cushman Collected</title>',page,count=1)
        page=re.sub(r'<meta\s+name="description"\s+content="[^"]*"\s*>',lambda m:f'<meta name="description" content="{html.escape(description,quote=True)}">',page,count=1)
        page=re.sub(r'<meta property="og:title" content="[^"]*">',lambda m:f'<meta property="og:title" content="{html.escape(r["title"],quote=True)}">',page,count=1)
        page=re.sub(r'<meta property="og:description" content="[^"]*">',lambda m:f'<meta property="og:description" content="{html.escape(description,quote=True)}">',page,count=1)
        page=page.replace('<meta property="og:type" content="website">',f'<meta property="og:type" content="article"><meta property="og:url" content="{url}"><link rel="canonical" href="{url}">')
        article=f'<article id="article"><time>{display_date(r)}</time><h1>{title}</h1><p class="article-meta">{html.escape(author)} · {html.escape(r.get("publication") or r.get("source_publication",""))}</p>'
        if r.get('authorship_note'):article+=f'<p class="public-date-note">{html.escape(r["authorship_note"])}</p>'
        if r.get('date_note'):article+=f'<p class="public-date-note">{html.escape(r["date_note"])}</p>'
        if any(re.search(r'incomplete|missing_(page|pages|portion|continuation|intervening)',str(r.get(k,'')),re.I) for k in ('editorial_status','editorial_issue_type','source_completeness')):article+='<aside class="article-incomplete-notice">Incomplete surviving source. Bracketed notes mark known gaps.</aside>'
        article+=f'<div class="article-body" id="article-text">{rendered_body(body)}</div></article>'
        page=page.replace('<section class="article-view" id="articleView" hidden>','<section class="article-view" id="articleView">').replace('<article id="article"></article>',article)
        target=SITE/'reviews'/r['slug']/'index.html';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(page)
        urls.append(url)
    write_json(DATA/'catalog.json',catalog);write_json(DATA/'search_text.json',texts)
    # Separate map coordinates preserve the curated record-level points without paying for them on every visit.
    write_json(DATA/'map_details.json',{r['slug']:r.get('coordinate_points',[]) for r in records if r.get('coordinate_points')})
    sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{html.escape(url)}</loc></url>\n' for url in urls)+'</urlset>\n'
    (SITE/'sitemap.xml').write_text(sitemap)
    for folder in ('uk-draft','cushbot'):
        for page in (SITE/folder).rglob('*.html'):
            content=page.read_text()
            if 'name="robots"' not in content:content=content.replace('<head>','<head>\n<meta name="robots" content="noindex,follow">',1)
            if page.name=='index.html' and 'legacy-notice' not in content:
                label='Legacy draft reader. The current archive is available in the main catalog.' if folder=='uk-draft' else 'Experimental automated finding aid. Its responses are not Robert Cushman’s writing. Read the cited articles in the main catalog.'
                content=content.replace('<body>',f'<body><p class="legacy-notice" style="padding:16px;background:#f4f0e8;color:#111">{label} <a href="../website/#archive">Open the catalog</a></p>',1)
            page.write_text(content)
    report={'articles':len(records),'static_pages':len(urls)-1,'catalog_bytes':(DATA/'catalog.json').stat().st_size,'previous_payload_bytes':(DATA/'public_reviews.json').stat().st_size,'optional_text_bytes':(DATA/'search_text.json').stat().st_size,'thumbnails':len(list((EXPORT/'content/media/thumbnails').glob('*'))),'categories_checked':len({r['article_category'] for r in records})}
    write_json(SITE/'maintenance/build-report.json',report);print(json.dumps(report,indent=2))
if __name__=='__main__':main()
