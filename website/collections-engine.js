import {normalize, publicationYear} from './catalog-engine.js?v=160';
export const COLLECTIONS = [
  {id:'shakespeare',title:'Shakespeare',kind:'plays',href:'#section:shakespeare',intro:'The plays, the productions, and a lifetime of returning to Shakespeare.'},
  {id:'sondheim',title:'Sondheim',kind:'musicals',intro:'The musicals, the lyrics, and the art of Stephen Sondheim.'},
  {id:'musicals',title:'Musicals',kind:'musicals',intro:'Return to a favourite show, or discover one you have never seen.'},
  {id:'stratford',title:'Stratford',kind:'festival',intro:'Explore the Stratford Festival, theatre by theatre and season by season.'},
  {id:'shaw',title:'Shaw',kind:'festival',intro:'Explore the Shaw Festival, theatre by theatre and season by season.'},
  {id:'television',title:'TV Reviews',kind:'television',intro:'Small screens, big stories. Browse the shows Robert wrote about.'},
  {id:'albums',title:'Music Reviews',kind:'albums',intro:'Recordings, singers, and the songs worth listening to again.'},
  {id:'books',title:'Book Reviews',kind:'books',intro:'A shelf of books about the people and ideas behind the arts.'},
  {id:'profiles',title:'Profiles & Obits',kind:'portraits',intro:'The artists behind the work, in profiles and remembrances.'},
  {id:'early',title:'Early Writing',kind:'early',intro:'The beginning: writing published from 1963 through 1966.'},
];
export const SONDHEIM_SHOWS = ['Saturday Night','West Side Story','Gypsy','A Funny Thing Happened on the Way to the Forum','Anyone Can Whistle','Do I Hear a Waltz?','Company','Follies','A Little Night Music','The Frogs','Pacific Overtures','Sweeney Todd','Merrily We Roll Along','Sunday in the Park with George','Into the Woods','Assassins','Passion','Bounce','Road Show','Here We Are','Side by Side by Sondheim','Marry Me a Little','Putting It Together','Sondheim on Sondheim','Old Friends'];
export const workKey = value => normalize(value)==='the passion'?'the passion':normalize(value).replace(/^(the|a|an) /,'').replace(/^sweeney todd the demon barber of fleet street$/, 'sweeney todd');
export function spotlightRecord(records, date = new Date()) {
  records = records.filter(record => !record.authorship_note && record.author !== "Unknown");
  if (!records.length) return null;
  const day = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
  const anniversary = records.filter(record => record.date?.slice(5) === day.slice(5) && record.date.slice(0,4) < day.slice(0,4) && (!record.date_precision || record.date_precision === 'day'));
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
    if(year>=1963&&year<=1966)add('early',record,[]);
    if(h.isExplicitShakespeareRecord(record))add('shakespeare',record,[]);
    const son=sonTitles(record);
    if(son.length||(record.people||[]).includes('Stephen Sondheim')||/sondheim/i.test(record.title))add('sondheim',record,son);
    const musical=workValues(record).filter(title=>!excluded.has(workKey(title))&&(musicalTitles.has(workKey(title))||shows.has(workKey(title))));
    if(musical.length||names.includes('The Musical Collection')||record.article_category==='Musical Review')add('musicals',record,musical);
    if(names.includes('The Stratford Collection')||h.entityValues(record,'companies').some(name=>/^stratford (festival|shakespeare)/i.test(name)))add('stratford',record,[]);
    if(names.includes('The Shaw Collection')||h.entityValues(record,'companies').some(name=>/^shaw festival/i.test(name)))add('shaw',record,[]);
    if(!fix.excludeTelevision&&(fix.tvTitles||/^Television/.test(record.article_category)||names.includes('The Television Collection')))add('television',record,fix.tvTitles||workValues(record));
    if(fix.bookTitles||record.article_category==='Book Review')add('books',record,fix.bookTitles||h.entityValues(record,'books'));
    if(fix.songTitles?.length)add('albums',record,fix.songTitles);
    else if(fix.albumTitles?.length)add('albums',record,fix.albumTitles);
    else if(fix.albumTitles===undefined&&record.recording_title&&!/concert|convention|at the concert hall/i.test(record.recording_title))add('albums',record,h.splitEntityList(record.recording_title));
    if(/Profile|Obituary/.test(record.article_category))add('profiles',record,fix.subjects||h.splitEntityList(record.subject_people));
  }
  for(const [id,collection] of definitions){
    collection.items=[...itemMaps.get(id).values()].sort((a,b)=>(id==='television' ? b.records.length-a.records.length : 0)||workKey(a.title).localeCompare(workKey(b.title)));
    collection.recordIds=new Set(collection.records.map(r=>r.slug));
    collection.itemMap=new Map(collection.items.map(item=>[item.id,{...item,recordIds:new Set(item.records.map(r=>r.slug))}]));
  }
  return definitions;
}
