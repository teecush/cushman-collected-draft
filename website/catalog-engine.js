/* Pure catalog state helpers. Shared by browsing, links and regression checks. */
export const FIELDS = ['shelf','item','q','type','collection','group','sort','from','to','publication','subject','form','company','city','venue','person','role','completeness','entityType','entity','indexScope','text','origin','shown'];
export function normalize(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
}
export function nameMatches(name, query) {
  const words = normalize(name).split(' ');
  return normalize(query).split(' ').filter(Boolean).every(term => words.some(word => word.startsWith(term)));
}
export function publicationYear(record) {
  const explicit = String(record.year || '');
  if (/^\d{4}$/.test(explicit)) return explicit;
  const date = String(record.date || '');
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.slice(0, 4) : '';
}
// A catalog year is not automatically a known publication date. Undated
// articles may carry contextual years, but never acquire a timeline position.
export function timelineYear(record) {
  if(record.date_precision==='unknown' || !/^\d{4}-\d{2}-\d{2}$/.test(String(record.date||'')))return '';
  return String(record.date).slice(0,4);
}
export function articleDateLabel(record) {
  if(!timelineYear(record))return 'Undated';
  const precision=record.date_precision||'day', date=new Date(`${record.date}T00:00:00`);
  if(Number.isNaN(date.valueOf()))return 'Undated';
  const label=precision==='season' && record.date_label ? record.date_label
    : precision==='year' ? String(record.date).slice(0,4)
    : date.toLocaleDateString('en-US',precision==='month'?{month:'long',year:'numeric'}:{year:'numeric',month:'short',day:'numeric'});
  return (record.date_is_estimated?'c. ':'')+label;
}
export function serialize(values, base = '#archive') {
  const params = new URLSearchParams();
  FIELDS.forEach(key => { if (values[key] !== undefined && values[key] !== '' && values[key] !== null) params.set(key, String(values[key])); });
  return base + (params.size ? '?' + params : '');
}
export function parse(hash) {
  const params = new URLSearchParams(String(hash).split('?')[1] || '');
  return Object.fromEntries(FIELDS.map(key => [key, params.get(key) || '']));
}
export function articleForm(category) {
  if (/Interview/.test(category)) return 'Interview';
  if (/Obituary/.test(category)) return 'Obituary';
  if (/Profile/.test(category)) return 'Profile';
  if (/Preview/.test(category)) return 'Preview';
  if (/Year|Survey/.test(category)) return 'Retrospective';
  if (/Essay|Criticism|Opinion/.test(category)) return 'Essay';
  if (/Review/.test(category)) return 'Review';
  if (/Correction/.test(category)) return 'Correction';
  return 'Feature / news';
}
export function articleSubject(category) {
  if (/Musical|Opera/.test(category)) return 'Musical theatre & opera';
  if (/Theatre|Comedy|Circus|Dance|Awards|Events/.test(category)) return 'Theatre & performance';
  if (/Music|Concert/.test(category)) return 'Music';
  if (/Television/.test(category)) return 'Television';
  if (/Film/.test(category)) return 'Film';
  if (/Book/.test(category)) return 'Books';
  return 'Arts & culture';
}
