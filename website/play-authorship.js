import {normalize} from './catalog-engine.js?v=173';

const list = value => Array.isArray(value) ? value : String(value || '').split(';').map(value => value.trim()).filter(Boolean);

// The public writing index combines dramatic writers, composers and lyricists.
// Keep the source's precise credits intact in the archive and article details.
export function writingNames(record, split = list) {
  const roles = ['playwright', 'composer_lyricist'];
  return [...new Set(roles.flatMap(role => [
    ...split(record.roles?.[role]),
    ...(record.production_groups || []).flatMap(group => split(group[role])),
    ...(record.subject_role_map || []).filter(entry => entry.roles?.includes(role)).map(entry => entry.person),
  ]).filter(Boolean))];
}

export function henryCycleTitle(value) {
  const key = normalize(value);
  const match = key.match(/^(?:king )?henry (iv|vi|4|6)(?: (.*))?$/);
  if (!match) return '';
  const cycle = ['iv', '4'].includes(match[1]) ? 'IV' : 'VI';
  const suffix = match[2] || '';
  if (!suffix) return `Henry ${cycle}`;
  if (cycle === 'VI' && ['revenge in france', 'revolt in england'].includes(suffix)) return 'Henry VI';
  const parts = suffix.replace(/^parts? /, '').split(/ (?:and|or) | /).filter(Boolean);
  const valid = cycle === 'IV' ? ['one','two','1','2','i','ii'] : ['one','two','three','1','2','3','i','ii','iii'];
  return parts.length && parts.every(part => valid.includes(part)) ? `Henry ${cycle}` : '';
}

export function shakespeareTitles(record, resolveTitle, split = list) {
  const groups = (record.production_groups || []).filter(group => group.production_title);
  const articleAuthors = split(record.roles?.playwright);
  const permitted = authors => !authors.length || authors.some(author => normalize(author) === 'william shakespeare');
  const titles = [];
  for (const raw of [...split(record.production_title), ...groups.flatMap(group => split(group.production_title))]) {
    const title = resolveTitle(raw);
    if (!title) continue;
    const matching = groups.filter(group => split(group.production_title).some(value => normalize(value) === normalize(raw)));
    // A grouped credit beats the article's combined list of several authors.
    const accepted = matching.length
      ? matching.some(group => permitted(split(group.playwright).length ? split(group.playwright) : articleAuthors))
      : permitted(articleAuthors);
    if (accepted) titles.push(title);
  }
  return [...new Set(titles)];
}

export function isSondheimFrogs(record) {
  const groups = (record.production_groups || []).filter(group => normalize(group.production_title) === 'the frogs');
  const names = groups.length
    ? groups.flatMap(group => [...list(group.playwright), ...list(group.composer_lyricist)])
    : [...writingNames(record), ...(record.people || [])];
  return names.includes('Stephen Sondheim') || !names.includes('Aristophanes');
}
