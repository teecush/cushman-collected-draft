import assert from 'node:assert/strict';
import fs from 'node:fs';
import {indexOrder, indexEntries, indexSections, indexLetter} from '../../website/index-engine.js';

assert.equal(indexOrder('publications', null), 'coverage');
assert.equal(indexOrder('publications', 'alpha'), 'alpha', 'Explicit bookmarked order wins');
assert.equal(indexOrder('people', null), 'alpha');
assert.equal(indexOrder('works', null), 'alpha');
assert.equal(indexLetter('Émile'), 'E');
assert.equal(indexLetter('7:84 Company'), '0–9');

const entries = Array.from({length: 901}, (_, i) => ({label: `${i % 2 ? 'Alpha' : 'Zulu'} ${i}`, records: Array(i % 3 + 1).fill({})}));
const sortText = entry => entry.label;
const alphabetical = indexEntries(entries, '', 'alpha', sortText);
assert.equal(alphabetical.length, 901, 'Complete index, including entries beyond the old 100-item limit');
const sections = indexSections(alphabetical, sortText);
assert.deepEqual(sections.map(([letter]) => letter), ['A', 'Z']);
assert.equal(sections.flatMap(([, rows]) => rows).length, entries.length, 'Letter sections retain every matching entry');
assert.equal(new Set(sections.flatMap(([, rows]) => rows)).size, entries.length, 'No duplicate section entries');
assert.equal(indexEntries(entries, 'alpha', 'alpha', sortText).length, 450, 'Live text search still narrows entries');
const covered = indexEntries(entries, '', 'coverage', sortText);
assert.equal(covered.length, 901);
for (let i = 1; i < covered.length; i++) {
  assert(covered[i - 1].records.length >= covered[i].records.length);
  if (covered[i - 1].records.length === covered[i].records.length) assert(sortText(covered[i - 1]).localeCompare(sortText(covered[i])) <= 0);
}

const records = JSON.parse(fs.readFileSync(new URL('../../site_export/data/catalog.json', import.meta.url)));
assert.equal(records.filter(r => (r.people || []).includes('Chris Abraham')).length, 41);
assert.equal(records.filter(r => (r.people || []).includes('Chris Abrahams')).length, 0);
const corrected = records.find(r => r.slug === '2003-04-24-it-s-a-little-like-watching-a-train-crash-actually');
assert(corrected.people.includes('Chris Abraham'));
console.log('PASS: full index grouping, live name filtering, publication default/bookmarks, coverage order, and the 41-article Chris Abraham merge.');

const {publicationYear} = await import('../../website/catalog-engine.js');
assert.equal(publicationYear({date: '1974-09-01'}), '1974');
assert.equal(publicationYear({year: '1965', date: '1965-03-09'}), '1965');
assert.equal(publicationYear({year: 'unknown'}), '');
const recoveredYears = records.filter(r => !r.year && publicationYear(r));
assert.equal(recoveredYears.length, 14, 'Fourteen dated articles without a redundant year field remain browsable');
const undated = records.filter(r => !publicationYear(r));
assert.equal(undated.length, 1);
assert.equal(undated[0].slug, 'undated-you-re-the-top');
console.log('PASS: timeline/year filters recover 14 dated articles; only genuinely undated writing is separate.');
