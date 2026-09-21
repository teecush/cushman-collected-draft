// Homepage previews reuse credited archive artwork; every card opens its collection.
import {COLLECTIONS} from './collections-engine.js?v=157';
const examples = {
  books:['alan-jay-lerner-a-biography','all-his-jazz-the-life-and-death-of-bob-fosse','all-my-best-friends'],
  albums:['both-sides-now','art-of-romance','gypsy'],
  profiles:['alan-rickman','angela-lansbury','christopher-plummer'],
  sondheim:['company','follies','assassins'],
  musicals:['gypsy','into-the-woods','west-side-story'],
  television:['crown','boardwalk-empire','ally-mcbeal'],
};
const captions={shakespeare:'Plays & productions',sondheim:'Words & music',musicals:'The musical stage',stratford:'Seasons at Stratford',shaw:'Seasons at Shaw',television:'On the small screen',albums:'On the record',books:'From the bookshelf',profiles:'Lives in the arts',early:'Where it began',publications:'Across the newspapers'};
function element(tag,cls,text){const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;}
export function renderHomeCollections(root,curation){
  if(!root)return;
  const grid=element('div','home-collection-grid');
  const specs=[...COLLECTIONS,{id:'publications',title:'Publications',href:'#index:publications'}];
  for(const spec of specs){
    const card=element('a','home-collection-card '+spec.id);card.href=spec.href||'#collection:'+spec.id;
    const visual=element('span','home-collection-visual');visual.setAttribute('aria-hidden','true');
    let assets=(examples[spec.id]||[]).map(key=>curation.artwork?.[spec.id+':'+key]).filter(Boolean);
    if(examples[spec.id]&&assets.length<3)assets=Object.entries(curation.artwork||{}).filter(([key])=>key.startsWith(spec.id+':')).slice(0,3).map(([,value])=>value);
    if(spec.id==='publications')assets=['national-post','the-observer','the-globe-and-mail'].map(key=>curation.publications?.[key]).filter(Boolean);
    for(const asset of assets){const image=element('img','');image.src=asset.src;image.alt='';image.loading='lazy';image.decoding='async';visual.append(image);}
    if(spec.id==='shakespeare'){visual.append(element('span','folio-title','WILLIAM\nSHAKESPEARE'),element('span','folio-works','HAMLET · KING LEAR\nTWELFTH NIGHT'));}
    if(spec.id==='early'){visual.append(element('span','early-year','1963–66'),element('span','early-paper','NEW CAMBRIDGE\nBROADSHEET'));}
    if(['stratford','shaw'].includes(spec.id)){
      // Abstract theatre architecture, not a photograph of a particular venue.
      visual.innerHTML=spec.id==='stratford'?'<svg viewBox="0 0 240 140"><path d="M25 110V66L75 25l45 41 45-41 50 41v44Z"/><path d="M20 115h200M48 105V77m36 28V63m36 42V80m36 25V63m36 42V77"/></svg>':'<svg viewBox="0 0 240 140"><path d="M28 113V56h184v57M18 48h204L120 18ZM44 62v44m38-44v44m38-44v44m38-44v44m38-44v44M20 120h200"/></svg>';
    }
    const label=element('span','home-collection-label');label.append(element('strong','',spec.title),element('span','',captions[spec.id]));card.append(visual,label);grid.append(card);
  }
  root.replaceChildren(grid);
}
