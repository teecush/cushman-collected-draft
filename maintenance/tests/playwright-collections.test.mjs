import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCollections} from '../../website/collections-engine.js';

const data=JSON.parse(readFileSync(new URL('../../website/playwright-collections.json',import.meta.url)));
const records=JSON.parse(readFileSync(new URL('../../site_export/data/catalog.json',import.meta.url)));
const bySlug=new Map(records.map(record=>[record.slug,record]));
assert.equal(data.people.length,25);
assert.equal(new Set(data.people.map(person=>person.id)).size,25);
for(const person of [...data.people,...data.legacyPeople]){
  if(data.people.includes(person)) assert(person.geometry?.contour && person.geometry?.hitPath && person.geometry?.headCenter,`${person.person} geometry missing`);
  const requestedSmallCollections={'Suzan-Lori Parks':[2,2],'Tomson Highway':[3,3],'Federico García Lorca':[5,6]};
  const expected=requestedSmallCollections[person.person];
  if(expected){assert.equal(person.works.length,expected[0]);assert.equal(person.reviewCount,expected[1]);}
  else{assert(person.works.length>=4,`${person.person} has no substantive works index`);assert(person.reviewCount>=8,`${person.person} has no substantive review coverage`);}
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
const workTitles=person=>new Set([...data.people,...data.legacyPeople].find(entry=>entry.person===person).works.map(work=>work.title));
assert(!workTitles('George Bernard Shaw').has('Dear Liar'));
assert(!workTitles('Noël Coward').has('Cowardice'));
assert(!workTitles('Samuel Beckett').has('Kaspar'));
assert(!workTitles('Judith Thompson').has('Victory'));
assert(!workTitles('Judith Thompson').has('Totem'));
assert(!data.people.some(p=>p.person==='Judith Thompson'));
assert.equal(data.people.find(p=>p.person==='Stephen Sondheim').href,'#collection:sondheim');
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
assert.equal([...collections.values()].filter(collection=>collection.kind==='playwright').length,23);
for(const person of [...data.people,...data.legacyPeople].filter(entry=>!['William Shakespeare','Tom Stoppard','Stephen Sondheim'].includes(entry.person))){
  const collection=collections.get(person.id);
  assert(collection,`${person.person} collection missing`);
  assert.equal(collection.records.length,person.reviewCount,`${person.person} review count differs from source`);
  assert.equal(collection.items.length,person.works.length,`${person.person} work count differs from source`);
  if(person.workOrder==='curated')assert.deepEqual(collection.items.map(item=>item.title),person.works.map(work=>work.title),'Curated order must survive the final shared collection sort');
  assert(collection.items.every(item=>item.records.length&&collection.itemMap.get(item.id)?.recordIds.size),`${person.person} has an empty work link`);
}
const lorca=collections.get('playwright-federico-garcia-lorca');
assert(!lorca.recordIds.has('1975-09-21-fey-lady-with-steel-nerves'),'Mia Farrow profile is not a Lorca play review');
assert(!lorca.recordIds.has('2000-07-31-master-and-student-masterfully-portrayed'),'Actor Lorca Simons must not become Federico García Lorca authorship');
assert.equal(lorca.items.find(item=>item.title==='Blood Wedding').records.length,2);
assert(lorca.items.some(item=>item.title==='Rocking the Cradle (after Yerma)'),'Lorca adaptation is identified as such');
console.log('PASS: 25 clickable playwrights, 23 curated routes, reviewed-work links, known exclusions and title aliases.');
