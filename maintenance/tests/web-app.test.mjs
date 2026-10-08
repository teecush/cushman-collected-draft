import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(root+'manifest.webmanifest','utf8'));
assert.equal(manifest.name,'Cushman Collected');
assert.equal(manifest.short_name,'CC');
assert.equal(manifest.display,'standalone');
for(const base of ['https://teecush.github.io/cushman-collected-draft/','https://cushmancollected.com/']){
 const url=new URL('manifest.webmanifest',base);
 assert.equal(new URL(manifest.start_url,url).href,new URL('website/',base).href);
 assert.equal(new URL(manifest.scope,url).href,base);
 assert.equal(new URL(manifest.id,url).href,new URL('website/',base).href);
}
for(const size of [180,192,512]){
 const bytes=fs.readFileSync(root+`icons/cc-${size}.png`);
 assert.equal(bytes.subarray(1,4).toString(),'PNG');
 assert.equal(bytes.readUInt32BE(16),size);
 assert.equal(bytes.readUInt32BE(20),size);
}
const mask=fs.readFileSync(root+'icons/cc-maskable-512.png');
assert.equal(mask.readUInt32BE(16),512); assert.equal(mask.readUInt32BE(20),512);
assert(manifest.icons.some(icon=>icon.sizes==='512x512'&&icon.purpose.includes('maskable')));
const catalog=JSON.parse(fs.readFileSync(root+'site_export/data/catalog.json','utf8'));
for(const relative of ['website/index.html',...catalog.map(row=>'reviews/'+row.slug+'/index.html')]){
 const html=fs.readFileSync(root+relative,'utf8');
 assert(html.includes('<link rel="manifest" href="../manifest.webmanifest?v=3">'),relative);
 assert(html.includes('<link rel="apple-touch-icon" sizes="180x180" href="../icons/cc-180.png?v=3">'),relative);
 assert(html.includes('<meta name="apple-mobile-web-app-capable" content="yes">'),relative);
 assert(html.includes('src="./web-app.js?v=2"'),relative);
}
console.log(`PASS: portable project/domain scope, PNG dimensions, maskable icon and web-app metadata on the homepage and ${catalog.length} article pages.`);
