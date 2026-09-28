function collectionName(title) {
  return String(title||'').trim().replace(/^The\s+/i,'').replace(/\s+collection$/i,'').trim();
}

export function collectionTitleText(title) {
  return `${collectionName(title)} Collection`;
}

export function setCollectionTitle(element,title) {
  const full=collectionTitleText(title);
  const name=collectionName(title);
  const part=(className,text)=>{const span=document.createElement('span');span.className=className;span.textContent=text;return span;};
  element.classList.add('styled-collection-title');
  element.replaceChildren(
    part('collection-title-name',name),
    document.createTextNode(' '),
    part('collection-title-script','Collection'),
  );
  return full;
}
