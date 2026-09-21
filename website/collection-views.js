import {serialize, publicationYear, normalize} from './catalog-engine.js?v=156';
import {COLLECTIONS} from './collections-engine.js?v=156';

export function createCollectionViews({state,els,h,node,link,button,openIndex,getCollections}) {
  let activeMap=null, generation=0;
  const dispose=()=>{generation++;activeMap?.remove();activeMap=null;document.querySelector('.collection-result-art')?.remove();};
  const resultsHref=(collection,item,extra={})=>serialize({shelf:collection.id,...(item?{item:item.id}:{}),origin:window.location.hash,...extra});
  function artwork(collection,item,cls='') {
    const wrapper=node('div',undefined,'collection-art '+collection.kind+' '+cls);
    const asset=state.collectionCuration?.artwork?.[collection.id+':'+item.id];
    if(asset?.src){
      const img=node('img');img.src=asset.src;img.alt='';img.loading='lazy';wrapper.classList.add('has-artwork');
      img.addEventListener('error',()=>{img.remove();wrapper.classList.remove('has-artwork');wrapper.append(node('span',item.title,'art-title'));},{once:true});wrapper.append(img);
    } else wrapper.append(node('span',item.title,'art-title'));
    return wrapper;
  }
  function itemCard(collection,item) {
    const a=link('',resultsHref(collection,item),'collection-item');
    a.append(artwork(collection,item),node('strong',item.title));
    if(item.records.length>1)a.append(node('span',item.records.length+' articles','collection-item-count'));
    return a;
  }
  function directory() {
    openIndex('Collections','');
    els.indexContent.append(node('p','Explore a writer, a festival, or a shelf of discoveries.','landing-intro'));
    const cards=node('div',undefined,'collection-cards');
    for(const spec of COLLECTIONS){const collection=getCollections().get(spec.id);const a=link('',spec.href||'#collection:'+spec.id);a.append(node('h2',spec.title),node('p',spec.intro),node('strong',collection.records.length.toLocaleString()+' articles'));cards.append(a);}
    els.indexContent.append(cards);
  }
  async function credits() {
    openIndex('Image credits','');
    const token=++generation;
    els.indexContent.append(node('p','Artwork identifies the publications, shows, books, recordings and people discussed in this archive. Copyright remains with the respective rights holders. Source and licence details are listed below.','landing-intro'));
    const content=node('div',undefined,'image-credits');els.indexContent.append(content);
    try {
      const response=await fetch(new URL('./assets/collections/credits.json',import.meta.url));
      if(!response.ok)throw new Error('Credits unavailable');
      const entries=await response.json();if(token!==generation)return;
      for(const asset of entries){
        const row=node('section');row.append(node('h2',asset.titles.join(' / ')));
        if(asset.creator)row.append(node('p',asset.creator));
        const source=link('Image source',asset.source);source.target='_blank';source.rel='noopener';row.append(source);
        row.append(node('p',asset.license||'Copyright retained by the rights holder.'));
        if(asset.licenseUrl&&/^https?:/.test(asset.licenseUrl)){const licence=link('Licence details',asset.licenseUrl);licence.target='_blank';licence.rel='noopener';row.append(licence);}
        if(asset.credit)row.append(node('p',asset.credit));
        if(asset.changes)row.append(node('p',asset.changes));
        content.append(row);
      }
    }catch{if(token===generation)content.append(node('p','Image credits could not load. Please try again.'));}
  }
  function decorateCatalog(v) {
    document.querySelector('.collection-result-art')?.remove();
    const collection=getCollections().get(v.shelf), item=collection?.itemMap.get(v.item);
    if(!item)return;
    const banner=node('div',undefined,'collection-result-art');banner.append(artwork(collection,item),node('h2',item.title));
    els.archive.querySelector('.archive-heading').after(banner);
  }
  function recordList(records,label) {
    const result=node('div',undefined,'results collection-articles');
    const context={records,backHref:window.location.hash,contextLabel:label,titleFirst:h.FEATURES.compactResults,visibleCount:records.length};
    result.append(...h.sortRecordsChronologically(records).map(r=>h.safeResultCard(r,context)));return result;
  }
  function show(id,params) {
    const collection=getCollections().get(id);openIndex(collection.title,'');
    els.indexContent.append(node('p',collection.intro,'landing-intro'));
    if(collection.kind==='festival'){festival(collection,params);return;}
    els.indexContent.append(link('Search all '+collection.records.length.toLocaleString()+' articles',resultsHref(collection),'primary-action'));
    if(collection.kind==='early'){
      els.indexContent.append(recordList(collection.records,collection.title));
      const relatedIds=new Set(state.collectionCuration?.earlyUndated||[]);
      const related=state.records.filter(record=>relatedIds.has(record.slug));
      if(related.length)els.indexContent.append(node('h2','Undated Cambridge clippings'),node('p','Related student-publication clippings whose dates have not been established. The opera preview is unsigned.'),recordList(related,'Undated Cambridge clippings'));
      return;
    }
    const field=node('label',undefined,'collection-find');field.append(node('span','Find '+(collection.kind==='portraits'?'a person':'a title')));
    const search=node('input');search.type='search';search.placeholder='Search this collection';search.value=params.get('q')||'';field.append(search);els.indexContent.append(field);
    const content=node('div');els.indexContent.append(content);
    const draw=()=>{
      const query=normalize(search.value);const items=collection.items.filter(item=>normalize(item.title).includes(query));
      const featured=items.filter(item=>id!=='musicals'||item.records.length>=2);
      const single=items.filter(item=>id==='musicals'&&item.records.length<2);
      content.replaceChildren();
      const gallery=node('div',undefined,'collection-gallery '+collection.kind);gallery.append(...featured.map(item=>itemCard(collection,item)));content.append(gallery);
      if(single.length){content.append(node('h2','More musicals, A–Z'));const list=node('div',undefined,'catalog-index-list');for(const item of single)list.append(link(item.title,resultsHref(collection,item)));content.append(list);}
      if(!items.length)content.append(node('p','No titles match this search.'));
      if(collection.ungrouped.length&&!query){content.append(node('h2',id==='sondheim'?'Essays, profiles and other writing':'More writing'),recordList(collection.ungrouped,collection.title));}
    };
    search.addEventListener('input',()=>{const p=new URLSearchParams();if(search.value)p.set('q',search.value);history.replaceState(null,'','#collection:'+id+(p.size?'?'+p:''));draw();});draw();
  }
  function festival(collection,params) {
    const years=[...new Set(collection.records.map(publicationYear).filter(Boolean))].sort().reverse();
    let year=years.includes(params.get('year'))?params.get('year'):'';
    const field=node('label',undefined,'festival-year');field.append(node('span','Season'));
    const select=node('select');select.append(new Option('All years',''));years.forEach(y=>select.append(new Option(y,y)));select.value=year;field.append(select);
    const map=node('div',undefined,'places-map festival-map');map.setAttribute('aria-label',collection.title+' festival venues');
    const list=node('div',undefined,'festival-venues'),all=link('',resultsHref(collection),'primary-action');
    els.indexContent.append(field,map,all,list);
    const draw=async()=>{
      const token=++generation;activeMap?.remove();activeMap=null;
      const extra=year?{from:year,to:year}:{};
      const records=collection.records.filter(r=>!year||publicationYear(r)===year);
      const ids=new Set(records.map(r=>r.slug));
      all.href=resultsHref(collection,null,extra);all.textContent='Browse all '+records.length+' articles'+(year?' from '+year:'');
      history.replaceState(null,'','#collection:'+collection.id+(year?'?year='+year:''));
      list.replaceChildren(node('h2','The theatres'));
      map.replaceChildren(node('p','Loading the festival map…'));
      try{await h.loadMapResources();}catch{if(token!==generation)return;map.replaceChildren(node('p','The map could not load. Browse the theatres below.'));}
      if(token!==generation||!map.isConnected)return;
      // Match the Canadian festival city, not venues with the same name elsewhere.
      const cityMatches=value=>collection.id==='stratford'?/^stratford(?: ontario| on canada)?$/.test(normalize(value)):/^niagara on the lake(?: ontario| on canada)?$/.test(normalize(value));
      const isFestivalVenue=label=>collection.id==='stratford'?/^(festival theatre|stratford festival theatre|avon theatre|tom patterson theatre|studio theatre|third stage|masonic concert hall|studio annex)$/.test(normalize(label)):/^(festival theatre|shaw festival theatre|court house theatre|royal george theatre|studio theatre|jackie maxwell studio(?: theatre)?)$/.test(normalize(label));
      const venues=h.venueMapPoints().filter(p=>cityMatches(p.city)&&isFestivalVenue(p.label)).map(p=>({...p,records:p.records.filter(r=>ids.has(r.slug)&&h.recordVenueCityPairs(r).some(pair=>normalize(pair.venue)===normalize(p.label)&&normalize(pair.city)===normalize(p.city)))})).filter(p=>p.records.length).map(p=>({...p,count:p.records.length}));
      const rows=node('div',undefined,'festival-venue-grid');
      for(const venue of venues){
        const a=link('',resultsHref(collection,null,{...extra,venue:venue.label,city:venue.city}),'festival-venue-card');a.append(node('h3',venue.label));
        if(venue.count>1)a.append(node('span',venue.count+' articles'));
        const titles=[...new Set(venue.records.flatMap(r=>h.recordVenueCityPairs(r).filter(pair=>normalize(pair.venue)===normalize(venue.label)&&cityMatches(pair.city)).map(pair=>pair.productionTitle).filter(Boolean)))];
        if(year&&titles.length)a.append(node('p',titles.join(' · ')));rows.append(a);
      }
      list.append(rows);
      if(!venues.length){list.append(node('p','No venue-linked articles for this season. Use Browse all articles above.'));map.replaceChildren(node('p','No festival venues are recorded for this selection.'));return;}
      if(!window.L)map.replaceChildren(node('p','The interactive map could not load. Browse the theatres below.'));
      if(window.L){
        const center=collection.id==='stratford'?[43.372,-80.979]:[43.252,-79.073];
        activeMap=h.renderArchiveMap(map,[],{venues,initialCenter:center,initialZoom:14,venueZoomThreshold:0,zoomControl:true,venueLink:venue=>resultsHref(collection,null,{...extra,venue:venue.label,city:venue.city})});
      }
    };
    select.addEventListener('change',()=>{year=select.value;draw();});draw();
  }
  return {directory,show,decorateCatalog,dispose,credits};
}
