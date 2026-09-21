import {nameMatches, normalize} from './catalog-engine.js?v=168';

export const INDEX_LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0–9', '#'];

export function indexOrder(type, requested) {
  return ['alpha', 'coverage'].includes(requested) ? requested : type === 'publications' ? 'coverage' : 'alpha';
}

export function indexLetter(sortText) {
  const first = normalize(sortText).charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : /[0-9]/.test(first) ? '0–9' : '#';
}

// Letter navigation never removes entries. Only the text/role/catalog filters do.
export function indexEntries(entries, query, order, sortText) {
  return entries.filter(entry => nameMatches(entry.label, query)).sort((a, b) =>
    (order === 'coverage' ? b.records.length - a.records.length : 0) ||
    sortText(a).localeCompare(sortText(b)) || a.label.localeCompare(b.label));
}

export function indexSections(entries, sortText) {
  const groups = new Map(INDEX_LETTERS.map(letter => [letter, []]));
  for (const entry of entries) groups.get(indexLetter(sortText(entry))).push(entry);
  return [...groups].filter(([, entries]) => entries.length);
}
