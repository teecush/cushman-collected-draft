import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {writingNames,henryCycleTitle,shakespeareTitles,isSondheimFrogs} from '../../website/play-authorship.js';
import {makeCollections} from '../../website/collections-engine.js';
const records=JSON.parse(readFileSync(new URL('../../site_export/data/catalog.json',import.meta.url)));
const find=slug=>records.find(record=>record.slug===slug);
const split=value=>Array.isArray(value)?value:String(value||'').split(';').map(value=>value.trim()).filter(Boolean);
const helpers={entityValues:(record,type)=>split(type==='productions'?record.production_title:type==='companies'?record.company:record.book_title).concat(type==='productions'?(record.production_groups||[]).flatMap(group=>split(group.production_title)):[]),collectionNames:r=>r.collections||[],isExplicitShakespeareRecord:()=>false,splitEntityList:split};
assert.equal(records.filter(r=>writingNames(r).includes('Stephen Sondheim')).length,53);
assert.equal(records.filter(r=>writingNames(r).includes('Andrew Lloyd Webber')).length,21);
assert.equal(writingNames({roles:{playwright:['Stephen Sondheim'],composer_lyricist:['Stephen Sondheim']}}).length,1);
for(const suffix of ['Part One','Part Two','Part 1','Part 2','Part I','Part II','Parts 1 and 2']) assert.equal(henryCycleTitle('Henry IV '+suffix),'Henry IV');
for(const suffix of ['Part One','Part Two','Part Three','Part 1','Part 2','Part 3','Part I','Part II','Part III','Parts 1, 2 and 3','Revenge in France','Revolt in England']) assert.equal(henryCycleTitle('Henry VI: '+suffix),'Henry VI');
for(const title of ['Henry VIII','Henry IV Part 3','Henry VI Part IV','The Six Wives of Henry VIII']) assert.equal(henryCycleTitle(title),'');
assert.deepEqual(shakespeareTitles(find('1975-06-29-crowning-of-prince-hal'),henryCycleTitle),['Henry IV']);
assert.deepEqual(shakespeareTitles(find('1974-02-24-triumph-for-harrison-rex'),henryCycleTitle),[]);
assert.deepEqual(shakespeareTitles(find('2002-06-06-three-parts-add-up-to-two-thrilling-plays'),henryCycleTitle),['Henry VI']);
const mixed={roles:{playwright:['William Shakespeare','Luigi Pirandello']},production_groups:[{production_title:'Henry IV',playwright:['Luigi Pirandello']},{production_title:'Henry VI Part 2',playwright:['William Shakespeare']}]};
assert.deepEqual(shakespeareTitles(mixed,henryCycleTitle),['Henry VI'],'Use each production credit rather than combining article authors');
const collections=makeCollections(records,helpers);
for(const slug of ['1983-11-27-hdg-t-c','1983-12-11-adultery-adulteration']) {
  assert.equal(isSondheimFrogs(find(slug)),false);
  assert(!collections.get('sondheim').recordIds.has(slug));
  assert(!collections.get('musicals').items.some(item=>item.title.includes('Frogs')&&item.records.some(record=>record.slug===slug)));
}
assert(collections.get('musicals').itemMap.get('frogs').records.some(record=>record.slug==='2005-05-14-cds-offer-a-musical-echo-of-broadway-peters-lane-do-star-turns-in-recent'));
console.log('PASS: combined writer coverage, every Henry IV/VI part spelling, per-production authorship, and distinct Frogs works.');
