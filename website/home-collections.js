// Homepage previews reuse credited archive artwork; every card opens its collection.
import {COLLECTIONS,SONDHEIM_SHOWS,workKey} from './collections-engine.js?v=251';
import {setCollectionTitle} from './collection-title.js?v=2';
const examples = {
  books:['swing-time','all-or-nothing-at-all-a-life-of-frank-sinatra','broadway-anecdotes'],
  albums:['both-sides-now','art-of-romance','gypsy'],
  profiles:['alan-rickman','angela-lansbury','christopher-plummer'],
  sondheim:['company','follies','assassins'],
};
function element(tag,cls,text){const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;}
export const HOME_COLLECTION_ORDER=['recent','profiles','shakespeare','sondheim','stoppard','musicals','stratford','shaw','television','albums','books','early','publications','famous-letters'];
export function renderHomeCollections(root,curation,collections,{includePublications=true}={}){
  if(!root)return;
  const grid=element('div','home-collection-grid');
  const famousLetters={id:'famous-letters',title:'Special Letters Collection',href:'#correspondence:famous-letters'};
  const available=new Map([...COLLECTIONS,famousLetters,...(includePublications?[{id:'publications',title:'Publications',href:'#index:publications'}]:[])].map(spec=>[spec.id,spec]));
  const specs=HOME_COLLECTION_ORDER.map(id=>available.get(id)).filter(Boolean);
  for(const spec of specs){
    const card=element('a','home-collection-card '+spec.id);card.href=spec.href||'#collection:'+spec.id;
    const visual=element('span','home-collection-visual');visual.setAttribute('aria-hidden','true');
    let assets=(examples[spec.id]||[]).map(key=>curation.artwork?.[spec.id+':'+key]).filter(Boolean);
    if(spec.id==='musicals'){
      const sondheim=new Set(SONDHEIM_SHOWS.map(workKey));
      const top=[...(collections?.get('musicals')?.items||[])].filter(item=>!sondheim.has(workKey(item.title)))
        .sort((a,b)=>b.records.length-a.records.length||a.title.localeCompare(b.title)).slice(0,3);
      assets=top.map(item=>curation.artwork?.['musicals:'+item.id]).filter(Boolean);
      card.setAttribute('aria-label',`Musicals collection — featuring ${top.map(item=>item.title).join(', ')}`);
    }
    if(examples[spec.id]&&assets.length<3)assets=Object.entries(curation.artwork||{}).filter(([key])=>key.startsWith(spec.id+':')).slice(0,3).map(([,value])=>value);
    if(spec.id==='recent'){
      assets=[...(collections?.get('recent')?.records||[])]
        .filter(record=>record.media?.[0]?.thumbnail_path)
        .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))
        .slice(0,3)
        .map(record=>({src:'../site_export/content/'+record.media[0].thumbnail_path}));
    }
    if(spec.id==='famous-letters'){
      assets=[
        {src:'../site_export/content/media/correspondence/famous-letters/stephen-sondheim/1972-06-15-p01.jpg'},
        {src:'../site_export/content/media/correspondence/famous-letters/laurence-olivier/1976-11-15-p01.jpg'},
        {src:'../site_export/content/media/correspondence/famous-letters/john-cleese/1981-09-15-p01.jpg'},
      ];
    }
    if(spec.id==='stoppard'){
      const plays=[...(collections?.get('stoppard')?.items||[])].sort((a,b)=>b.records.length-a.records.length||a.title.localeCompare(b.title)).slice(0,3);
      assets=plays.map(play=>curation.artwork?.['stoppard:'+play.id]).filter(Boolean);
      card.setAttribute('aria-label',`Stoppard collection — featuring ${plays.map(play=>play.title).join(', ')}`);
      if(!assets.length)for(const play of plays)visual.append(element('span','stoppard-preview',play.title));
    }
    if(spec.id==='television'){
      const shows=[...(collections?.get('television')?.items||[])].sort((a,b)=>b.records.length-a.records.length||a.title.localeCompare(b.title)).slice(0,3);
      card.setAttribute('aria-label','TV Reviews collection — featuring '+shows.map(item=>item.title).join(', '));
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
    const label=element('span','home-collection-label');
    const title=element('strong');
    if(spec.id==='publications')title.textContent=spec.title;
    else setCollectionTitle(title,spec.title);
    label.append(title);card.append(visual,label);grid.append(card);
  }
  root.replaceChildren(grid);
}
