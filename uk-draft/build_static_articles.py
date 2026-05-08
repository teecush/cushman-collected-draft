#!/usr/bin/env python3
import json
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "data" / "reviews.json"
ARTICLES_DIR = ROOT / "articles"
ASSET_VERSION = "5"


def compact_list(values, limit=14):
    values = [value for value in values or [] if value]
    if not values:
        return ""
    shown = ", ".join(escape(str(value)) for value in values[:limit])
    if len(values) > limit:
        shown += f" +{len(values) - limit}"
    return shown


def body_html(body):
    parts = []
    for paragraph in str(body or "").split("\n\n"):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        if paragraph == "* * *":
            parts.append("<hr>")
        else:
            parts.append(f"<p>{escape(paragraph).replace(chr(10), '<br>')}</p>")
    return "\n        ".join(parts)


def article_filename(number):
    return f"{int(number):03d}.html"


def article_page(record, total):
    number = int(record["number"])
    prev_link = f'{article_filename(number - 1)}' if number > 1 else ""
    next_link = f'{article_filename(number + 1)}' if number < total else ""
    progress = (number / total) * 100
    productions = compact_list(record.get("productions"), 18)
    venues = compact_list(record.get("venues"), 14)
    cities = compact_list(record.get("cities"), 14)
    people = compact_list(record.get("people"), 22)
    metadata_items = [
        ("Productions", productions),
        ("Venues", venues),
        ("Cities", cities),
        ("People", people),
        ("Image ID", escape(str(record.get("id", "")))),
    ]
    metadata_html = "\n          ".join(
        f"<li>{label}: {value}</li>" for label, value in metadata_items if value
    )
    prev_button = (
        f'<a class="nav-link-button" href="{prev_link}" aria-label="Previous article">← Previous</a>'
        if prev_link
        else '<span class="nav-link-button disabled">← Previous</span>'
    )
    next_button = (
        f'<a class="nav-link-button" href="{next_link}" aria-label="Next article">Next →</a>'
        if next_link
        else '<span class="nav-link-button disabled">Next →</span>'
    )
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{number}. {escape(record.get("title", ""))} · Cushman Collected UK Draft</title>
    <meta name="description" content="Draft text page for Robert Cushman's UK archive transcription.">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Rubik:wght@400;600;700;800&display=swap">
    <link rel="stylesheet" href="../styles.css?v={ASSET_VERSION}">
  </head>
  <body>
    <header class="site-header">
      <nav class="site-nav site-nav-left" aria-label="Draft navigation left">
        <a href="../index.html#list">List</a>
        <a href="001.html">Start</a>
      </nav>
      <a class="brand" href="../index.html" aria-label="Cushman Collected draft viewer">
        <span>Cushman Collected</span>
      </a>
      <nav class="site-nav site-nav-right" aria-label="Draft navigation right">
        <a href="../index.html#about">About Draft</a>
        <a href="../../website/">Main Draft</a>
      </nav>
    </header>
    <main class="article-page">
      <div class="reader-topbar">
        {prev_button}
        <div class="reader-progress" aria-label="Reading progress">
          <div class="reader-progress-text">Article {number} of {total}</div>
          <div class="progress-track"><div style="width: {progress:.2f}%"></div></div>
        </div>
        {next_button}
      </div>
      <article>
        <div class="article-kicker">No. {number} of {total}</div>
        <h1>{escape(record.get("title", ""))}</h1>
        <div class="article-meta">
          {escape(record.get("author") or "Robert Cushman")} · {escape(record.get("publication") or "")}
          {f" · {escape(record.get('section'))}" if record.get("section") else ""}
          {f" · {escape(record.get('date'))}" if record.get("date") else ""}
          {f"<br>{escape(record.get('category'))}" if record.get("category") else ""}
        </div>
        <div class="article-body">
        {body_html(record.get("body"))}
        </div>
        <ul class="meta-list">
          {metadata_html}
        </ul>
      </article>
      <div class="reader-bottom-nav">
        {prev_button}
        <a href="../index.html#list">Back to list</a>
        {next_button}
      </div>
    </main>
  </body>
</html>
"""


def main():
    records = json.loads(DATA_PATH.read_text(encoding="utf-8"))["records"]
    ARTICLES_DIR.mkdir(exist_ok=True)
    for old_page in ARTICLES_DIR.glob("*.html"):
        old_page.unlink()
    total = len(records)
    for record in records:
        (ARTICLES_DIR / article_filename(record["number"])).write_text(
            article_page(record, total), encoding="utf-8"
        )
    print(f"Wrote {total} article pages to {ARTICLES_DIR}")


if __name__ == "__main__":
    main()
