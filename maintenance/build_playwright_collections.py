"""Build the curated playwright doorway from the published review catalogue.

Only reviewed works with an attributable playwright credit are included. The
small override table corrects known cross-credits, adaptations and title
variants; it deliberately does not infer a play from a headline alone.
"""

from collections import defaultdict
from pathlib import Path
import json
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parent
SOURCE = PROJECT / "reports/playwright_mosaic_2026-09-27"
CATALOG = ROOT / "site_export/data/catalog.json"
DEST = ROOT / "website/playwright-collections.json"

PEOPLE = [
    "William Shakespeare", "George Bernard Shaw", "Anton Chekhov", "Henrik Ibsen", "Noël Coward",
    "Tom Stoppard", "Bertolt Brecht", "Alan Ayckbourn", "Samuel Beckett", "Harold Pinter",
    "Molière", "Tennessee Williams", "Judith Thompson", "Hannah Moscovitch", "Caryl Churchill",
]
BOXES = [
    (137, 215, 222, 607), (465, 106, 220, 652), (626, 132, 178, 603),
    (771, 105, 190, 670), (940, 120, 220, 654), (268, 228, 240, 607),
    (765, 273, 178, 565), (887, 277, 164, 562), (1124, 124, 205, 623),
    (1144, 265, 172, 571), (1017, 271, 180, 571), (1262, 267, 190, 568),
    (386, 284, 171, 555), (510, 267, 169, 573), (644, 278, 159, 560),
]
BACK_ROW = {1, 2, 3, 4, 8}
LABELS = [
    (x + width / 2, y - 28 if index in BACK_ROW else y + height * .25)
    for index, (x, y, width, height) in enumerate(BOXES)
]

EXCLUDE = {
    "George Bernard Shaw": {"Dear Liar"},
    "Anton Chekhov": {"Inertia [Phase Two]", "The Old Business"},
    "Noël Coward": {"13 Rue de L'Amour", "Cowardice", "Mr and Mrs", "A Quick Deco"},
    "Bertolt Brecht": {"For All Those Who Get Despondent"},
    "Samuel Beckett": {"Kaspar", "Theatre in Britain: A Personal View", "The Elocution of Benjamin Franklin", "You and Me Both"},
    "Molière": {"The Mitford Girls", "Let's Do It"},
    "Judith Thompson": {"Enoch Arden by Alfred Lord Jabba and his Catatonic Songstress", "Victory"},
    "Caryl Churchill": {"Bob Hope", "Dance of Gods"},
}
ALIASES = {
    "George Bernard Shaw": {"Too True to be Good": "Too True to Be Good", "Peace in Our Time": "Geneva", "My Fair Lady": "Pygmalion"},
    "Anton Chekhov": {"The Sea Gull": "The Seagull", "Chekhov Longs ... In the Ravine": "In the Ravine", "Dr. Chekhov: Ward 6": "Ward No. 6", "Chekhov's Heartache": "Peasants and Peasant Women", "Love Among The Russians": "The Bear"},
    "Henrik Ibsen": {"The Doll House": "A Doll's House", "Mabou Mines Dollhouse": "A Doll's House", "Enemy of the People Revisited": "An Enemy of the People"},
    "Noël Coward": {"Brief Encounters": "Tonight at 8:30", "Play, Orchestra, Play": "Tonight at 8:30", "Ways of the Heart": "Tonight at 8:30"},
    "Bertolt Brecht": {"Rifles": "Señora Carrar's Rifles"},
    "Harold Pinter": {"Pinter & Pirandello": "The Lover"},
    "Molière": {"Dom Juan": "Don Juan", "Don Juan the Lover": "Don Juan", "Let Wives Tak Tent": "The School for Wives", "The Hypochondriac": "The Imaginary Invalid", "Dying to be Sick / Le Malade Imaginaire": "The Imaginary Invalid"},
    "Tennessee Williams": {"Vieux Carre": "Vieux Carré", "Talk To Me Like the Rain and Let Me Listen / This Property is Condemned": "Talk to Me Like the Rain and Let Me Listen"},
    "Hannah Moscovitch": {"The Russian Plays": "The Russian Play", "Little One / Other People's Children / 4:48 Psychosis": "Little One"},
    "Caryl Churchill": {"Cloud 9": "Cloud Nine"},
}


def slug(value):
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")


def title_values(value):
    if isinstance(value, list):
        return [str(part).strip() for part in value if str(part).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def credited_titles(record, person):
    roles = title_values((record.get("roles") or {}).get("playwright"))
    groups = record.get("production_groups") or []
    if groups:
        for group in groups:
            names = title_values(group.get("playwright"))
            if person in names or (not names and roles == [person]):
                yield from title_values(group.get("production_title"))
    elif roles == [person]:
        yield from title_values(record.get("production_title"))


def main():
    # The approved expanded group has manually traced geometry and curated additions.
    # This legacy 15-person builder must never silently replace that data.
    if DEST.exists() and json.loads(DEST.read_text()).get("stageVersion", 1) >= 2:
        raise SystemExit("Expanded playwright data retained. Update its curated works and geometry directly; the legacy 15-person builder is retired.")
    records = json.loads(CATALOG.read_text())
    sources = {entry["person"]: entry for entry in json.loads((SOURCE / "portrait_sources.json").read_text())}
    people = []
    for index, (person, box, label) in enumerate(zip(PEOPLE, BOXES, LABELS), 1):
        works = defaultdict(set)
        for record in records:
            if record.get("article_category") not in ("Theatre Review", "Musical Review"):
                continue
            for title in credited_titles(record, person):
                if title in EXCLUDE.get(person, set()):
                    continue
                title = ALIASES.get(person, {}).get(title, title)
                # Compound article labels are not presented as if one authored play.
                if not title or len(title) > 90 or "[" in title:
                    continue
                works[title].add(record["slug"])
        source = sources[person]
        work_list = [{"title": title, "slugs": sorted(slugs)} for title, slugs in sorted(works.items(), key=lambda pair: slug(pair[0]))]
        surname = person.split()[-1]
        page_id = "playwright-" + slug(person)
        people.append({
            "person": person,
            "surname": surname,
            "id": page_id,
            "href": "#section:shakespeare" if person == "William Shakespeare" else "#collection:stoppard" if person == "Tom Stoppard" else "#collection:" + page_id,
            "portrait": "./assets/collections/playwrights/" + Path(source["local_file"]).name,
            "box": box,
            "label": label,
            "works": work_list,
            "reviewCount": len(set().union(*(set(item["slugs"]) for item in work_list))),
            "source": source["source_url"],
            "creator": source["creator"],
            "license": source["license"],
            "licenseUrl": source["license_url"],
        })
    DEST.write_text(json.dumps({"image": "./assets/collections/playwrights/group-ensemble.jpg", "people": people}, ensure_ascii=False, indent=2) + "\n")
    print("wrote", DEST, "with", len(people), "playwrights and", sum(len(p["works"]) for p in people), "work groups")


if __name__ == "__main__":
    main()
