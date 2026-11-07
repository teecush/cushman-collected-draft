// Reviewed display changes only. Original article files remain intact.
export function applyBodyPresentation(body, presentation) {
  if (!presentation) return body;
  let text = body;
  if (presentation.source_prefix) {
    if (!text.startsWith(presentation.source_prefix)) return body;
    text = presentation.replacement + text.slice(presentation.source_prefix.length);
  }
  for (const {before, after} of [...(presentation.contact_edits || [])].sort((a,b) => b.before.length-a.before.length)) {
    text = text.split(before).join(after);
  }
  return text.split(/\n{2,}/).map(block => block.trim()).filter(Boolean).join('\n\n');
}

export function openingBlockClass(block, presentation) {
  if (presentation?.credits?.includes(block)) return 'article-opening-credit';
  if (presentation?.notes?.includes(block)) return 'article-opening-note';
  return '';
}
