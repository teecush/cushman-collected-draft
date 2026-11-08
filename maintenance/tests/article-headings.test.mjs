import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../../',import.meta.url);
const read=path=>JSON.parse(fs.readFileSync(new URL(path,root),'utf8'));
const raw=read('site_export/data/public_reviews.json');
const catalog=read('site_export/data/catalog.json');
const overrides=read('site_export/data/article_heading_overrides.json');
const app=fs.readFileSync(new URL('website/app.js',root),'utf8');
const fn=app.slice(app.indexOf('function headlineParts('),app.indexOf('function renderResults()',app.indexOf('function headlineParts(')));
const parts=vm.runInNewContext(fn+';headlineParts');
for(const record of catalog){
 const original=raw.find(r=>r.slug===record.slug);
 assert.equal(record.title,original.title,'Original source title is preserved');
 const override=overrides[record.slug];
 if(override){
  assert.equal(override.source_title,original.title);
  assert.deepEqual(JSON.parse(JSON.stringify(parts(record.title,record))),{headline:override.headline,deck:override.deck});
  const detail=read('site_export/data/'+record.detail_path.split('?')[0]);
  assert.deepEqual(detail.display_heading,record.display_heading,'Direct and catalog article routes agree');
 }else assert.equal(record.display_heading,undefined);
}
assert(parts('Close Encounters With Genius: The Young Steven Spielberg',catalog.find(r=>r.slug==='1997-07-05-close-encounters-with-genius-the-young-steven-spielberg')).deck.endsWith('extraordinary sophistication and invention.'));
assert.equal(parts('Richard III: Reign of Terror').deck,'Reign of Terror','Legitimate play subtitles survive');
assert.equal(parts('Theatre Review: A Midsummer Night\'s Dream').deck,'A Midsummer Night\'s Dream','Work title survives');
assert.equal(parts('Music: The Man Who Got Rhythm').deck,'The Man Who Got Rhythm','Printed headline survives');
assert.equal(parts('Mamma Mia! Here We Go Again: Insipid Songs Not Enough To Hang A Musical On').deck,'Insipid Songs Not Enough To Hang A Musical On','Complete subtitle survives');
console.log(`PASS: ${Object.keys(overrides).length} reviewed headings, all ${catalog.length} original titles retained, direct/catalog agreement and legitimate subtitles retained.`);
