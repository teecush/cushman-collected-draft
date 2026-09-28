import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCollections} from '../../website/collections-engine.js';

const data=JSON.parse(readFileSync(new URL('../../website/playwright-collections.json',import.meta.url)));
const records=JSON.parse(readFileSync(new URL('../../site_export/data/catalog.json',import.meta.url)));
const bySlug=new Map(records.map(record=>[record.slug,record]));
assert.equal(data.people.length,15);
assert.equal(new Set(data.people.map(person=>person.id)).size,15);
for(const person of data.people){
  assert(person.works.length>=7,`${person.person} has no substantive works index`);
  assert(person.reviewCount>=10,`${person.person} has no substantive review coverage`);
  assert(person.portrait && person.source && person.license,`${person.person} portrait credit incomplete`);
  for(const work of person.works){
    assert(work.slugs.length,`${person.person}: ${work.title} has no reviews`);
    for(const slug of work.slugs){
      const record=bySlug.get(slug);
      assert(record,`${person.person}: missing review ${slug}`);
      assert(['Theatre Review','Musical Review'].includes(record.article_category),`${person.person}: ${slug} is not a play review`);
    }
  }
}
const workTitles=person=>new Set(data.people.find(entry=>entry.person===person).works.map(work=>work.title));
assert(!workTitles('George Bernard Shaw').has('Dear Liar'));
assert(!workTitles('Noël Coward').has('Cowardice'));
assert(!workTitles('Samuel Beckett').has('Kaspar'));
assert(!workTitles('Judith Thompson').has('Victory'));
assert(workTitles('Henrik Ibsen').has("A Doll's House"));
assert(!workTitles('Henrik Ibsen').has('Mabou Mines Dollhouse'));

const split=value=>Array.isArray(value)?value:String(value||'').split(';').map(part=>part.trim()).filter(Boolean);
const helpers={
  entityValues:(record,type)=>split(type==='productions'?record.production_title:type==='companies'?record.company:record.book_title),
  collectionNames:record=>record.collections||[],
  isExplicitShakespeareRecord:()=>false,
  splitEntityList:split,
};
const collections=makeCollections(records,helpers,{playwrights:data});
assert.equal([...collections.values()].filter(collection=>collection.kind==='playwright').length,13);
for(const person of data.people.filter(entry=>!['William Shakespeare','Tom Stoppard'].includes(entry.person))){
  const collection=collections.get(person.id);
  assert(collection,`${person.person} collection missing`);
  assert.equal(collection.records.length,person.reviewCount,`${person.person} review count differs from source`);
  assert.equal(collection.items.length,person.works.length,`${person.person} work count differs from source`);
  assert(collection.items.every(item=>item.records.length&&collection.itemMap.get(item.id)?.recordIds.size),`${person.person} has an empty work link`);
}
console.log('PASS: 15 credited playwrights, 13 curated routes, reviewed-work links, known exclusions and title aliases.');
