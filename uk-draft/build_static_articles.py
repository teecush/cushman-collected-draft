#!/usr/bin/env python3
import json
import re
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent.parent
DATA_PATH = ROOT / "data" / "reviews.json"
ARTICLES_DIR = ROOT / "articles"
ASSET_VERSION = "19"

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
    if not text.startswith("---\n"):
        return {}
    body_marker = text.find("\nbody: |")
    closing = text.find("\n---", 4)
    if body_marker != -1 and (closing == -1 or body_marker < closing):
        frontmatter_text = text[4:body_marker]
    elif closing != -1:
        frontmatter_text = text[4:closing]
    else:
        return {}
    lines = frontmatter_text.splitlines()
    data = {}
    current_key = None
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        stripped = line.strip()
        if stripped.startswith("- ") and current_key:
            item = strip_quotes(stripped[2:].strip())
            if item and item not in ("[]", "''", '""'):
                if isinstance(data.get(current_key), list):
                    data[current_key].append(item)
            i += 1
            continue
        if not line.startswith(" ") and ":" in line:
            key, raw_value = line.split(":", 1)
            current_key = key.strip()
            value = raw_value.strip()
            if current_key == "production_groups" and value in ("", "[]"):
                groups, i = parse_production_groups(lines, i + 1)
                data[current_key] = groups
                continue
            if value in ("", "[]"):
                data[current_key] = []
            else:
                data[current_key] = strip_quotes(value)
            i += 1
            continue
        if line.startswith(" ") and current_key and isinstance(data.get(current_key), str):
            data[current_key] = f"{data[current_key]} {line.strip()}".strip()
            i += 1
            continue
        current_key = None
        i += 1
    return data


def parse_group_value(value):
    value = strip_quotes(value)
    if value in ("[]", "''", '""'):
        return []
    return value


def parse_production_groups(lines, start):
    groups = []
    current_group = None
    current_field = None
    i = start
    while i < len(lines):
        line = lines[i]
        if not line.startswith(" "):
            break
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if line.startswith("  - "):
            current_group = {}
            groups.append(current_group)
            current_field = None
            item = line[4:].strip()
            if ":" in item:
                key, raw_value = item.split(":", 1)
                value = raw_value.strip()
                current_group[key.strip()] = parse_group_value(value) if value else []
                current_field = key.strip()
            i += 1
            continue
        if current_group is not None and line.startswith("    ") and ":" in stripped:
            key, raw_value = stripped.split(":", 1)
            value = raw_value.strip()
            current_group[key.strip()] = parse_group_value(value) if value else []
            current_field = key.strip()
            i += 1
            continue
        if current_group is not None and current_field and line.startswith("      - "):
            item = parse_group_value(line.strip()[2:].strip())
            if item:
                if not isinstance(current_group.get(current_field), list):
                    current_group[current_field] = []
                current_group[current_field].append(item)
            i += 1
            continue
        i += 1
    return groups, i


def markdown_body(path):
    full_path = PROJECT_ROOT / path
    if not full_path.exists():
        return ""
    text = full_path.read_text(encoding="utf-8", errors="ignore")
    if text.startswith("---\n"):
        marker = text.find("\nbody: |")
        if marker != -1:
            body_lines = []
            for line in text[marker + len("\nbody: |") :].splitlines():
                if line.startswith("  "):
                    body_lines.append(line[2:])
                elif not line.strip():
                    body_lines.append("")
                else:
                    break
            return "\n".join(body_lines).strip()
        parts = text.split("---", 2)
        if len(parts) >= 3:
            return parts[2].strip()
    return text.strip()


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


def entity_slug(value):
    value = str(value or "").lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "unknown"


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
    href = f"../index.html#entity:{type_name}:{entity_slug(label)}"
    return (
        f'<a class="entity-chip entity-{type_name} entity-group-{group}{featured_class}" href="{href}">'
        f"{label_html}<strong>{escape(str(label))}</strong></a>"
    )


def entity_href(type_name, label):
    return f"../index.html#entity:{type_name}:{entity_slug(label)}"


def metadata_chips(record):
    md = parse_frontmatter(record.get("markdownPath", ""))
    production_groups = md.get("production_groups")
    if production_groups:
        return production_group_chips(production_groups) + shared_metadata_chips(md, production_groups)

    production_values = as_list(md.get("production_title")) or as_list(record.get("productions"))
    company_values = as_list(md.get("company"))
    venue_values = as_list(md.get("venue")) or as_list(record.get("venues"))
    city_values = as_list(md.get("city")) or as_list(record.get("cities"))
    context_chips = context_metadata_chips(company_values, venue_values, city_values)
    people_chips = people_metadata_chips(md)

    sections = []
    production_html = ""
    if len(production_values) == 1:
        chips = "".join(entity_chip("productions", value, featured=True, group="production") for value in production_values[:5])
        sections.append(("Production", chips, "production"))
    elif production_values:
        production_html = production_title_links(production_values)
    shared_labels = len(production_values) > 1

    if context_chips:
        sections.append(("Shared Context" if shared_labels else "Work", "".join(context_chips), "context"))

    if people_chips:
        sections.append(("Shared People" if shared_labels else "People", "".join(people_chips), "people"))

    if not sections:
        return production_html
    section_html = "\n        ".join(
        f"""<section class="article-entity-section article-entity-section-{group}">
          <nav class="article-entities" aria-label="{escape(label)} metadata chips">{chips}</nav>
        </section>"""
        for label, chips, group in sections
    )
    entity_html = f"""<div class="article-entity-groups">
        {section_html}
      </div>"""
    return production_html + entity_html


def grouped_values(production_groups, key):
    values = set()
    for group in production_groups:
        if not isinstance(group, dict):
            continue
        for value in as_list(group.get(key)):
            values.add(str(value))
    return values


def grouped_role_values(production_groups):
    values = set()
    for key in [field_key for _, _, field_key, _ in ROLE_FIELDS]:
        values.update(grouped_values(production_groups, key))
    return values


def shared_metadata_chips(md, production_groups):
    chip_rows = []
    company_values = [value for value in as_list(md.get("company")) if value not in grouped_values(production_groups, "company")]
    venue_values = [value for value in as_list(md.get("venue")) if value not in grouped_values(production_groups, "venue")]
    city_values = [value for value in as_list(md.get("city")) if value not in grouped_values(production_groups, "city")]
    context_chips = context_metadata_chips(company_values, venue_values, city_values)
    if context_chips:
        chip_rows.append(("Shared Context", "".join(context_chips), "context"))

    people_chips = []
    assigned_people = grouped_role_values(production_groups)
    for type_name, prefix, key, limit in ROLE_FIELDS:
        assigned = grouped_values(production_groups, key)
        for value in as_list(md.get(key))[:limit]:
            if value not in assigned and value not in assigned_people:
                people_chips.append(entity_chip(type_name, value, prefix, "people"))
    if people_chips:
        chip_rows.append(("Shared People", "".join(people_chips), "people"))

    if not chip_rows:
        return ""
    section_html = "\n        ".join(
        f"""<section class="article-entity-section article-entity-section-{group}">
          <nav class="article-entities" aria-label="{escape(label)} metadata chips">{chips}</nav>
        </section>"""
        for label, chips, group in chip_rows
    )
    return f"""<div class="article-entity-groups article-entity-groups-shared">
        <div class="article-shared-label">Shared context</div>
        {section_html}
      </div>"""


def context_metadata_chips(company_values, venue_values, city_values):
    chips = []
    for value in company_values[:4]:
        chips.append(entity_chip("companies", value, "Company"))
    for value in venue_values[:3]:
        chips.append(entity_chip("venues", value, "Venue"))
    for value in city_values[:3]:
        chips.append(entity_chip("cities", value, "City"))
    return chips


def people_metadata_chips(md):
    chips = []
    for type_name, prefix, key, limit in ROLE_FIELDS:
        for value in as_list(md.get(key))[:limit]:
            chips.append(entity_chip(type_name, value, prefix, "people"))
    return chips


def production_title_links(production_values):
    group_html = []
    for title in production_values:
        title_href = entity_href("productions", title)
        group_html.append(
            f"""<section class="article-production-group article-production-title-only">
            <h2><a class="production-title-link" href="{title_href}">{escape(str(title))}</a></h2>
          </section>"""
        )
    if not group_html:
        return ""
    return f"""<div class="article-production-groups article-production-groups-simple">
          <div class="article-production-group-list">
          {"".join(group_html)}
          </div>
        </div>"""


def production_group_chips(production_groups):
    ordered_groups = sorted(
        [group for group in production_groups if isinstance(group, dict)],
        key=lambda group: int(group.get("order") or 999),
    )
    group_html = []
    for group in ordered_groups:
        title = first_scalar(group, "production_title", "Untitled production")
        chips = []
        chips_html = group.get("_chips_html")
        if chips_html is None:
            for value in as_list(group.get("venue")):
                chips.append(entity_chip("venues", value, "Venue", "context"))
            for value in as_list(group.get("company")):
                chips.append(entity_chip("companies", value, "Company", "context"))
            for value in as_list(group.get("city")):
                chips.append(entity_chip("cities", value, "City", "context"))
            for type_name, prefix, key, limit in ROLE_FIELDS:
                for value in as_list(group.get(key))[:limit]:
                    chips.append(entity_chip(type_name, value, prefix, "people"))
            chips_html = "".join(chips)
        title_href = entity_href("productions", title)
        nav_html = (
            f'\n            <nav class="article-entities" aria-label="{escape(title)} production metadata chips">{chips_html}</nav>'
            if chips_html
            else ""
        )
        group_html.append(
            f"""<section class="article-production-group">
            <h2><a class="production-title-link" href="{title_href}">{escape(title)}</a></h2>{nav_html}
          </section>"""
        )
    if not group_html:
        return ""
    return f"""<div class="article-production-groups">
          <div class="article-production-group-list">
          {"".join(group_html)}
          </div>
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


def enrich_record(record):
    md = parse_frontmatter(record.get("markdownPath", ""))
    roles = {key: as_list(md.get(key)) for _, _, key, _ in ROLE_FIELDS}
    enriched = dict(record)
    body = markdown_body(record.get("markdownPath", ""))
    if body:
        enriched["body"] = body
    enriched["production_title"] = as_list(md.get("production_title")) or as_list(record.get("productions"))
    enriched["company"] = as_list(md.get("company"))
    enriched["venue"] = as_list(md.get("venue")) or as_list(record.get("venues"))
    enriched["city"] = as_list(md.get("city")) or as_list(record.get("cities"))
    enriched["roles"] = roles
    production_groups = md.get("production_groups", [])
    if production_groups:
        enriched["production_groups"] = production_groups
    else:
        enriched.pop("production_groups", None)
    category = first_scalar(md, "article_category") or first_scalar(md, "genre") or record.get("category", "")
    enriched["category"] = category
    enriched["people"] = as_list(md.get("people"))
    enriched["productions"] = enriched["production_title"]
    enriched["venues"] = enriched["venue"]
    enriched["cities"] = enriched["city"]
    return enriched


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
    raw = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    records = [enrich_record(record) for record in raw["records"]]
    raw["records"] = records
    DATA_PATH.write_text(json.dumps(raw, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
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
