// Homepage previews reuse credited archive artwork; every card opens its collection.
import {COLLECTIONS} from './collections-engine.js?v=168';
const examples = {
  books:['swing-time','all-or-nothing-at-all-a-life-of-frank-sinatra','broadway-anecdotes'],
  albums:['both-sides-now','art-of-romance','gypsy'],
  profiles:['alan-rickman','angela-lansbury','christopher-plummer'],
  sondheim:['company','follies','assassins'],
  musicals:['gypsy','into-the-woods','west-side-story'],
};
function element(tag,cls,text){const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;}
export function renderHomeCollections(root,curation,collections){
  if(!root)return;
  const grid=element('div','home-collection-grid');
  const specs=[...COLLECTIONS,{id:'publications',title:'Publications',href:'#index:publications'}];
  for(const spec of specs){
    const card=element('a','home-collection-card '+spec.id);card.href=spec.href||'#collection:'+spec.id;
    const visual=element('span','home-collection-visual');visual.setAttribute('aria-hidden','true');
    let assets=(examples[spec.id]||[]).map(key=>curation.artwork?.[spec.id+':'+key]).filter(Boolean);
    if(examples[spec.id]&&assets.length<3)assets=Object.entries(curation.artwork||{}).filter(([key])=>key.startsWith(spec.id+':')).slice(0,3).map(([,value])=>value);
    if(spec.id==='television'){
      const shows=[...(collections?.get('television')?.items||[])].sort((a,b)=>b.records.length-a.records.length||a.title.localeCompare(b.title)).slice(0,3);
      card.setAttribute('aria-label','TV Reviews — featuring '+shows.map(item=>item.title).join(', '));
      for(const item of shows){
        const asset=curation.artwork?.['television:'+item.id];
        const tv=element('span','collection-art television home-mini-tv');
        const screen=element('span','television-screen');screen.style.backgroundColor=asset?.screenColor||'#e1e9df';
        if(asset?.src){const image=element('img',asset.fit==='contain'?'television-logo':'');image.src=asset.src;image.alt='';image.loading='lazy';image.style.objectFit=asset.fit||'cover';image.style.objectPosition=asset.position||'50% 50%';screen.append(image);}
        else screen.append(element('span','art-title',item.title));
        tv.append(screen);visual.append(tv);
      }
    }
    if(spec.id==='publications')assets=['national-post','the-observer','the-globe-and-mail'].map(key=>curation.publications?.[key]).filter(Boolean);
    for(const asset of assets){const image=element('img','');image.src=asset.src;image.alt='';image.loading='lazy';image.decoding='async';visual.append(image);}
    if(spec.id==='shakespeare' && curation.homeArtwork?.shakespeare){const img=element('img','shakespeare-portrait');img.src=curation.homeArtwork.shakespeare.src;img.alt='';img.loading='lazy';visual.append(img);}
    if(spec.id==='early'){visual.append(element('span','early-year','1963–66'),element('span','early-paper','NEW CAMBRIDGE\nBROADSHEET'));}
    if(['stratford','shaw'].includes(spec.id)){
      // Abstract theatre architecture, not a photograph of a particular venue.
      visual.innerHTML=spec.id==='stratford'?'<svg viewBox="0 0 240 140"><path d="M25 110V66L75 25l45 41 45-41 50 41v44Z"/><path d="M20 115h200M48 105V77m36 28V63m36 42V80m36 25V63m36 42V77"/></svg>':'<svg viewBox="0 0 240 140"><path d="M28 113V56h184v57M18 48h204L120 18ZM44 62v44m38-44v44m38-44v44m38-44v44m38-44v44M20 120h200"/></svg>';
    }
    if(['stratford','shaw'].includes(spec.id)&&curation.homeArtwork?.[spec.id]){const img=element('img','festival-logo');img.src=curation.homeArtwork[spec.id].src;img.alt='';img.loading='lazy';visual.append(img);}
    const label=element('span','home-collection-label');label.append(element('strong','',spec.title));card.append(visual,label);grid.append(card);
  }
  root.replaceChildren(grid);
}
