#!/usr/bin/env python3
import json
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent.parent
DATA_PATH = ROOT / "data" / "reviews.json"
ARTICLES_DIR = ROOT / "articles"
ASSET_VERSION = "6"

ROLE_FIELDS = [
    ("directors", "Director", "director", 4),
    ("playwrights", "Playwright", "playwright", 4),
    ("actors", "Actor", "actors", 10),
    ("composers-lyricists", "Music", "composer_lyricist", 5),
    ("musical-directors", "Music Director", "musical_director", 3),
    ("choreographers", "Choreographer", "choreographer", 3),
    ("set-designers", "Set", "set_designer", 3),
    ("costume-designers", "Costume", "costume_designer", 3),
    ("lighting-designers", "Lighting", "lighting_designer", 3),
    ("sound-designers", "Sound", "sound_designer", 3),
    ("producers", "Producer", "producer", 3),
    ("dramaturgs", "Dramaturg", "dramaturg", 3),
    ("performers", "Performer", "performers", 5),
    ("musicians", "Musician", "musicians", 5),
    ("artists", "Artist", "artists", 5),
]


def strip_quotes(value):
    value = str(value or "").strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    return value


def parse_frontmatter(path):
    full_path = PROJECT_ROOT / path
    if not full_path.exists():
        return {}
    text = full_path.read_text(encoding="utf-8", errors="ignore")
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    lines = parts[1].splitlines()
    data = {}
    current_key = None
    for line in lines:
        if not line.strip():
            continue
        if line.startswith("- ") and current_key:
            item = strip_quotes(line[2:].strip())
            if item and item not in ("[]", "''", '""'):
                if not isinstance(data.get(current_key), list):
                    data[current_key] = []
                data[current_key].append(item)
            continue
        if not line.startswith(" ") and ":" in line:
            key, raw_value = line.split(":", 1)
            current_key = key.strip()
            value = raw_value.strip()
            if value in ("", "[]"):
                data[current_key] = []
            else:
                data[current_key] = strip_quotes(value)
            continue
        current_key = None
    return data


def as_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        values = value
    elif isinstance(value, str):
        if not value.strip() or value.strip() in ("[]", "''", '""'):
            return []
        values = [part.strip() for part in value.split(";") if part.strip()]
    else:
        values = [str(value)]
    cleaned = []
    seen = set()
    for item in values:
        item = strip_quotes(item).strip()
        if not item or item in ("[]", "''", '""'):
            continue
        key = item.lower()
        if key not in seen:
            cleaned.append(item)
            seen.add(key)
    return cleaned


def first_scalar(data, key, fallback=""):
    values = as_list(data.get(key))
    return values[0] if values else fallback


def compact_list(values, limit=14):
    values = [value for value in values or [] if value]
    if not values:
        return ""
    shown = ", ".join(escape(str(value)) for value in values[:limit])
    if len(values) > limit:
        shown += f" +{len(values) - limit}"
    return shown


def entity_chip(type_name, label, prefix="", group="context", featured=False):
    featured_class = " entity-chip-featured" if featured else ""
    label_html = f"<span>{escape(prefix)}</span>" if prefix else ""
    return (
        f'<span class="entity-chip entity-{type_name} entity-group-{group}{featured_class}">'
        f"{label_html}<strong>{escape(str(label))}</strong></span>"
    )


def metadata_chips(record):
    md = parse_frontmatter(record.get("markdownPath", ""))
    production_values = as_list(md.get("production_title")) or as_list(record.get("productions"))
    company_values = as_list(md.get("company"))
    venue_values = as_list(md.get("venue")) or as_list(record.get("venues"))
    city_values = as_list(md.get("city")) or as_list(record.get("cities"))
    sections = []
    if production_values:
        chips = "".join(entity_chip("productions", value, featured=True, group="production") for value in production_values[:5])
        sections.append(("Production", chips, "production"))

    context_chips = []
    for value in company_values[:4]:
        context_chips.append(entity_chip("companies", value, "Company"))
    for value in venue_values[:3]:
        context_chips.append(entity_chip("venues", value, "Venue"))
    for value in city_values[:3]:
        context_chips.append(entity_chip("cities", value, "City"))
    if context_chips:
        sections.append(("Work", "".join(context_chips), "context"))

    people_chips = []
    for type_name, prefix, key, limit in ROLE_FIELDS:
        for value in as_list(md.get(key))[:limit]:
            people_chips.append(entity_chip(type_name, value, prefix, "people"))
    if people_chips:
        sections.append(("People", "".join(people_chips), "people"))

    if not sections:
        return ""
    section_html = "\n        ".join(
        f"""<section class="article-entity-section article-entity-section-{group}">
          <span class="article-entity-label">{escape(label)}</span>
          <nav class="article-entities" aria-label="{escape(label)} metadata chips">{chips}</nav>
        </section>"""
        for label, chips, group in sections
    )
    return f"""<div class="article-entity-groups">
        {section_html}
      </div>"""


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
    md = parse_frontmatter(record.get("markdownPath", ""))
    productions = compact_list(as_list(md.get("production_title")) or record.get("productions"), 18)
    companies = compact_list(as_list(md.get("company")), 14)
    venues = compact_list(as_list(md.get("venue")) or record.get("venues"), 14)
    cities = compact_list(as_list(md.get("city")) or record.get("cities"), 14)
    metadata_items = [
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
        {metadata_chips(record)}
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
