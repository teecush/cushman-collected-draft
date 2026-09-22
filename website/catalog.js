import {FIELDS, normalize, nameMatches, publicationYear, serialize, parse, articleForm, articleSubject} from './catalog-engine.js?v=173';
import {makeCollections, COLLECTIONS} from './collections-engine.js?v=173';
import {createCollectionViews} from './collection-views.js?v=182';
import {INDEX_LETTERS, indexOrder, indexEntries, indexSections} from './index-engine.js?v=173';
export function createCatalog({state, els, h}) {
  let extra = {}, indexCache = new Map(), textIndex = null, textPromise = null, indexResizeObserver = null, placesMap = null, collectionData = null;
  const getCollections = () => collectionData ||= makeCollections(state.records, h, state.collectionCuration);
  const node = (tag, text, className) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; };
  const link = (label, href, cls) => { const a = node('a', label, cls); a.href = href; return a; };
  const button = (label, fn, cls) => { const b = node('button', label, cls); b.type = 'button'; b.addEventListener('click', fn); return b; };
  const values = () => ({...extra,q:state.query,type:state.type,collection:state.collection,group:state.shakespeareGroup,sort:state.sort,shown:state.visible > 36 ? state.visible : ''});
  const href = () => serialize(values());
  function setValues(v) {
    extra = {...v}; state.query = v.q || ''; state.type = v.type || ''; state.collection = v.collection || ''; state.shakespeareGroup = v.group || ''; state.sort = v.sort || (state.query ? 'relevance' : 'newest'); state.visible = Math.max(36,Math.min(10000,Number(v.shown)||36));
    els.searchInput.value=state.query; els.typeFilter.value=state.type; els.collectionFilter.value=state.collection;
    document.querySelectorAll('[data-catalog-filter]').forEach(input => { input.value = v[input.dataset.catalogFilter] || ''; });
    const check=document.querySelector('#searchArticleText'); if(check) check.checked=v.text==='1';
  }
  function tabs(active='articles',scope={}) {
    const nav=node('nav',undefined,'catalog-tabs'); nav.setAttribute('aria-label','Catalog views');
    [['Articles','#archive','articles'],['Works','#works','works'],['People','#people','people'],['Publications','#index:publications','publications'],['Places','#places','places']].forEach(([label,url,key])=>{const context={...scope};delete context.origin;delete context.shown;delete context.entity;delete context.entityType;delete context.indexScope;const a=link(label,serialize(context,url));if(key===active)a.setAttribute('aria-current','page');nav.append(a);});
    return nav;
  }
  function focusHeading(root=els.indexContent) { const heading=root.querySelector('h1'); if(heading){heading.tabIndex=-1; heading.focus({preventScroll:true});} }
  function openIndex(title, active) {
    els.indexView.classList.remove('directory-page');
    document.body.classList.add('index-open', 'catalog-page'); els.indexView.hidden=false;
    const heading=node('h1',title); els.indexContent.replaceChildren(heading,tabs(active));
    const back=els.indexView.querySelector(':scope > .back-link'); back.href='#archive';back.textContent='Back to catalog';
    requestAnimationFrame(()=>{window.scrollTo(0,0);focusHeading();});
  }
  function matches(record,v=values(), omitQuery=false) {
    if(v.shelf && !getCollections().get(v.shelf)?.recordIds.has(record.slug))return false;
    if(v.item && !getCollections().get(v.shelf)?.itemMap.get(v.item)?.recordIds.has(record.slug))return false;
    if(v.collection && v.collection!==h.SHAKESPEARE_COLLECTION && !h.collectionNames(record).includes(v.collection))return false;
    if(v.collection===h.SHAKESPEARE_COLLECTION && !h.isExplicitShakespeareRecord(record))return false;
    if(v.group && v.collection===h.SHAKESPEARE_COLLECTION && h.shakespeareGroup(record)!==v.group)return false;
    if(v.type && h.typeGroup(record).value!==v.type)return false;
    if(v.from && (!publicationYear(record) || Number(publicationYear(record))<Number(v.from)))return false;
    if(v.to && (!publicationYear(record) || Number(publicationYear(record))>Number(v.to)))return false;
    if(v.publication && h.articlePublicationLabel(record)!==v.publication)return false;
    if(v.subject && articleSubject(record.article_category)!==v.subject)return false;
    if(v.form && articleForm(record.article_category)!==v.form)return false;
    if(v.completeness && (h.isIncompleteArticle(record)?'partial':'complete')!==v.completeness)return false;
    for(const [key,type] of [['company','companies'],['city','cities'],['venue','venues'],['person',v.role||'people']]) {
      if(v[key] && !(key==='city'&&v.city==='__unspecified__') && !h.entityValues(record,type).some(value=>normalize(value)===normalize(v[key])))return false;
    }
    // A venue and city must belong to the same production/location, not merely the same multi-review article.
    if(v.venue && v.city && !h.recordVenueCityPairs(record).some(pair=>normalize(pair.venue)===normalize(v.venue)&&normalize(pair.city)===normalize(v.city==='__unspecified__'?'':v.city)))return false;
    if(v.entityType && v.entity && !h.entityValues(record,v.entityType).some(value=>h.entitySlug(value)===v.entity))return false;
    if(v.indexScope){const filter=h.masterIndexFilter(v.indexScope);if(filter.predicate && !filter.predicate(record))return false;}
    if(!omitQuery && v.q){
      const metadata=h.recordMatchesQuery(record,v.q);
      if(!metadata && !(v.text==='1' && normalize(textIndex?.[record.slug]).includes(normalize(v.q))))return false;
    }
    return true;
  }
  function renderChips() {
    const chips=document.querySelector('#activeFilters'); if(!chips)return;chips.replaceChildren();
    const v=values();
    const labels={shelf:'Collection',item:'Title',q:'Search',type:'Type',collection:'Collection',group:'Shakespeare',from:'From',to:'To',publication:'Publication',subject:'Subject',form:'Form',company:'Company',city:'City',venue:'Venue',person:'Person',role:'Role',completeness:'Source',entity:'Coverage',indexScope:'Work type',text:'Search article text'};
    Object.entries(labels).forEach(([key,label])=>{
      if(!v[key])return;
      let value=v[key];if(key==='shelf')value=getCollections().get(value)?.title||value;if(key==='item')value=getCollections().get(v.shelf)?.itemMap.get(value)?.title||value;if(value==='__unspecified__')value='Not recorded';if(key==='entity')value=h.entityMap(v.entityType).get(value)?.label||value;
      if(key==='type')value=h.TYPE_GROUPS.find(x=>x.value===value)?.label||value;
      if(key==='text')value='Included';
      const b=button(`${label}: ${value} ×`,()=>{const next=values();delete next[key];if(key==='shelf')delete next.item;if(key==='collection')delete next.group;if(key==='entity')delete next.entityType;delete next.shown;setValues(next);apply();history.replaceState(null,'',href());});b.setAttribute('aria-label',`Remove ${label}: ${value}`);chips.append(b);
    });
    if(chips.children.length)chips.append(button('Clear all',clear));
    document.querySelector('#exactMatches')?.remove();
    if(v.q && !v.entity){const exact=node('nav',undefined,'exact-matches');exact.id='exactMatches';exact.setAttribute('aria-label','Exact catalog entries');
      for(const type of ['productions','books','people']){for(const e of h.entityMap(type).values()){if(normalize(e.label)===normalize(v.q))exact.append(link(`${e.label} — ${type==='people'?'person':'work'} · ${e.records.filter(r=>matches(r,{...v,q:''})).length} articles`,serialize({...v,q:'',entityType:type,entity:e.slug,shown:''})));}}
      if(exact.childElementCount)chips.after(exact);
    }
  }
  async function ensureText() {
    if(textIndex)return;
    if(!textPromise)textPromise=fetch(new URL('../site_export/data/search_text.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Text search unavailable');return r.json();}).then(data=>textIndex=data).catch(error=>{textPromise=null;throw error;});
    return textPromise;
  }
  function apply({preserve=false}={}) {
    collectionViews.decorateCatalog(values());
    state.hasActiveQuery=true;document.body.classList.add('search-open', 'catalog-page');els.archive.classList.add('is-expanded');
    if(!preserve)state.visible=36;
    if(extra.text==='1' && !textIndex){
      els.archiveCount.textContent='Loading article text…';els.results.replaceChildren(node('p','Loading the optional article-text index. This is downloaded only when requested.'));
      ensureText().then(()=>{if(extra.text==='1')apply({preserve:true});}).catch(()=>{els.results.replaceChildren(node('p','Article text could not load. Try again or turn off “Search article text” to use the catalog.'));});return;
    }
    state.filtered=h.sortRecords(state.records.filter(r=>matches(r)));
    els.archive.querySelector(".catalog-tabs")?.replaceWith(tabs("articles",values()));
    h.updateSortButtons();h.renderShakespeareNav();renderChips();render();
  }
  function render() {
    if(!document.body.classList.contains('search-open')){els.results.replaceChildren();return;}
    const total=state.filtered.length, shown=Math.min(state.visible,total);
    els.archiveCount.classList.remove('is-searching');els.archiveCount.textContent=total ? `Showing 1–${shown.toLocaleString()} of ${total.toLocaleString()} articles`:'No matching articles';
    const context={contextLabel:'catalog results',backHref:href(),records:state.filtered,query:state.query,titleFirst:h.FEATURES.compactResults || Boolean(state.query.trim()),visibleCount:state.visible};
    const fragment=document.createDocumentFragment();
    if(!total){const empty=node('div',undefined,'catalog-empty');empty.append(node('h2','No articles match these choices'),node('p',extra.text==='1'?'Try a shorter phrase or remove a filter.':'Search covers titles, works, credited people and places. Try fewer words, remove a filter, or include article text.'),button('Clear filters and browse all articles',clear));fragment.append(empty);}
    state.filtered.slice(0,shown).forEach(record=>{
      const card=h.safeResultCard(record,context);card.id='result-'+record.slug;
      if(extra.text==='1' && state.query && !h.recordMatchesQuery(record,state.query)){
        const source=textIndex[record.slug]||'', terms=state.query.trim(), pos=source.toLowerCase().indexOf(terms.toLowerCase());
        const excerpt=node('span',`In article text: …${source.slice(Math.max(0,pos-65),Math.max(0,pos)+180).replace(/\s+/g,' ')}…`,'text-match');card.append(excerpt);
      }
      fragment.append(card);
    });
    if(shown<total)fragment.append(button(`Show next ${Math.min(36,total-shown)} articles (${(total-shown).toLocaleString()} remaining)`,()=>{const old=shown;state.visible+=36;history.replaceState(null,'',href());render();els.results.querySelectorAll('.result-card')[old]?.focus({preventScroll:true});},'load-more'));
    els.results.replaceChildren(fragment);
    if(state.pendingArchiveRestore){state.visible=Math.max(state.visible,state.pendingArchiveRestore.visibleCount||36,(state.pendingArchiveRestore.index||0)+1);h.restoreArchivePositionIfNeeded();}
  }
  function clear(){setValues({});apply();history.replaceState(null,'',href());els.searchInput.focus({preventScroll:true});}
  function selectField(labelText,key,options,parent,emptyLabel='All') {
    const label=node('label');label.append(node('span',labelText));const input=node('select');input.dataset.catalogFilter=key;input.append(new Option(emptyLabel,''));options.forEach(item=>input.append(new Option(typeof item==='string'?item:item[1],typeof item==='string'?item:item[0])));input.addEventListener('change',()=>{extra[key]=input.value;apply();history.replaceState(null,'',href());});label.append(input);parent.append(label);return input;
  }
  function install() {
    const header = document.querySelector('.site-header');
    const measureHeader = () => document.documentElement.style.setProperty('--catalog-header-height', header.getBoundingClientRect().height + 'px');
    new ResizeObserver(measureHeader).observe(header); measureHeader();
    const back = link('Back to home', '#home', 'back-link catalog-back'); els.archive.prepend(back);
    els.archive.querySelector('h1').textContent=h.FEATURES.modernCatalogPresentation?'Catalog':'Search the Archive';els.searchInput.setAttribute('aria-label','Search titles, works, people and places');els.searchInput.placeholder='Title, work, person or place';
    els.archive.querySelector('.archive-heading').after(tabs());
    const scope=node('div',undefined,'search-scope');const label=node('label');const check=node('input');check.type='checkbox';check.id='searchArticleText';check.addEventListener('change',()=>{extra.text=check.checked?'1':'';apply();history.replaceState(null,'',href());});label.append(check,document.createTextNode(' Search article text'));scope.append(els.archiveCount,label);els.archive.querySelector('.search-panel').append(scope);
    els.archive.querySelector('.search-label-row').remove();
    const panel = els.archive.querySelector('.search-panel');
    const form = node('form', undefined, 'archive-search-form'); form.setAttribute('role', 'search');
    const row = node('div', undefined, 'search-submit-row');
    const submit = node('button', 'Search', 'primary-action'); submit.type = 'submit';
    row.append(panel.querySelector('.search-field'), submit); form.append(row); panel.prepend(form);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const query = els.searchInput.value.trim();
      if (query !== state.query) state.sort = query ? 'relevance' : 'newest';
      state.query = query; apply(); history.replaceState(null, '', href());
    });
    const disclosure = node('details', undefined, 'advanced-search');
    const summary = node('summary', 'Advanced search'); disclosure.append(summary);
    els.filterToggle.hidden = true; els.filterControls.before(disclosure); disclosure.append(els.filterControls);
    const grid=node('div',undefined,'catalog-filter-grid');
    for(const [labelText,key] of [['From year','from'],['To year','to']]){const label=node('label');label.append(node('span',labelText));const input=node('input');input.type='number';input.min='1963';input.max='2026';input.placeholder=key==='from'?'1963':'2026';input.dataset.catalogFilter=key;input.addEventListener('change',()=>{extra[key]=input.value;apply();history.replaceState(null,'',href());});label.append(input);grid.append(label);}
    selectField('Publication','publication',[...new Set(state.records.map(h.articlePublicationLabel))].sort(),grid,'All publications');
    selectField('Subject','subject',[...new Set(state.records.map(r=>articleSubject(r.article_category)))].sort(),grid,'All subjects');
    selectField('Form','form',[...new Set(state.records.map(r=>articleForm(r.article_category)))].sort(),grid,'All forms');
    els.filterControls.prepend(grid);
    const advanced=node('div',undefined,'catalog-filter-grid');
    const categoryLabel=els.typeFilter.parentElement;categoryLabel.querySelector('span').classList.remove('visually-hidden');categoryLabel.querySelector('span').textContent='Original category';els.typeFilter.setAttribute('aria-label','Original category');advanced.append(categoryLabel);
    for(const [labelText,key,type] of [['Company','company','companies'],['City','city','cities'],['Venue','venue','venues'],['Person','person','people']]){
      const label=node('label');label.append(node('span',labelText));const input=node('input');input.type='search';input.placeholder=`Enter exact ${labelText.toLowerCase()} name`;input.dataset.catalogFilter=key;input.setAttribute('list',`choices-${key}`);const list=node('datalist');list.id=`choices-${key}`;
      let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{const entries=[...h.entityMap(type).values()].filter(e=>nameMatches(e.label,input.value)).slice(0,40);list.replaceChildren(...entries.map(e=>new Option(e.label)));},100);});input.addEventListener('change',()=>{extra[key]=input.value;apply();history.replaceState(null,'',href());});label.append(input,list);advanced.append(label);
    }
    selectField('Person’s role','role',h.MASTER_INDEX_PEOPLE_FILTERS.filter(f=>f.key!=='all-people').map(f=>[f.typeKeys[0],f.label]),advanced,'All roles');
    selectField('Surviving source','completeness',[['partial','Incomplete surviving source'],['complete','No recorded source gaps']],advanced,'All sources');els.filterControls.append(advanced);
    const chips=node('div',undefined,'active-filters');chips.id='activeFilters';chips.setAttribute('aria-label','Active filters');els.results.before(chips);
    const shortcuts=node('nav',undefined,'catalog-discovery');shortcuts.setAttribute('aria-label','Explore the catalog');shortcuts.append(link('Map','#map'),link('Timeline','#timeline'),link('Guided explorer','#explore'),link('Correspondence','#correspondence'));els.archive.append(shortcuts);
  }
  const collectionViews = createCollectionViews({state, els, h, node, link, button, openIndex, getCollections});
  function showCatalog(v) {
    if(v.collection==='Current Collection')v={...v,collection:'Recent Collection'};
    document.body.classList.add('catalog-page');
    els.archive.hidden=false;
    setValues(v);
    history.replaceState(null,"",href());
    state.pendingArchiveRestore=h.archiveRestoreForHash(href());
    const restoring=Boolean(state.pendingArchiveRestore);
    if(state.pendingArchiveRestore)state.visible=Math.max(state.visible,state.pendingArchiveRestore.visibleCount||36,(state.pendingArchiveRestore.index||0)+1);
    els.archive.querySelector('.catalog-tabs').replaceWith(tabs('articles',values()));
    apply({preserve:true});
    const back = els.archive.querySelector('.catalog-back'); back.href = '#home'; back.textContent = 'Back to home';
    if(v.origin && /^#(people|works|places|index:|master-index|map|timeline|explore|collection:)/.test(v.origin)) {
      back.href = v.origin; back.textContent = 'Back to ' + (v.origin.startsWith('#people') ? 'people index' : v.origin.startsWith('#works') ? 'works index' : 'browse view');
    }
    if(v.entityType && v.entity){const a=link('See all coverage of this entry',serialize({entityType:v.entityType,entity:v.entity}),'scope-expand');els.results.before(a);}
    if(!restoring)requestAnimationFrame(()=>{window.scrollTo(0,0);focusHeading(els.archive);});
  }
  function indexPage(mode, params = new URLSearchParams(), type = '') {
    const people = mode === 'people', works = mode === 'works';
    const filters = people ? h.MASTER_INDEX_PEOPLE_FILTERS : h.MASTER_INDEX_WORK_FILTERS;
    let filterKey = params.get(people ? 'role' : 'kind') || (people ? 'all-people' : 'all-works');
    if (!filters.some(f => f.key === filterKey)) filterKey = people ? 'all-people' : 'all-works';
    const cacheKey = people || works ? 'master:' + filterKey : 'entity:' + type;
    if (!indexCache.has(cacheKey)) indexCache.set(cacheKey, people || works
      ? h.masterIndexEntries(h.masterIndexFilter(filterKey))
      : [...h.entityMap(type).values()].map(e => ({...e, typeKey: type})));
    const scope = parse('#archive?' + params);
    for (const key of ['q', 'role', 'shown', 'origin', 'entity', 'entityType']) delete scope[key];
    const rawEntries = type === 'venues'
      ? h.venueMapPoints().map(p => ({...p, label: p.label + (p.city ? ' — ' + p.city : ' — city not recorded'), venue: p.label, typeKey: 'venues'}))
      : indexCache.get(cacheKey);
    const entries = rawEntries.map(e => ({...e, records: e.records.filter(r => matches(r, scope))})).filter(e => e.records.length);
    const base = people ? '#people' : works ? '#works' : `#index:${type}`;
    let query = params.get('q') || '', letter = params.get('letter') || '', order = indexOrder(type, params.get('order'));
    const active = people ? 'people' : works ? 'works' : type === 'publications' ? 'publications' : 'places';
    openIndex(people ? 'People' : works ? 'Works' : h.entityType(type)?.label || 'Places', active);
    els.indexContent.querySelector('.catalog-tabs').replaceWith(tabs(active, scope));
    if (Object.entries(scope).some(([key, value]) => value && key !== 'sort')) {
      const info = node('p', undefined, 'index-scope');
      info.append(document.createTextNode('Within your selected catalog filters. '), link('Review filters', serialize(scope)), document.createTextNode(' · '), link('Show the full index', base));
      els.indexContent.append(info);
    }
    els.indexView.classList.add('directory-page');
    const controls = node('div', undefined, 'index-controls' + (people || works ? '' : ' index-controls-two'));
    const label = node('label'); label.append(node('span', people ? 'Find a person' : 'Find an entry'));
    const search = node('input'); search.type = 'search'; search.value = query;
    search.placeholder = people ? 'Search for a person' : 'Search this index'; label.append(search); controls.append(label);
    function indexHref(targetLetter = letter) {
      const p = new URLSearchParams(serialize(scope).split('?')[1] || '');
      if (query) p.set('q', query);
      if (targetLetter && order === 'alpha') p.set('letter', targetLetter);
      p.set('order', order);
      if (people || works) p.set(people ? 'role' : 'kind', filterKey);
      return base + '?' + p;
    }
    const updateUrl = () => history.replaceState(null, '', indexHref());
    if (people || works) {
      const field = node('label'); field.append(node('span', people ? 'Role' : 'Kind of work'));
      const select = node('select'); filters.forEach(f => select.append(new Option(f.label, f.key))); select.value = filterKey;
      select.addEventListener('change', () => {
        filterKey = select.value; letter = ''; updateUrl();
        indexResizeObserver?.disconnect();
        indexPage(mode, new URLSearchParams(indexHref().split('?')[1]), type);
        requestAnimationFrame(() => els.indexContent.querySelector('.index-controls select')?.focus({preventScroll: true}));
      });
      field.append(select); controls.append(field);
    }
    const sortLabel = node('label'); sortLabel.append(node('span', 'Order'));
    const sort = node('select'); sort.append(new Option('Browse A–Z', 'alpha'), new Option('Most covered', 'coverage')); sort.value = order;
    sort.addEventListener('change', () => { order = sort.value; letter = ''; updateUrl(); draw(); });
    sortLabel.append(sort); controls.append(sortLabel);
    const alpha = node('nav', undefined, 'index-alphabet'); alpha.setAttribute('aria-label', 'Jump to a letter');
    const count = node('p', undefined, 'index-count'); count.setAttribute('aria-live', 'polite');
    const list = node('div', undefined, 'index-entries');
    const sections = new Map();
    const sortText = entry => h.indexSortText(entry.label, entry.typeKey);
    function jump(targetLetter) {
      const heading = sections.get(targetLetter);
      if (!heading) return;
      letter = targetLetter; updateUrl();
      alpha.querySelectorAll('a').forEach(a => {
        a.href = indexHref(a.dataset.letter);
        if (a.dataset.letter === letter) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      heading.scrollIntoView({block: 'start'}); heading.focus({preventScroll: true});
    }
    function entryLink(entry) {
      const entryScope = {...scope, entityType: entry.typeKey, entity: entry.slug, origin: window.location.hash};
      if (entry.venue) { entryScope.venue = entry.venue; entryScope.city = entry.city || '__unspecified__'; }
      if (works) entryScope.indexScope = filterKey;
      if (people && filterKey !== 'all-people') { entryScope.person = entry.label; entryScope.role = entry.typeKey; }
      const a = link('', serialize(entryScope));
      a.append(node('span', h.indexDisplayLabel(entry.typeKey, entry.label)));
      if (entry.records.length > 1) a.append(node('em', `${entry.records.length.toLocaleString()} articles`));
      return a;
    }
    // Keep the return link's letter bookmark current without rebuilding thousands of rows.
    const prepareLink = event => {
      const a = event.target.closest('.catalog-index-list a, .publication-cards a');
      if (a) a.href = serialize({...parse(a.hash), origin: window.location.hash});
    };
    ['pointerdown', 'focusin', 'click', 'auxclick'].forEach(event => list.addEventListener(event, prepareLink));
    function draw() {
      const found = indexEntries(entries, query, order, sortText);
      count.textContent = `${found.length.toLocaleString()} ${people ? 'people' : works ? 'works' : 'entries'}`;
      sections.clear(); list.replaceChildren(); alpha.replaceChildren(); alpha.hidden = order !== 'alpha' || type === 'publications';
      if (order === 'alpha' && type !== 'publications') {
        for (const [initial, grouped] of indexSections(found, sortText)) {
          const section = node('section', undefined, 'index-letter-section');
          const heading = node('h2', initial); heading.id = 'index-letter-' + (initial === '#' ? 'other' : initial === '0–9' ? 'numbers' : initial.toLowerCase()); heading.tabIndex = -1;
          section.setAttribute('aria-labelledby', heading.id); sections.set(initial, heading);
          const rows = node('div', undefined, 'catalog-index-list'); rows.append(...grouped.map(entryLink));
          section.append(heading, rows); list.append(section);
        }
        for (const initial of INDEX_LETTERS) {
          if (initial === '#' && !sections.has(initial)) continue;
          if (!sections.has(initial)) { const unavailable = node('span', initial); unavailable.setAttribute('aria-disabled', 'true'); alpha.append(unavailable); continue; }
          const a = link(initial, indexHref(initial)); a.dataset.letter = initial;
          a.setAttribute('aria-label', 'Jump to ' + initial);
          if (letter === initial) a.setAttribute('aria-current', 'location');
          a.addEventListener('click', event => {
            if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); jump(initial);
          });
          alpha.append(a);
        }
      } else if (type === 'publications') {
        const featured = found.filter(e => e.records.length >= 5);
        const other = found.filter(e => e.records.length < 5);
        const cards = node('div', undefined, 'publication-cards');
        for (const entry of featured) {
          const a = entryLink(entry);
          const asset = state.collectionCuration?.publications?.[entry.slug];
          if (asset?.src) {
            const img = node('img');
            img.src = asset.src; img.alt = entry.label; img.loading = 'lazy';
            const title = a.querySelector('span');
            if (title) title.hidden = true;
            img.addEventListener('error', () => {
              img.remove();
              if (title) title.hidden = false;
            }, {once: true});
            a.prepend(img);
          }
          a.classList.add('publication-card');cards.append(a);
        }
        list.append(cards);
        if(other.length){list.append(node('h2','Other publications'));const rows=node('div',undefined,'catalog-index-list');rows.append(...other.map(entryLink));list.append(rows);}
      } else {
        const rows = node('div', undefined, 'catalog-index-list'); rows.append(...found.map(entryLink)); list.append(rows);
      }
      if (!found.length) list.append(node('p', 'No entries match. Try part of a name or change the filters.'));
    }
    search.addEventListener('input', () => { query = search.value; letter = ''; updateUrl(); draw(); });
    els.indexContent.append(controls, count, alpha, list); updateUrl(); draw();
    const measureAlphabet = () => els.indexContent.style.setProperty('--index-alphabet-height', alpha.getBoundingClientRect().height + 'px');
    indexResizeObserver = new ResizeObserver(measureAlphabet); indexResizeObserver.observe(alpha);
    requestAnimationFrame(() => { measureAlphabet(); if (letter && order === 'alpha') jump(letter); });
  }
  function home(){
    h.renderCurrentFeature();h.renderTiles('types');
    const feature=els.currentFeature;
    const lede=document.querySelector('#home .lede');lede.textContent=`Robert Cushman’s theatre and arts writing, 1963–2026. Explore ${state.records.length.toLocaleString()} articles from a lifetime of looking closely and writing clearly.`;
    const paths=node('nav',undefined,'home-starts');paths.setAttribute('aria-label','Start exploring');[['Browse all articles','#archive'],['Find a work','#works'],['Find a person','#people'],['Browse collections','#section:collections']].forEach(([text,url])=>paths.append(link(text,url)));
    const form=node('form',undefined,'home-search');form.setAttribute('role','search');const input=node('input');input.type='search';input.setAttribute('aria-label','Search the catalog');input.placeholder='Search titles, works, people and places';const submit=node('button','Search');submit.type='submit';form.append(input,submit);form.addEventListener('submit',event=>{event.preventDefault();window.location.hash=serialize({q:input.value});});
    els.frontpageDirectory.replaceChildren(form,paths);
    document.querySelector('#homeMap')?.setAttribute('hidden','');
  }
  function collections(){
    openIndex('Collections','');els.indexContent.append(node('p','Collections are overlapping routes through the same archive. One article can appear in several collections; counts always refer to articles.','landing-intro'));
    const descriptions={'The Shakespeare Collection':'Reviews of Shakespeare productions, critical essays and adaptations.','The Canadian Collection':'Writing about theatre and the arts in Canada.','UK Collection':'British theatre and arts writing, including the early Observer years.','The Stratford Collection':'Coverage of the Stratford Festival and its productions.','The Shaw Collection':'Coverage of the Shaw Festival and its productions.','Recent Collection':'Writing published for Cushman Collected.'};
    const list=node('div',undefined,'collection-cards');h.PUBLIC_COLLECTION_FILTERS.forEach(item=>{const name=typeof item==='string'?item:item.value;if(!name)return;const records=state.records.filter(r=>name===h.SHAKESPEARE_COLLECTION?h.isExplicitShakespeareRecord(r):h.collectionNames(r).includes(name));if(!records.length)return;const a=link('',serialize({collection:name}));a.append(node('h2',name.replace(/^The /,'')),node('p',descriptions[name]||'A curated route through related writing in the archive.'),node('strong',`${records.length.toLocaleString()} articles`));list.append(a);});els.indexContent.append(list);
  }
  function timeline(params) {
    openIndex('Timeline', '');
    const dated = new Map(), undated = [];
    for (const record of state.records) {
      const key = publicationYear(record);
      if (!key) { undated.push(record); continue; }
      if (!dated.has(key)) dated.set(key, []);
      dated.get(key).push(record);
    }
    const available = [...dated.keys()].sort();
    const years = available.length ? Array.from({length: Number(available.at(-1)) - Number(available[0]) + 1}, (_, i) => String(Number(available[0]) + i)) : [];
    let year = params.get('year') || years.at(-1) || 'undated';
    if (!years.includes(year) && year !== 'undated') year = years.at(-1) || 'undated';
    let shown = Math.max(36, Number(params.get('shown')) || 36);
    els.indexContent.append(node('p', 'Choose a year’s bar to browse its articles. Taller bars mean more articles; years with no articles remain visible as gaps.', 'landing-intro'));
    const selected = node('div', undefined, 'timeline-selected-year'); selected.setAttribute('aria-live', 'polite');
    const rail = node('div', undefined, 'timeline-rail timeline-bar-chart');
    rail.setAttribute('role', 'region'); rail.setAttribute('aria-label', 'Articles by year');
    const track = node('div', undefined, 'timeline-track'); track.style.setProperty('--year-count', years.length);
    const bars = new Map(), max = Math.max(1, ...[...dated.values()].map(records => records.length));
    const result = node('div', undefined, 'results timeline-results');
    const choose = value => { year = value; shown = 36; draw(); };
    for (const key of years) {
      const count = dated.get(key)?.length || 0;
      const bar = button('', () => choose(key), 'timeline-segment');
      bar.dataset.year = key; bar.title = `${key}: ${count.toLocaleString()} ${count === 1 ? 'article' : 'articles'}`;
      bar.setAttribute('aria-label', bar.title); bar.setAttribute('aria-controls', 'timelineResults');
      const ink = node('span', undefined, 'timeline-bar-ink'); ink.style.height = (count ? Math.max(3, count / max * 140) : 0) + 'px'; ink.setAttribute('aria-hidden', 'true');
      bar.append(ink, node('span', key, 'timeline-bar-year'));
      bar.addEventListener('keydown', event => {
        const index = years.indexOf(key);
        const target = event.key === 'ArrowLeft' ? Math.max(0, index - 1) : event.key === 'ArrowRight' ? Math.min(years.length - 1, index + 1) : event.key === 'Home' ? 0 : event.key === 'End' ? years.length - 1 : -1;
        if (target < 0) return;
        event.preventDefault(); choose(years[target]); bars.get(years[target]).focus({preventScroll: true}); revealBar();
      });
      bars.set(key, bar); track.append(bar);
    }
    rail.append(track);
    const controls = node('div', undefined, 'timeline-year-controls');
    const move = step => { choose(years[Math.max(0, Math.min(years.length - 1, years.indexOf(year) + step))]); revealBar(); };
    const prev = button('Previous year', () => move(-1)), next = button('Next year', () => move(1)); controls.append(prev, next);
    const undatedButton = button(`Undated writing (${undated.length})`, () => choose('undated'));
    if (undated.length) controls.append(undatedButton);
    function revealBar() {
      const bar = bars.get(year); if (!bar) return;
      const left = bar.offsetLeft, right = left + bar.offsetWidth;
      if (left < rail.scrollLeft) rail.scrollLeft = left;
      else if (right > rail.scrollLeft + rail.clientWidth) rail.scrollLeft = right - rail.clientWidth;
    }
    function draw() {
      history.replaceState(null, '', `#timeline?year=${year}${shown > 36 ? '&shown=' + shown : ''}`);
      const records = h.sortRecordsChronologically(year === 'undated' ? undated : dated.get(year) || []);
      selected.replaceChildren(node('span', year === 'undated' ? 'Date not recorded' : 'Selected year'), node('strong', year === 'undated' ? 'Undated' : year), node('em', `${records.length.toLocaleString()} ${records.length === 1 ? 'article' : 'articles'}`));
      for (const [key, bar] of bars) {
        bar.classList.toggle('is-active', key === year); bar.setAttribute('aria-pressed', String(key === year));
        bar.tabIndex = key === year || (year === 'undated' && key === years[0]) ? 0 : -1;
      }
      undatedButton.setAttribute('aria-pressed', String(year === 'undated'));
      result.replaceChildren(node('h2', year === 'undated' ? 'Undated writing' : `Articles from ${year}`));
      result.id = 'timelineResults';
      if (year !== 'undated') result.append(link('Search and filter this year', serialize({from: year, to: year, origin: window.location.hash})));
      const ctx = {records, backHref: window.location.hash, contextLabel: year, titleFirst: h.FEATURES.compactResults, visibleCount: shown};
      result.append(...records.slice(0, shown).map(r => h.safeResultCard(r, ctx)));
      if (!records.length) result.append(node('p', 'No articles from this year are currently in the catalog.'));
      if (shown < records.length) result.append(button(`Show more (${records.length - shown} remaining)`, () => { shown += 36; draw(); }, 'load-more'));
      prev.disabled = !years.length || year === years[0]; next.disabled = !years.length || year === years.at(-1) || year === 'undated';
    }
    els.indexContent.append(selected, rail, controls, result); draw();
    requestAnimationFrame(revealBar);
  }
  function explorer(params){
    openIndex('Guided explorer','');els.indexContent.append(node('p','Choose any combination below. Every matching article is available in the catalog, and this path can be bookmarked.','landing-intro'));
    let v=parse('#explore?'+params);const controls=node('div',undefined,'catalog-filter-grid');const count=node('p',undefined,'index-count');const all=link('View all matching articles','#archive','primary-action');const preview=node('div',undefined,'results');
    const draw=()=>{const records=state.records.filter(r=>matches(r,v));history.replaceState(null,'',serialize(v,'#explore'));count.textContent=`${records.length.toLocaleString()} matching articles · showing ${Math.min(18,records.length)} below`;all.href=serialize({...v,origin:window.location.hash});all.textContent=`View all ${records.length.toLocaleString()} matching articles`;preview.replaceChildren(...h.sortRecords(records).slice(0,18).map(r=>h.safeResultCard(r,{records,backHref:window.location.hash,contextLabel:'guided explorer',titleFirst:h.FEATURES.compactResults})));};
    for(const [labelText,key,options] of [['Subject','subject',[...new Set(state.records.map(r=>articleSubject(r.article_category)))].sort()],['Collection','collection',h.PUBLIC_COLLECTION_FILTERS.map(x=>typeof x==='string'?x:x.value)],['Publication','publication',[...new Set(state.records.map(h.articlePublicationLabel))].sort()],['Year','from',[...new Set(state.records.map(publicationYear))].filter(Boolean).sort()]]){
      const label=node('label');label.append(node('span',labelText));const select=node('select');select.append(new Option('All',''));options.filter(Boolean).forEach(x=>select.append(new Option(x,x)));select.value=v[key]||'';select.addEventListener('change',()=>{v[key]=select.value;if(key==='from')v.to=select.value;draw();});label.append(select);controls.append(label);
    }
    const search=node('input');search.type='search';search.placeholder='Work, person, company or city';search.setAttribute('aria-label','Search within the selected path');search.value=v.q||'';search.addEventListener('input',()=>{v.q=search.value;draw();});controls.append(search);els.indexContent.append(controls,count,all,preview);draw();
  }
  function unavailable(){openIndex('Page unavailable','');els.indexContent.append(node('p','This link does not match a page in the archive.'),link('Browse the catalog','#archive'));}
  function route(hash) {
    indexResizeObserver?.disconnect();
    placesMap?.remove(); placesMap=null; collectionViews.dispose();
    document.querySelectorAll('.observer-farewell-feature, .observer-farewell-section').forEach(n=>n.remove());
    document.querySelectorAll('.scope-expand').forEach(n=>n.remove());document.querySelector('#catalogOrigin')?.remove();document.querySelector('#exactMatches')?.remove();
    const [base,qs]=hash.split('?'),params=new URLSearchParams(qs||'');
    if(base==='#image-credits'){collectionViews.credits();return true;}
    if(base==='#archive'||base==='#search'){showCatalog(parse(hash));return true;}
    if(base==='#home'){document.querySelector('.advanced-search').open=false;requestAnimationFrame(()=>window.scrollTo(0,0));if(h.FEATURES.redesignedHome)home();else {els.archive.hidden=false;setValues({});h.renderClassicHome();state.hasActiveQuery=false;els.results.replaceChildren();els.archiveCount.textContent=`${state.records.length.toLocaleString()} articles`;els.archive.classList.remove('is-expanded');}return true;}
    if(base==='#people'||base==='#works'){indexPage(base.slice(1),params);return true;}
    if(base==='#master-index'||base.startsWith('#master-index:')){const key=base.split(':')[1]||'plays',people=h.MASTER_INDEX_PEOPLE_FILTERS.some(f=>f.key===key);params.set(people?'role':'kind',key);indexPage(people?'people':'works',params);return true;}
    if(base==='#places'){
      openIndex('Places','places');
      const paths=node('div',undefined,'places-paths');paths.append(link('Browse cities','#index:cities','primary-action'),link('Browse venues','#index:venues','primary-action'));
      const map=node('div',undefined,'places-map');map.setAttribute('aria-label','Archive places map');
      els.indexContent.append(paths,map,link('View the full map →','#map','larger-map-link'));
      h.loadMapResources().then(()=>{if(map.isConnected)placesMap=h.renderArchiveMap(map,h.cityMapPoints(),{venues:h.venueMapPoints(),maxVenues:Infinity,initialCenter:matchMedia('(max-width:600px)').matches?[43.6532,-79.3832]:[50,-35],initialZoom:matchMedia('(max-width:600px)').matches?13:3,zoomControl:true,searchControl:false,jumpControl:true,venueZoomThreshold:9});}).catch(()=>{if(map.isConnected)map.replaceChildren(node('p','The map could not load. You can still browse every city and venue using the links above.'));});
      return true;
    }
    if(base.startsWith('#index:')){const type=base.split(':')[1];if(!h.entityType(type)){unavailable();return true;}if(type==='people'){indexPage('people',params);return true;}if(type==='productions'){indexPage('works',params);return true;}indexPage('entities',params,type);return true;}
    if(base.startsWith('#entity:')){const [,type,slug]=base.split(':');if(!h.entityType(type)||!h.entityMap(type).has(slug)){unavailable();return true;}const v=parse(hash);showCatalog({...v,entityType:type,entity:slug});if(type==='publications'&&slug==='the-observer'){const feature=h.observerFarewellFeature?.();if(feature)els.results.before(feature);}return true;}
    if(base==='#section:chronology'){timeline(params);return true;}
    if(base==='#timeline'){timeline(params);return true;}
    if(base==='#explore'){explorer(params);return true;}
    if(base==='#section:shakespeare'||base==='#collection:shakespeare'){openIndex('Shakespeare','');h.renderLandingPage('shakespeare');els.indexContent.prepend(tabs());collectionViews.frame();return true;}
    if(base==='#section:collections'){collectionViews.directory();return true;}
    if(base.startsWith('#collection:')||base.startsWith('#browse-collection:')){const id=base.split(':')[1]==='musical'?'musicals':base.split(':')[1];if(getCollections().has(id)&&id!=='shakespeare'){collectionViews.show(id,params);return true;}}
    if(!h.FEATURES.modernBrowseLandings && ['#section:collections','#section:browse','#section:indexes','#section:current','#current'].includes(base)){
      document.body.classList.add('index-open');els.indexView.hidden=false;
      els.indexView.querySelector(':scope > .back-link').href='#home';els.indexView.querySelector(':scope > .back-link').textContent='Back to home';
      h.renderLandingPage(base==='#current'?'current':base.split(':')[1]);
      requestAnimationFrame(()=>{window.scrollTo(0,0);focusHeading();});return true;
    }
    if(base==='#section:collections'){collections();return true;}
    if(base==='#section:current'||base==='#current'){showCatalog({collection:'Recent Collection'});els.archive.querySelector('h1').textContent='Latest writing';return true;}
    if(base.startsWith('#collection:')||base.startsWith('#browse-collection:')){const collection=h.collectionFromSlug(base.split(':')[1]);if(!collection)unavailable();else showCatalog({collection,group:params.get('group')||''});return true;}
    if(base.startsWith('#browse-group:')){showCatalog({type:base.split(':')[1]});return true;}
    if(base==='#section:browse'||base==='#section:indexes'||base.startsWith('#browse:')){showCatalog({});return true;}
    return false;
  }
  return {install,route,apply,render,href,clear,values,matches,unavailable,getCollections};
}
