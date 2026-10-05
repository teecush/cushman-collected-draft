import {isSondheimFrogs} from './play-authorship.js?v=250';
import {normalize, publicationYear} from './catalog-engine.js?v=250';
export const COLLECTIONS = [
  {id:'recent',title:'Recent Collection',kind:'recent',href:'#collection:recent',intro:'Recent writing published for Cushman Collected.'},
  {id:'shakespeare',title:'Shakespeare Collection',kind:'plays',href:'#section:shakespeare',intro:'The plays, the productions, and a lifetime of returning to Shakespeare.'},
  {id:'sondheim',title:'Sondheim Collection',kind:'musicals',intro:'The musicals, the lyrics, and the art of Stephen Sondheim.'},
  {id:'stoppard',title:'Stoppard Collection',kind:'plays',intro:'Reviews and writing about the plays of Tom Stoppard.'},
  {id:'musicals',title:'Musicals Collection',kind:'musicals',intro:'Return to a favourite show, or discover one you have never seen.'},
  {id:'stratford',title:'Stratford Collection',kind:'festival',intro:'Explore the Stratford Festival, theatre by theatre and season by season.'},
  {id:'shaw',title:'Shaw Collection',kind:'festival',intro:'Explore the Shaw Festival, theatre by theatre and season by season.'},
  {id:'television',title:'TV Reviews Collection',kind:'television',intro:'Small screens, big stories. Browse the shows Robert wrote about.'},
  {id:'albums',title:'Music Reviews Collection',kind:'albums',intro:'Recordings, singers, and the songs worth listening to again.'},
  {id:'books',title:'Book Reviews Collection',kind:'books',intro:'A shelf of books about the people and ideas behind the arts.'},
  {id:'profiles',title:'Artist Profiles Collection',kind:'portraits',intro:'The artists behind the work, in profiles and remembrances.'},
  {id:'early',title:'Early Writing Collection',kind:'early',intro:'The beginning: writing published from 1963 through 1966.'},
];
export const SONDHEIM_SHOWS = ['West Side Story','Gypsy','A Funny Thing Happened on the Way to the Forum','Anyone Can Whistle','Do I Hear a Waltz?','Company','Follies','A Little Night Music','The Frogs','Pacific Overtures','Side by Side by Sondheim','Sweeney Todd','Merrily We Roll Along','Marry Me a Little','Sunday in the Park with George','Into the Woods','Assassins','Passion','Saturday Night','Putting It Together','Bounce','Road Show','Sondheim on Sondheim','Old Friends','Here We Are'];
export const STOPPARD_PLAYS = ['Rosencrantz and Guildenstern Are Dead','The Real Inspector Hound','Jumpers','Travesties','Every Good Boy Deserves Favour','The Real Thing','Arcadia','Indian Ink','The Invention of Love','The Coast of Utopia',"Rock 'n' Roll",'Heroes','The Hard Problem','Leopoldstadt'];
export const workKey = value => normalize(value)==='the passion'?'the passion':normalize(value).replace(/^(the|a|an) /,'').replace(/^sweeney todd(?::| the demon barber of fleet street).*$/, 'sweeney todd');
export function spotlightRecord(records, date = new Date()) {
  records = records.filter(record => !record.authorship_note && record.author !== "Unknown");
  if (!records.length) return null;
  const day = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
  const anniversary = records.filter(record => !record.date_is_estimated && record.date?.slice(5) === day.slice(5) && record.date.slice(0,4) < day.slice(0,4) && (!record.date_precision || record.date_precision === 'day'));
  if (!anniversary.length) return null;
  // Rotate among matching dates each year, independent of catalog ordering.
  const sorted = anniversary.sort((a,b)=>a.slug.localeCompare(b.slug));
  return sorted[Number(day.slice(0,4)) % sorted.length];
}
export function makeCollections(records, h, curation = {}) {
  const overrides = curation.records || {};
  const aliases=new Map(Object.entries(curation.workAliases||{}).map(([a,b])=>[workKey(a),b]));
  const titleFor=value=>aliases.get(workKey(value))||value;
  const excluded=new Set((curation.excludedMusicalTitles||[]).map(workKey));
  const shows = new Map(SONDHEIM_SHOWS.map(title=>[workKey(title),title]));
  const stoppardPlays = new Map(STOPPARD_PLAYS.map(title=>[workKey(title),title]));
  const musicalTitles = new Set(records.filter(r=>r.article_category==='Musical Review').flatMap(r=>h.entityValues(r,'productions')).map(titleFor).map(workKey).filter(key=>!excluded.has(key)));
  const workValues = record => h.entityValues(record,'productions').map(titleFor);
  const sonTitles = record => workValues(record).map(title=>shows.get(workKey(title)) || (/^sweeney todd\b/.test(workKey(title))?'Sweeney Todd':'')).filter(Boolean);
  const definitions = new Map(COLLECTIONS.map(c=>[c.id,{...c,records:[],items:[],ungrouped:[]}]));
  const itemMaps = new Map(COLLECTIONS.map(c=>[c.id,new Map()]));
  function add(id, record, titles) {
    const collection=definitions.get(id);collection.records.push(record);
    if (!titles.length) {collection.ungrouped.push(record);return;}
    for (const raw of [...new Set(titles)]) {
      const title=String(raw).trim();if(!title)continue;
      const key=workKey(title), map=itemMaps.get(id);
      const item=map.get(key)||{id:key.replaceAll(' ','-'),title,records:[]};
      if(!item.records.some(r=>r.slug===record.slug))item.records.push(record);
      map.set(key,item);
    }
  }
  for (const record of records) {
    const fix=overrides[record.slug]||{}, names=h.collectionNames(record);
    const year=Number(publicationYear(record));
    if(names.includes('Recent Collection')||names.includes('Current Collection'))add('recent',record,[]);
    if(year>=1963&&year<=1966)add('early',record,[]);
    if(h.isExplicitShakespeareRecord(record))add('shakespeare',record,[]);
    const sondheimFrogs=isSondheimFrogs(record);
    const son=sonTitles(record).filter(title=>title!=='The Frogs'||sondheimFrogs);
    if(son.length||(record.people||[]).includes('Stephen Sondheim')||/sondheim/i.test(record.title))add('sondheim',record,son);
    const stop=workValues(record).map(title=>stoppardPlays.get(workKey(title))).filter(Boolean);
    if((record.people||[]).includes('Tom Stoppard')&&stop.length)add('stoppard',record,stop);
    else if(/stoppard/i.test(record.title)&&!stop.length)add('stoppard',record,[]);
    const musical=workValues(record).filter(title=>!excluded.has(workKey(title))&&(workKey(title)!=='frogs'||sondheimFrogs)&&(musicalTitles.has(workKey(title))||shows.has(workKey(title))||workKey(title)==='cats'));
    if(musical.length||((names.includes('The Musical Collection')||record.article_category==='Musical Review') && !(!sondheimFrogs && workValues(record).every(title=>workKey(title)==='frogs'))))add('musicals',record,musical);
    if(names.includes('The Stratford Collection')||h.entityValues(record,'companies').some(name=>/^stratford (festival|shakespeare)/i.test(name)))add('stratford',record,[]);
    if(names.includes('The Shaw Collection')||h.entityValues(record,'companies').some(name=>/^shaw festival/i.test(name)))add('shaw',record,[]);
    if(!fix.excludeTelevision&&(fix.tvTitles||/^Television/.test(record.article_category)||names.includes('The Television Collection')))add('television',record,(fix.tvTitles||workValues(record)).map(title=>/^(24(?::|$))/.test(title)?'24':/^The Simpsons(?:\b|:| \/)/.test(title)?'The Simpsons':/^\d+(?:st|nd|rd|th) Academy Awards$/.test(title)?'Academy Awards':title));
    if(fix.bookTitles||record.article_category==='Book Review')add('books',record,fix.bookTitles||h.entityValues(record,'books'));
    if(fix.songTitles?.length)add('albums',record,fix.songTitles);
    else if(fix.albumTitles?.length)add('albums',record,fix.albumTitles);
    else if(fix.albumTitles===undefined&&record.recording_title&&!/concert|convention|at the concert hall/i.test(record.recording_title))add('albums',record,h.splitEntityList(record.recording_title));
    if(!fix.excludeProfiles&&/Profile|Obituary/.test(record.article_category))add('profiles',record,(fix.subjects||h.splitEntityList(record.subject_people)).filter(name=>name!=='Arlene Gould'));
  }
  const recordBySlug=new Map(records.map(record=>[record.slug,record]));
  for(const person of [...(curation.playwrights?.people||[]),...(curation.playwrights?.legacyPeople||[])]){
    if(['William Shakespeare','Tom Stoppard','Stephen Sondheim'].includes(person.person))continue;
    const collection={id:person.id,title:`${person.surname} Collection`,kind:'playwright',person:person.person,portrait:person.portrait,portraitCrop:person.portraitCrop,source:person.source,creator:person.creator,license:person.license,licenseUrl:person.licenseUrl,records:[],items:[],ungrouped:[]};
    const map=new Map();
    for(const work of person.works){
      const linked=work.slugs.map(slug=>recordBySlug.get(slug)).filter(Boolean);
      if(!linked.length)continue;
      const id=workKey(work.title).replaceAll(' ','-');
      const item=map.get(id)||{id,title:work.title,records:[]};
      for(const record of linked)if(!item.records.some(existing=>existing.slug===record.slug))item.records.push(record);
      map.set(id,item);
    }
    collection.items=[...map.values()].sort((a,b)=>workKey(a.title).localeCompare(workKey(b.title)));
    collection.records=[...new Map(collection.items.flatMap(item=>item.records).map(record=>[record.slug,record])).values()];
    definitions.set(person.id,collection);
    itemMaps.set(person.id,map);
  }
  for(const [id,collection] of definitions){
    collection.items=[...itemMaps.get(id).values()].sort((a,b)=>(id==='television' ? b.records.length-a.records.length : 0)||(id==='sondheim'?SONDHEIM_SHOWS.indexOf(a.title)-SONDHEIM_SHOWS.indexOf(b.title):0)||workKey(a.title).localeCompare(workKey(b.title)));
    collection.recordIds=new Set(collection.records.map(r=>r.slug));
    collection.itemMap=new Map(collection.items.map(item=>[item.id,{...item,recordIds:new Set(item.records.map(r=>r.slug))}]));
  }
  return definitions;
}
