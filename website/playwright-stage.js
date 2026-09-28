// The illustration is a visual doorway; the reviewed-work lists live in the collection data.
export function renderPlaywrightStage(root, data) {
  if (!root || !data?.people?.length) return;
  const el = (tag, cls, label) => {
    const item = document.createElement(tag);
    if (cls) item.className = cls;
    if (label) item.textContent = label;
    return item;
  };
  const heading = el('div', 'browse-heading playwright-stage-heading');
  const title = el('h2', '', 'Playwright Collections');
  title.id = 'playwrightCollectionsTitle';
  heading.append(title);
  const scroll = el('div', 'playwright-stage-scroll');
  const stage = el('div', 'playwright-stage-image');
  const image = el('img');
  image.src = data.image;
  image.alt = 'Illustrated group of fifteen playwrights standing together.';
  image.loading = 'lazy';
  stage.append(image);
  let selected = null;
  const pick = link => {
    if (selected && selected !== link) selected.classList.remove('is-selected');
    selected = link;
    link.classList.add('is-selected');
  };
  for (const [index, person] of data.people.entries()) {
    const [x, y, width, height] = person.box;
    const [labelX, labelY] = person.label;
    const link = el('a', 'playwright-figure');
    if ([1, 2, 3, 4, 8].includes(index)) link.classList.add('is-back');
    link.href = person.href;
    link.setAttribute('aria-label', `Open the ${person.person} collection`);
    link.style.left = `${x / 1774 * 100}%`;
    link.style.top = `${y / 887 * 100}%`;
    link.style.width = `${width / 1774 * 100}%`;
    link.style.height = `${height / 887 * 100}%`;
    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    outline.setAttribute('viewBox', '0 0 100 100');
    outline.setAttribute('preserveAspectRatio', 'none');
    outline.setAttribute('aria-hidden', 'true');
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('d', link.classList.contains('is-back')
      ? 'M42 1 Q50 -2 58 1 Q69 3 69 13 Q69 21 62 27 Q50 31 38 27 Q31 20 31 13 Q31 2 42 1 Z'
      : 'M7 99 L2 58 Q2 42 11 35 Q24 29 38 28 Q32 24 31 16 Q30 5 42 1 Q50 -2 58 1 Q70 5 69 16 Q68 24 62 28 Q76 29 89 35 Q98 42 98 58 L93 99');
    outline.append(shape);
    link.append(outline);
    const label = el('strong', 'playwright-figure-name', person.surname);
    label.style.left = `${(labelX - x) / width * 100}%`;
    label.style.top = `${(labelY - y) / height * 100}%`;
    link.append(label);
    link.addEventListener('pointerdown', event => { link.dataset.pointerType = event.pointerType; });
    link.addEventListener('click', event => {
      if (link.dataset.pointerType === 'touch' && selected !== link) {
        event.preventDefault();
        pick(link);
      }
    });
    stage.append(link);
  }
  scroll.append(stage);
  const hint = el('p', 'playwright-stage-hint', 'Choose a playwright to browse reviews of their work. On a phone, swipe across the group; tap a figure to reveal the name, then tap again to open the collection.');
  const details = el('details', 'playwright-stage-credits');
  details.append(el('summary', '', 'Portrait and illustration credits'));
  details.append(el('p', '', 'This is an illustrated composite based on the credited portraits, not a historical group photograph.'));
  const list = el('ul');
  for (const person of data.people) {
    const item = el('li');
    const source = el('a', '', person.person);
    source.href = person.source;
    source.target = '_blank';
    source.rel = 'noopener';
    item.append(source, document.createTextNode(` — ${person.creator || 'Creator not stated'}; ${person.license || 'rights information at source'}`));
    if (person.licenseUrl) {
      const licence = el('a', '', 'licence');
      licence.href = person.licenseUrl;
      licence.target = '_blank';
      licence.rel = 'noopener';
      item.append(document.createTextNode(' ('), licence, document.createTextNode(')'));
    }
    list.append(item);
  }
  details.append(list);
  root.replaceChildren(heading, scroll, hint, details);
}
