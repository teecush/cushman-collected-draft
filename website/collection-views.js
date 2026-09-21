import {INDEX_LETTERS,indexSections} from './index-engine.js?v=173';
import {theatreIllustration, renderFestivalMap, festivalLocation} from './festival-map.js?v=173';
import {serialize, publicationYear, normalize} from './catalog-engine.js?v=173';
import {COLLECTIONS} from './collections-engine.js?v=173';

export function createCollectionViews({state,els,h,node,link,button,openIndex,getCollections}) {
  let activeMap=null, generation=0, artObserver=null, alphabetObserver=null;
  const dispose=()=>{alphabetObserver?.disconnect();alphabetObserver=null;artObserver?.disconnect();artObserver=null;els.indexView.classList.remove('collection-page');generation++;activeMap?.remove();activeMap=null;document.querySelector('.collection-result-art')?.remove();};
  function frame() {
    els.indexView.classList.add('collection-page');
    const back=els.indexView.querySelector(':scope > .back-link');
    back.href='#home';back.textContent='Back to home';
  }
  function fitTitles(root) {
    const fit=()=>root.querySelectorAll('.art-title').forEach(title=>{
      const box=title.parentElement;
      let size=24;title.style.fontSize=size+'px';
      while(size>9&&(title.scrollWidth>title.clientWidth+1||title.scrollHeight>box.clientHeight-16)){
        title.style.fontSize=(--size)+'px';
      }
    });
    artObserver?.disconnect();artObserver=new ResizeObserver(fit);artObserver.observe(root);requestAnimationFrame(fit);
  }
  const resultsHref=(collection,item,extra={})=>serialize({shelf:collection.id,...(item?{item:item.id}:{}),origin:window.location.hash,...extra});
  function artwork(collection,item,cls='') {
    const wrapper=node('div',undefined,'collection-art '+collection.kind+' '+cls);
    const asset=state.collectionCuration?.artwork?.[collection.id+':'+item.id];
    const screen=collection.kind==='television'?node('div',undefined,'television-screen'):wrapper;
    if(screen!==wrapper){wrapper.append(screen);screen.style.backgroundColor=asset?.screenColor||'#e1e9df';}
    if(asset?.src){
      const img=node('img');img.src=asset.src;img.alt='';if(asset.fit)img.style.objectFit=asset.fit;if(collection.kind==='television'&&asset.fit==='contain')img.classList.add('television-logo');if(asset.position)img.style.objectPosition=asset.position;img.loading='lazy';wrapper.classList.add('has-artwork');
      img.addEventListener('error',()=>{img.remove();wrapper.classList.remove('has-artwork');screen.append(node('span',item.title,'art-title'));},{once:true});screen.append(img);
    } else screen.append(node('span',item.title,'art-title'));
    return wrapper;
  }
  function itemLink(collection,item,label='',cls='') {
    if(item.records.length!==1)return link(label,resultsHref(collection,item),cls);
    const record=item.records[0];
    const a=link(label,new URL(`../reviews/${record.slug}/`,import.meta.url).href,cls);
    a.addEventListener('click',event=>{
      h.storeArticleContext(event,record,{records:item.records,backHref:window.location.hash,contextLabel:collection.title});
      if(!event.defaultPrevented&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&!event.button){event.preventDefault();window.location.hash=`#review:${record.slug}`;}
    });
    return a;
  }
  function itemCard(collection,item) {
    const a=itemLink(collection,item,'','collection-item');
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
      const response=await fetch(new URL('./assets/collections/credits.json?v=173',import.meta.url));
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
    const collection=getCollections().get(id);openIndex(collection.title,'');frame();
    if(collection.kind==='festival'){festival(collection,params);return;}
    if(id!=='profiles')els.indexContent.append(node('p',collection.intro,'landing-intro'));
    if(id!=='television')els.indexContent.append(link('Search all '+collection.records.length.toLocaleString()+' articles',resultsHref(collection),'primary-action'));
    if(collection.kind==='early'){
      els.indexContent.append(recordList(collection.records,collection.title));
      const relatedIds=new Set(state.collectionCuration?.earlyUndated||[]);
      const related=state.records.filter(record=>relatedIds.has(record.slug));
      if(related.length)els.indexContent.append(node('h2','Undated Cambridge clippings'),node('p','Related student-publication clippings whose dates have not been established.'),recordList(related,'Undated Cambridge clippings'));
      return;
    }
    const field=node('label',undefined,'collection-find');field.append(node('span',id==='television'?'Search this collection':'Find '+(collection.kind==='portraits'?'a person':'a title')));
    const search=node('input');search.type='search';search.placeholder=id==='television'?'':'Search this collection';search.value=params.get('q')||'';field.append(search);els.indexContent.append(field);
    const content=node('div');els.indexContent.append(content);
    const draw=()=>{
      const query=normalize(search.value);const items=collection.items.filter(item=>normalize(item.title).includes(query));
      const featured=items.filter(item=>id!=='musicals'||item.records.length>=2);
      const single=items.filter(item=>id==='musicals'&&item.records.length<2);
      content.replaceChildren();
      if(id==='profiles')profileGallery(collection,featured,content,search.value);
      else {const gallery=node('div',undefined,'collection-gallery '+collection.kind);gallery.append(...featured.map(item=>itemCard(collection,item)));content.append(gallery);fitTitles(gallery);}
      if(single.length){content.append(node('h2','More musicals, A–Z'));const list=node('div',undefined,'catalog-index-list');for(const item of single)list.append(itemLink(collection,item,item.title));content.append(list);}
      if(!items.length)content.append(node('p','No titles match this search.'));
      if(collection.ungrouped.length&&!query){content.append(node('h2',id==='sondheim'?'Essays, profiles and other writing':'More writing'),recordList(collection.ungrouped,collection.title));}
    };
    search.addEventListener('input',()=>{const p=new URLSearchParams();if(search.value)p.set('q',search.value);history.replaceState(null,'','#collection:'+id+(p.size?'?'+p:''));draw();});draw();
  }
  function profileGallery(collection,items,content,query) {
    const sortText=item=>h.indexSortText(item.title,'people');
    const sorted=[...items].sort((a,b)=>sortText(a).localeCompare(sortText(b)));
    const alpha=node('nav',undefined,'index-alphabet profiles-alphabet');alpha.setAttribute('aria-label','Jump to a surname');
    content.append(alpha);const headings=new Map();
    for(const [initial,group] of indexSections(sorted,sortText)){
      const section=node('section',undefined,'index-letter-section');
      const heading=node('h2',initial);heading.id='profiles-letter-'+(initial==='0–9'?'numbers':initial==='#'?'other':initial.toLowerCase());heading.tabIndex=-1;
      section.setAttribute('aria-labelledby',heading.id);headings.set(initial,heading);
      const gallery=node('div',undefined,'collection-gallery portraits');gallery.append(...group.map(item=>itemCard(collection,item)));section.append(heading,gallery);content.append(section);
    }
    const route=letter=>{const p=new URLSearchParams();if(query)p.set('q',query);p.set('letter',letter);return '#collection:profiles?'+p;};
    const jump=letter=>{const heading=headings.get(letter);if(!heading)return;history.replaceState(null,'',route(letter));alpha.querySelectorAll('a').forEach(a=>{if(a.dataset.letter===letter)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});heading.scrollIntoView({block:'start'});heading.focus({preventScroll:true});};
    for(const initial of INDEX_LETTERS){
      if(initial==='#'&&!headings.has(initial))continue;
      if(!headings.has(initial)){const empty=node('span',initial);empty.setAttribute('aria-disabled','true');alpha.append(empty);continue;}
      const a=link(initial,route(initial));a.dataset.letter=initial;a.setAttribute('aria-label','Jump to '+initial);
      a.addEventListener('click',event=>{if(event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();jump(initial);});alpha.append(a);
    }
    alpha.hidden=!items.length;
    const measure=()=>content.style.setProperty('--index-alphabet-height',alpha.getBoundingClientRect().height+'px');
    alphabetObserver?.disconnect();alphabetObserver=new ResizeObserver(measure);alphabetObserver.observe(alpha);
    fitTitles(content);requestAnimationFrame(()=>{measure();const letter=new URLSearchParams(location.hash.split('?')[1]||'').get('letter');if(letter)jump(letter);});
  }
  function festival(collection,params) {
    const heading=els.indexContent.querySelector('h1');
    const logo=state.collectionCuration?.homeArtwork?.[collection.id];
    if(logo?.src){const img=node('img');img.src=logo.src;img.alt=collection.title;heading.replaceChildren(img);heading.classList.add('festival-heading');}
    const years=[...new Set(collection.records.map(publicationYear).filter(Boolean))].sort().reverse();
    let year=years.includes(params.get('year'))?params.get('year'):'';
    const selectedTheatre=params.get('theatre')||'';
    const theatreHref=venue=>{const p=new URLSearchParams();if(year)p.set('year',year);p.set('theatre',venue.label);return '#collection:'+collection.id+'?'+p;};
    const field=node('label',undefined,'festival-year');field.append(node('span','Season'));
    const select=node('select');select.append(new Option('All years',''));years.forEach(y=>select.append(new Option(y,y)));select.value=year;field.append(select);
    const map=node('div',undefined,'places-map festival-map');map.setAttribute('aria-label',collection.title+' festival venues');
    const list=node('div',undefined,'festival-venues'),all=link('',resultsHref(collection),'primary-action');
    els.indexContent.append(field,map,node('p','Select a theatre to browse its articles. ≈ marks an approximate location.','festival-map-note'),all,list);
    const draw=async({scrollToReviews=true}={})=>{
      const token=++generation;activeMap?.remove();activeMap=null;
      const extra=year?{from:year,to:year}:{};
      const records=collection.records.filter(r=>!year||publicationYear(r)===year);
      const ids=new Set(records.map(r=>r.slug));
      all.href=resultsHref(collection,null,extra);all.textContent='Browse all '+records.length+' articles'+(year?' from '+year:'');
      const pageParams=new URLSearchParams();if(year)pageParams.set('year',year);if(selectedTheatre)pageParams.set('theatre',selectedTheatre);history.replaceState(null,'','#collection:'+collection.id+(pageParams.size?'?'+pageParams:''));
      list.replaceChildren(node('h2','The theatres'));
      map.replaceChildren(node('p','Loading the festival map…'));
      // Match the Canadian festival city, not venues with the same name elsewhere.
      const cityMatches=value=>collection.id==='stratford'?/^stratford(?: ontario| on canada)?$/.test(normalize(value)):/^niagara on the lake(?: ontario| on canada)?$/.test(normalize(value));
      const isFestivalVenue=label=>collection.id==='stratford'?/^(festival theatre|stratford festival theatre|avon theatre|tom patterson theatre|studio theatre|third stage|masonic concert hall|studio annex)$/.test(normalize(label)):/^(festival theatre|shaw festival theatre|court house theatre|royal george theatre|studio theatre|jackie maxwell studio(?: theatre)?)$/.test(normalize(label));
      const venueAliases=h.venueMapPoints().filter(p=>cityMatches(p.city)&&isFestivalVenue(p.label)).map(p=>({...p,records:p.records.filter(r=>ids.has(r.slug)&&h.recordVenueCityPairs(r).some(pair=>normalize(pair.venue)===normalize(p.label)&&normalize(pair.city)===normalize(p.city)))})).map(p=>festivalLocation(collection.id,{...p,count:p.records.length}));
      // Group historical/alternate names only in this view; preserve source metadata.
      const groups=new Map();
      for(const venue of venueAliases){
        let label=venue.label;
        if(/^(stratford |shaw )?festival theatre$/i.test(label))label='Festival Theatre';
        if(collection.id==='shaw'&&/studio/i.test(label))label='Jackie Maxwell Studio Theatre';
        if(collection.id==='stratford'&&label==='Third Stage')label='Tom Patterson Theatre';
        const group=groups.get(label)||{...venue,label,records:[],aliases:[]};
        group.aliases.push(venue.label);group.records.push(...venue.records);groups.set(label,group);
      }
      const allVenues=[...groups.values()].map(v=>{const records=[...new Map(v.records.map(r=>[r.slug,r])).values()];return {...v,records,count:records.length};});
      const venues=allVenues.filter(p=>p.count);
      const rows=node('div',undefined,'festival-venue-grid');
      for(const venue of venues){
        const a=link('',theatreHref(venue),'festival-venue-card');if(venue.label===selectedTheatre)a.setAttribute('aria-current','true');const art=node('div',undefined,'theatre-illustration');art.innerHTML=theatreIllustration(collection.id,venue.label);a.append(art,node('h3',venue.label));
        if(venue.count>1)a.append(node('span',venue.count+' articles'));
        const titles=[...new Set(venue.records.flatMap(r=>h.recordVenueCityPairs(r).filter(pair=>venue.aliases.some(alias=>normalize(pair.venue)===normalize(alias))&&cityMatches(pair.city)).map(pair=>pair.productionTitle).filter(Boolean)))];
        if(year&&titles.length)a.append(node('p',titles.join(' · ')));rows.append(a);
      }
      list.append(rows);
      const selected=allVenues.find(v=>v.label===selectedTheatre);
      if(selected){const results=node('section',undefined,'festival-selected-articles');results.append(node('h2',selected.label+(year?' · '+year:'')),node('p',selected.count+' '+(selected.count===1?'article':'articles')),link('All theatres','#collection:'+collection.id+(year?'?year='+year:''),'festival-clear'),recordList(selected.records,collection.title+' — '+selected.label));list.append(results);}

      if(!venues.length)list.append(node('p','No venue-linked articles for this season. Use Browse all articles above.'));
      try{await h.loadMapResources();}catch{if(token===generation)map.replaceChildren(node('p','The map could not load. Browse the theatres below.'));return;}
      if(token!==generation||!map.isConnected)return;
      activeMap=renderFestivalMap(map,allVenues,collection.id,theatreHref);
      if(selected){map.querySelectorAll('.festival-map-theatre').forEach(a=>{if(a.getAttribute('href')===theatreHref(selected))a.setAttribute('aria-current','true');});if(scrollToReviews)requestAnimationFrame(()=>{if(token!==generation)return;const heading=list.querySelector('.festival-selected-articles h2');heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});});}
    };
    select.addEventListener('change',()=>{year=select.value;draw({scrollToReviews:false});});draw();
  }
  return {directory,show,decorateCatalog,dispose,credits,frame};
}
