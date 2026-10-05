import {INDEX_LETTERS,indexSections} from './index-engine.js?v=173';
import {theatreIllustration, renderFestivalMap, festivalLocation} from './festival-map.js?v=173';
import {serialize, publicationYear, normalize} from './catalog-engine.js?v=173';
import {COLLECTIONS,workKey} from './collections-engine.js?v=238';
import {setCollectionTitle} from './collection-title.js?v=2';

export function createCollectionViews({state,els,h,node,link,button,openIndex,getCollections}) {
  let activeMap=null, generation=0, artObserver=null, alphabetObserver=null, alphabetScrollCleanup=null, stickyTitleObserver=null, stickyNavObserver=null;
  const dispose=()=>{alphabetScrollCleanup?.();alphabetScrollCleanup=null;alphabetObserver?.disconnect();alphabetObserver=null;artObserver?.disconnect();artObserver=null;stickyTitleObserver?.disconnect();stickyTitleObserver=null;stickyNavObserver?.disconnect();stickyNavObserver=null;els.indexContent.style.removeProperty('--collection-title-height');els.indexView.classList.remove('collection-page','festival-page','sticky-collection');generation++;activeMap?.remove();activeMap=null;document.querySelector('.collection-result-art')?.remove();document.querySelector('.play-introduction-link')?.remove();};
  function observeStickyTitle(target) {
    stickyTitleObserver?.disconnect();
    if(!target)return;
    const measure=()=>els.indexContent.style.setProperty('--collection-title-height',`${Math.ceil(target.getBoundingClientRect().height)}px`);
    stickyTitleObserver=new ResizeObserver(measure);stickyTitleObserver.observe(target);measure();
  }
  function frame() {
    els.indexView.classList.add('collection-page','sticky-catalog','sticky-collection');
    const back=els.indexView.querySelector(':scope > .back-link');
    back.href='#home';back.textContent='Back to home';
    observeStickyTitle(els.indexContent.querySelector('h1'));
    stickyNavObserver?.disconnect();
    const nav=els.indexContent.querySelector('.catalog-tabs');
    if(nav){const measure=()=>els.indexContent.style.setProperty('--directory-nav-height',`${Math.ceil(nav.getBoundingClientRect().height)}px`);stickyNavObserver=new ResizeObserver(measure);stickyNavObserver.observe(nav);measure();}
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
    if(collection.kind==='playwright'&&!asset?.src){
      const marks=['I','II','III','IV'];
      const index=[...item.id].reduce((sum,char)=>sum+char.charCodeAt(0),0)%4;
      wrapper.classList.add('variant-'+index,'is-title-art');
      wrapper.append(node('span',marks[index],'playwright-art-mark'),node('span',item.title,'art-title'));
      return wrapper;
    }
    const profileFallback=()=>{
      wrapper.classList.add('profile-fallback');
      const image=node('img');image.src=new URL('./assets/collections/profile-silhouette.svg',import.meta.url).href;image.alt='';image.loading='lazy';
      image.addEventListener('error',()=>{image.remove();wrapper.classList.remove('profile-fallback');wrapper.append(node('span',item.title,'art-title'));},{once:true});
      wrapper.append(image);
    };
    if(!asset?.src && ['musicals','television'].includes(collection.id)){
      const palettes=['#19384b','#543940','#37504b','#4d4560','#624630','#344858'];
      const index=[...item.id].reduce((sum,char)=>sum+char.charCodeAt(0),0)%palettes.length;
      wrapper.classList.add('curated-typography');
      wrapper.style.setProperty('--fallback-color',palettes[index]);
    }
    const screen=collection.kind==='television'?node('div',undefined,'television-screen'):wrapper;
    if(screen!==wrapper){wrapper.append(screen);screen.style.backgroundColor=asset?.screenColor||'#e1e9df';}
    if(asset?.src){
      const img=node('img');img.src=asset.src;img.alt=asset.alt||'';if(asset.fit)img.style.objectFit=asset.fit;if(collection.kind==='television'&&asset.fit==='contain')img.classList.add('television-logo');if(asset.position)img.style.objectPosition=asset.position;img.loading='lazy';wrapper.classList.add('has-artwork');
      img.addEventListener('error',()=>{img.remove();wrapper.classList.remove('has-artwork');if(collection.id==='profiles')profileFallback();else {screen.append(node('span',item.title,'art-title'));if(collection.kind==='playwright')wrapper.classList.add('is-title-art');}},{once:true});screen.append(img);
    } else if(collection.id==='profiles')profileFallback();
    else screen.append(node('span',item.title,'art-title'));
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
    a.setAttribute('aria-label',item.title+' — '+item.records.length+(item.records.length===1?' article':' articles'));
    a.append(artwork(collection,item),node('strong',item.title));
    if(item.records.length>1)a.append(node('span',item.records.length+' articles','collection-item-count'));
    return a;
  }
  function directory() {
    openIndex('Collections','works');frame();
    const cards=node('section');cards.id='collectionDirectoryCards';cards.setAttribute('aria-label','Archive collections');els.indexContent.append(cards);
    h.renderHomeCollections(cards,state.collectionCuration,getCollections(),{includePublications:false});
  }
  async function credits() {
    openIndex('Image credits','');
    const token=++generation;
    els.indexContent.append(node('p','Artwork identifies the publications, shows, books, recordings and people discussed in this archive. Copyright remains with the respective rights holders. Source and licence details are listed below.','landing-intro'));
    const content=node('div',undefined,'image-credits');els.indexContent.append(content);
    try {
      const response=await fetch(new URL('./assets/collections/credits.json?v=245',import.meta.url));
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
    document.querySelector('.play-introduction-link')?.remove();
    if(v.entityType==='shakespeare-plays' && v.entity){
      const intro=Object.entries(state.collectionCuration?.shakespeareIntroductions||{}).find(([title])=>h.entitySlug(title)===v.entity);
      const record=intro && state.records.find(r=>r.slug===intro[1]);
      if(record){
        const note=node('aside',undefined,'play-introduction-link');
        const a=link('Read Robert’s introduction to '+intro[0],'#review:'+record.slug);
        a.addEventListener('click',event=>h.storeArticleContext(event,record,{records:[record],backHref:window.location.hash,contextLabel:intro[0]}));
        note.append(a);els.results.before(note);
      }
    }
    const collection=getCollections().get(v.shelf), item=collection?.itemMap.get(v.item);
    if(!item)return;
    const banner=node('div',undefined,'collection-result-art');banner.append(artwork(collection,item),node('h2',item.title));
    els.archive.querySelector('.archive-heading').after(banner);
  }
  function recordList(records,label) {
    const result=node('div',undefined,'results collection-articles');
    const context={records,backHref:window.location.hash,contextLabel:label,titleFirst:true,visibleCount:records.length};
    result.append(...h.sortRecordsChronologically(records).map(r=>h.safeResultCard(r,context)));return result;
  }
  function recent(collection) {
    const records=[...collection.records].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    const grid=node('div',undefined,'current-landing-grid');
    records.forEach((record,index)=>{
      const a=link('',`#review:${record.slug}`,`current-landing-card${index===0?' is-latest':''}`);
      a.addEventListener('click',event=>h.storeArticleContext(event,record,{records,contextLabel:collection.title,backHref:'#collection:recent'}));
      const media=record.media?.[0];
      if(media?.local_path){const img=node('img');img.src=new URL('../site_export/content/'+media.local_path,import.meta.url).href;img.alt=media.alt||media.caption||record.title;img.loading='lazy';a.append(img);}
      const copy=node('div');copy.append(node('span',h.formatDate(record)),node('strong',record.title));
      const context=h.productionParts(record);
      if(context.length)copy.append(node('p',context.join(' / ')));
      a.append(copy);grid.append(a);
    });
    els.indexContent.append(grid);
  }
  function playwrightDirectory() {
    openIndex('Playwright Collections','works');frame();
    const grid=node('div',undefined,'home-collection-grid');
    for(const person of state.collectionCuration?.playwrights?.people||[]){
      const card=link('',person.href,'home-collection-card');
      const visual=node('span',undefined,'home-collection-visual');const image=node('img');image.src=person.portrait;image.alt=person.person;image.loading='lazy';visual.append(image);
      const label=node('span',undefined,'home-collection-label');label.append(node('strong',person.person));card.append(visual,label);grid.append(card);
    }
    els.indexContent.append(grid);
  }
  function show(id,params) {
    const collection=getCollections().get(id);
    const active=collection.kind==='festival'?'places':id==='profiles'?'people':['early','recent'].includes(id)?'articles':'works';
    openIndex(collection.title,active);frame();
    setCollectionTitle(els.indexContent.querySelector('h1'),collection.title);
    if(collection.kind==='recent'){recent(collection);return;}
    if(collection.kind==='festival'){festival(collection,params);return;}
    if(collection.kind==='early'){
      els.indexContent.append(recordList(collection.records,collection.title));
      const relatedIds=new Set(state.collectionCuration?.earlyUndated||[]);
      const related=state.records.filter(record=>relatedIds.has(record.slug));
      if(related.length)els.indexContent.append(node('h2','Undated Cambridge clippings'),node('p','Related student-publication clippings whose dates have not been established.'),recordList(related,'Undated Cambridge clippings'));
      return;
    }
    if(id==='sondheim'){
      const feature=link('','#correspondence:stephen-sondheim','sondheim-letters-feature');
      const copy=node('span',undefined,'sondheim-letters-feature-copy');
      copy.append(node('span','From the archive'),node('strong','Letters from Stephen Sondheim'),node('em','16 letters · 23 scanned pages · 1972–2001'));
      const pages=node('span',undefined,'sondheim-letters-feature-pages');
      ['1972-06-15-p01.jpg','2001-11-08-p01.jpg'].forEach(file=>{const image=node('img');image.src=new URL('../site_export/content/media/correspondence/famous-letters/stephen-sondheim/'+file,import.meta.url).href;image.alt='';image.loading='lazy';pages.append(image);});
      feature.append(copy,pages);els.indexContent.append(feature);
    }
    if(collection.kind==='playwright'){
      const hero=node('div',undefined,'playwright-collection-hero');
      const portrait=node('img');portrait.src=new URL(collection.portrait,import.meta.url).href;portrait.alt=`Portrait of ${collection.person}`;portrait.loading='eager';
      const copy=node('div',undefined,'playwright-collection-copy');
      copy.append(node('h2',collection.person,'playwright-collection-name'));
      copy.append(node('p',`${collection.items.length} works · ${collection.records.length} articles`,'playwright-collection-count'));
      hero.append(portrait,copy);els.indexContent.append(hero);
    }
    const field=node('label',undefined,'collection-find collection-find-compact');
    const search=node('input');search.type='search';search.setAttribute('aria-label',id==='profiles'?'Search for a person':'Search this collection');search.placeholder='Search this collection';search.value=params.get('q')||'';field.append(search);els.indexContent.append(field);
    const content=node('div');els.indexContent.append(content);
    const draw=()=>{
      const query=normalize(search.value);const items=collection.items.filter(item=>normalize(item.title).includes(query));
      const featured=items;
      content.replaceChildren();
      if(id==='profiles'||id==='musicals')alphabetGallery(collection,featured,content,search.value);
      else {const gallery=node('div',undefined,'collection-gallery '+collection.kind);gallery.append(...featured.map(item=>itemCard(collection,item)));content.append(gallery);fitTitles(gallery);}
      if(!items.length)content.append(node('p','No titles match this search.'));
      if(collection.ungrouped.length&&!query){content.append(node('h2',id==='sondheim'?'Essays, profiles and other writing':'More writing'),recordList(collection.ungrouped,collection.title));}
    };
    search.addEventListener('input',()=>{const p=new URLSearchParams();if(search.value)p.set('q',search.value);history.replaceState(null,'','#collection:'+id+(p.size?'?'+p:''));draw();});draw();
  }
  function alphabetGallery(collection,items,content,query,single=[]) {
    const continuous=collection.id==='musicals';
    const surnameKey=name=>{const parts=String(name).trim().split(/\s+/);if(parts.length<2)return parts[0]||'';const suffix=/^(Jr\.?|Sr\.?|I{2,3}|IV)$/i.test(parts.at(-1))?parts.pop():'';const surname=parts.pop();return `${surname}, ${parts.join(' ')} ${suffix}`.trim();};
    const sortText=item=>continuous?workKey(item.title):surnameKey(item.title);
    const sorted=[...items].sort((a,b)=>sortText(a).localeCompare(sortText(b)));
    const alpha=node('nav',undefined,'index-alphabet profiles-alphabet');alpha.setAttribute('aria-label',continuous?'Jump to a musical title':'Jump to a surname');
    content.append(alpha);const headings=new Map();
    const continuousGallery=continuous?node('div',undefined,'collection-gallery '+collection.kind+' collection-alphabet-gallery'):null;
    if(continuousGallery)content.append(continuousGallery);
    for(const [initial,group] of indexSections(sorted,sortText)){
      if(continuous){
        const cards=group.map(item=>itemCard(collection,item));
        headings.set(initial,cards[0]);continuousGallery.append(...cards);continue;
      }
      const section=node('section',undefined,'index-letter-section');
      const heading=node('h2',initial);heading.id='profiles-letter-'+(initial==='0–9'?'numbers':initial==='#'?'other':initial.toLowerCase());heading.tabIndex=-1;
      section.setAttribute('aria-labelledby',heading.id);headings.set(initial,heading);
      const gallery=node('div',undefined,'collection-gallery portraits');gallery.append(...group.map(item=>itemCard(collection,item)));section.append(heading,gallery);content.append(section);
    }
    const route=letter=>{const p=new URLSearchParams();if(query)p.set('q',query);p.set('letter',letter);return '#collection:'+collection.id+'?'+p;};
    let activeLetter='',suppressScrollSyncUntil=0;
    const setActiveLetter=(letter,{updateUrl=false}={})=>{if(!headings.has(letter)||letter===activeLetter)return;activeLetter=letter;alpha.querySelectorAll('a').forEach(a=>{if(a.dataset.letter===letter)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});if(updateUrl)history.replaceState(null,'',route(letter));};
    const visibleLetter=()=>{const cutoff=alpha.getBoundingClientRect().bottom+6;let current='',currentTop=-Infinity;for(const [initial,heading] of headings){const top=heading.getBoundingClientRect().top;if(top<=cutoff+8&&top>currentTop+1){current=initial;currentTop=top;}else if(top>cutoff+8)break;}return current||headings.keys().next().value||'';};
    const jump=letter=>{const heading=headings.get(letter);if(!heading)return;suppressScrollSyncUntil=performance.now()+600;setActiveLetter(letter,{updateUrl:true});let target=heading;
      if(continuous&&heading.parentElement===continuousGallery){const rowTop=heading.offsetTop;target=[...continuousGallery.children].find(card=>card.offsetTop===rowTop)||heading;}
      target.scrollIntoView({block:'start'});heading.focus({preventScroll:true});};
    for(const initial of INDEX_LETTERS){
      if(initial==='#'&&!headings.has(initial))continue;
      if(!headings.has(initial)){const empty=node('span',initial);empty.setAttribute('aria-disabled','true');alpha.append(empty);continue;}
      const a=link(initial,route(initial));a.dataset.letter=initial;a.setAttribute('aria-label','Jump to '+initial);
      a.addEventListener('click',event=>{if(event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();jump(initial);});alpha.append(a);
    }
    alpha.hidden=!items.length;
    const measure=()=>content.style.setProperty('--index-alphabet-height',alpha.getBoundingClientRect().height+'px');
    alphabetObserver?.disconnect();alphabetObserver=new ResizeObserver(measure);alphabetObserver.observe(alpha);
    let scrollFrame=0;const onScroll=()=>{if(performance.now()<suppressScrollSyncUntil||scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;if(performance.now()>=suppressScrollSyncUntil)setActiveLetter(visibleLetter(),{updateUrl:true});});};
    alphabetScrollCleanup?.();window.addEventListener('scroll',onScroll,{passive:true});alphabetScrollCleanup=()=>{window.removeEventListener('scroll',onScroll);if(scrollFrame)cancelAnimationFrame(scrollFrame);};
    fitTitles(content);requestAnimationFrame(()=>{measure();const letter=new URLSearchParams(location.hash.split('?')[1]||'').get('letter');if(letter&&headings.has(letter))jump(letter);else setActiveLetter(visibleLetter(),{updateUrl:true});});
  }
  function festival(collection,params) {
    els.indexView.classList.add('festival-page');
    const heading=els.indexContent.querySelector('h1');
    const logo=state.collectionCuration?.homeArtwork?.[collection.id];
    const titleGroup=node('div',undefined,'festival-title-group');
    titleGroup.append(heading);
    if(logo?.src){const img=node('img');img.src=logo.src;img.alt='';img.setAttribute('aria-hidden','true');img.className='festival-heading-logo';titleGroup.append(img);}
    const years=[...new Set(collection.records.map(publicationYear).filter(Boolean))].sort().reverse();
    let year=years.includes(params.get('year'))?params.get('year'):'';
    const selectedTheatre=params.get('theatre')||'';
    const theatreHref=venue=>{const p=new URLSearchParams();if(year)p.set('year',year);p.set('theatre',venue.label);return '#collection:'+collection.id+'?'+p;};
    const field=node('label',undefined,'festival-year');
    const select=node('select');select.setAttribute('aria-label','Season');select.append(new Option('All years',''));years.forEach(y=>select.append(new Option(y,y)));select.value=year;field.append(select);
    const map=node('div',undefined,'places-map festival-map');map.setAttribute('aria-label',collection.title+' festival venues');
    const list=node('div',undefined,'festival-venues'),all=link('',resultsHref(collection),'primary-action');
    const header=node('div',undefined,'festival-header');els.indexContent.querySelector('.catalog-tabs').before(header);header.append(titleGroup,field);observeStickyTitle(titleGroup);
    els.indexContent.append(map,node('p','Select a theatre to browse its articles. ≈ marks an approximate location.','festival-map-note'),all,list);
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
      const isFestivalVenue=label=>collection.id==='stratford'?/^(festival theatre|stratford festival theatre|avon theatre|tom patterson theatre|studio theatre|third stage)$/.test(normalize(label)):/^(festival theatre|shaw festival theatre|court house theatre|royal george theatre|studio theatre|jackie maxwell studio(?: theatre)?)$/.test(normalize(label));
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
  return {directory,playwrightDirectory,show,decorateCatalog,dispose,credits,frame};
}
