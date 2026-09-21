import assert from 'node:assert/strict';
import {spotlightRecord,makeCollections,workKey} from '../../website/collections-engine.js';
import {parse,serialize} from '../../website/catalog-engine.js';
const records=[
 {slug:'same-day-a',date:'1974-09-21',date_precision:'day'},
 {slug:'same-day-b',date:'2001-09-21',date_precision:'day'},
 {slug:'yesterday',date:'1980-09-20'},
 {slug:'uncertain',date:'1980-09-21',date_precision:'month'},
 {slug:'unsigned',date:'1980-09-21',authorship_note:'Unconfirmed'},
 {slug:'today',date:'2026-09-21'},
];
assert.equal(spotlightRecord([]),null);
const date=new Date('2026-09-21T16:00:00Z');
assert(['same-day-a','same-day-b'].includes(spotlightRecord(records,date).slug));
assert.equal(spotlightRecord(records,date).slug,spotlightRecord([...records].reverse(),date).slug);
assert.equal(spotlightRecord(records,new Date('2026-09-21T03:59:59Z')).slug,'yesterday','Toronto date is still September 20 before local midnight');
assert.equal(spotlightRecord(records,new Date('2026-09-22T16:00:00Z')),null,'No false anniversary when there is no exact historical date');
assert.equal(spotlightRecord(records.slice(3),date),null,'Exclude uncertain, unsigned and current-year records');
const route={shelf:'musicals',item:'into-the-woods',from:'2000',to:'2009',origin:'#collection:musicals'};
assert.deepEqual(Object.fromEntries(Object.entries(parse(serialize(route))).filter(([,v])=>v)),route,'Collection scopes survive shared URL roundtrip');
const sample=[
 {slug:'a',year:1963,article_category:'Musical Review',production_title:'Into the Woods',people:[]},
 {slug:'b',year:1966,article_category:'Theatre Review',production_title:'Into the Woods',people:[]},
 {slug:'c',year:1967,article_category:'Profile',subject_people:'Subject',people:['Incidental']},
 {slug:'d',date:'1965-03-09',article_category:'Music Review',recording_title:'Not an album'},
 {slug:'e',article_category:'Music Review',recording_title:'An Album'},
 {slug:'f',article_category:'Profile',subject_people:'Wrong'},
];
const split=value=>String(value||'').split(';').map(x=>x.trim()).filter(Boolean);
const h={entityValues:(r,key)=>split(r[key==='productions'?'production_title':key==='companies'?'company':'book_title']),collectionNames:r=>r.collections||[],isExplicitShakespeareRecord:r=>false,splitEntityList:split};
const c=makeCollections(sample,h,{records:{d:{albumTitles:[]},f:{subjects:['Correct','Other']}}});
assert.deepEqual(c.get('early').records.map(r=>r.slug),['a','b','d'],'Early collection uses inclusive 1963–1966 plus date fallback');
assert.equal(c.get('sondheim').items[0].records.length,2);
assert.equal(c.get('musicals').items[0].records.length,2,'All writing about a known musical counts');
assert.deepEqual(c.get('albums').records.map(r=>r.slug),['e'],'Explicit exclusions keep concerts out of Albums');
assert(!c.get('profiles').items.some(item=>['Wrong','Incidental'].includes(item.title)));
assert(c.get('profiles').itemMap.get('correct').recordIds.has('f'));
assert.equal(workKey('Sweeney Todd: The Demon Barber of Fleet Street'),workKey('Sweeney Todd'));
console.log('PASS: daily spotlight, collection URL scope, inclusive early years, show grouping, album exclusions and profile subjects.');

assert.notEqual(workKey('The Passion'),workKey('Passion'),'Medieval mystery play and Sondheim musical are different works');
