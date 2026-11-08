import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {applyBodyPresentation} from '../../website/article-formatting.js';
const root=new URL('../../',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const catalog=read('site_export/data/catalog.json');
const original=read('site_export/data/public_reviews.json');
const app=fs.readFileSync(new URL('website/app.js',root),'utf8');
const stripFrontmatter=s=>s.replace(/^---[\s\S]*?\n---\s*/,'').trim();
const publicBody=vm.runInNewContext(app.slice(app.indexOf('function publicArticleBody('),app.indexOf('function safeDecodeHashValue('))+';publicArticleBody',{stripFrontmatter,applyBodyPresentation});
const get=slug=>read('site_export/data/articles/'+slug+'.json');
const body=r=>publicBody(fs.readFileSync(new URL('site_export/content/reviews/'+r.source_file,root),'utf8'),r);
const chorus=get('1996-10-31-theatre-review-a-chorus-line');
assert.deepEqual(chorus.display_heading,{
 headline:'Chorus Line gets another kick at the cancan',
 deck:'The Broadway musical still has an impact, 21 years after its first opening night.'
});
assert.equal(chorus.title,'Theatre Review: A Chorus Line','Original archival label stays available');
const text=body(chorus);
assert(text.startsWith('Rating: ***\n\nTHE only song in A Chorus Line'));
assert(!text.includes('Chorus Line gets another kick'));
assert(!text.includes('The Broadway musical still has an impact,'));
assert(!text.includes('Lyrics by Edward Kleban'));
assert(!text.includes('Music by Marvin Hamlisch'));
assert(text.includes("At the O'Keefe Centre until Nov. 3."),'Historical run notice survives');
const html=fs.readFileSync(new URL('reviews/'+chorus.slug+'/index.html',root),'utf8');
assert(html.includes('<h1>'+chorus.display_heading.headline+'</h1>'));
assert(html.includes('<p class="article-deck">'+chorus.display_heading.deck+'</p>'));
assert(html.includes('<title>'+chorus.display_heading.headline+' | Cushman Collected</title>'));
const high=get('1997-03-01-theatre-review-high-life');
assert(!high.display_heading.deck.includes('\n'));
assert(high.display_heading.deck.endsWith('watch them wriggle.'));
const revival=get('2008-11-01-they-don-t-think-they-can-dance-they-know-it-a-chorus-line-still-deserves');
assert.equal(revival.display_heading.deck,'A Chorus Line Still Deserves Our Attention','Folded source title is restored in full');
const warren=get('1997-03-25-theatre-review-mrs-warren-s-profession');
assert(body(warren).includes('BERNARD Shaw called his first batch'));
assert(!body(warren).includes('B\n\nERNARD'));
const genuine=get('1985-12-01-a-chorus-line');
assert.equal(genuine.display_heading,undefined,'A valid original work-title headline is not invented over');
assert.equal(genuine.title,'A Chorus Line');
assert.equal(catalog.length,original.length,'Article count is unchanged');
const searchableSource=app.slice(app.indexOf('function searchableParts('),app.indexOf('function searchable(record)'));
const searchableParts=vm.runInNewContext(searchableSource+';searchableParts',{
 typeLabel:()=>'',collectionNames:()=>[],pushSearchValue:(parts,value)=>{if(value)parts.push(String(value));}
});
assert(searchableParts(chorus).includes(chorus.display_heading.headline));
assert(searchableParts(chorus).includes(chorus.display_heading.deck));
assert(app.includes('["Title", record.display_heading ? [record.display_heading.headline, record.display_heading.deck] : record.title]'),'Matched title uses the corrected public heading');
console.log('PASS: source-backed headline/deck recovery, deduplicated openings, rating/run preservation, intact original titles, joined drop caps and searchable recovered headings.');
const cardSource=app.slice(app.indexOf('function cardDisplay('),app.indexOf('const ARTICLE_CONTEXT_KEY'));
const cardDisplay=vm.runInNewContext(cardSource+';cardDisplay',{
 headlineParts:(title,r)=>r.display_heading||{headline:title,deck:''},
 cardPrimaryValues:r=>[r.production_title].filter(Boolean),
 cardSecondaryParts:r=>[r.city].filter(Boolean),
 compactParts:values=>values.filter(Boolean),
 normalizeSearchText:s=>s.toLowerCase().replace(/[^a-z0-9]/g,''),
});
assert.equal(cardDisplay(genuine,{titleFirst:true}).secondary.length,0,'Work-title headline is not repeated in the production line');
assert(cardDisplay(chorus,{titleFirst:true}).secondary.includes('A Chorus Line'),'A distinct work title remains visible under the restored headline');
