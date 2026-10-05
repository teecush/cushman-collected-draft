// Contours and hit areas are traced against this exact approved group image.
// Native SVG hit paths keep adjacent figures distinct at every viewport width.
export function renderPlaywrightStage(root, data, {heading: showHeading = true} = {}) {
  if (!root || !data?.people?.length) return;
  const el=(tag,cls,label)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(label)n.textContent=label;return n;};
  const svgEl=(tag,attrs={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([key,value])=>n.setAttribute(key,value));return n;};
  const heading=el('div','browse-heading playwright-stage-heading');heading.append(el('h2','','Playwright Collections'));
  const scroll=el('div','playwright-stage-scroll');
  const stage=el('div','playwright-stage-image');
  const [width,height]=data.imageSize||[1774,887];stage.style.aspectRatio=`${width} / ${height}`;
  const image=el('img');image.src=data.image;image.alt=`Illustrated group of ${data.people.length} playwrights standing together.`;image.loading='lazy';stage.append(image);
  const contours=svgEl('svg',{viewBox:`0 0 ${width} ${height}`,'aria-hidden':'true'});contours.classList.add('playwright-contours');
  const hits=svgEl('svg',{viewBox:`0 0 ${width} ${height}`});hits.classList.add('playwright-hit-areas');hits.setAttribute('aria-label','Choose a playwright');
  const shapes=[],labels=[],links=[];let selected=null;
  const highlight=index=>{shapes.forEach((shape,i)=>shape.classList.toggle('is-active',index===i));labels.forEach((label,i)=>label.classList.toggle('is-active',index===i));};
  const pick=index=>{selected=index;links.forEach((link,i)=>{link.classList.toggle('is-selected',index===i);if(index===i)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});highlight(index);};
  for(const [index,person] of data.people.entries()){
    const geometry=person.geometry;
    if(!geometry?.contour||!geometry?.hitPath)throw new Error('Missing figure geometry for '+person.person);
    const outline=svgEl('path',{d:geometry.contour});outline.dataset.index=String(index);shapes.push(outline);contours.append(outline);
    const link=svgEl('a',{href:person.href,'aria-label':`Open the ${person.person} collection`,tabindex:'0'});link.classList.add('playwright-hit');link.dataset.index=String(index);
    link.append(svgEl('path',{d:geometry.hitPath}));links.push(link);hits.append(link);
    const label=el('strong','playwright-figure-name',person.surname);const [x,y]=geometry.label;
    const edge=`${person.surname.length*.4}em`;label.style.left=`clamp(${edge}, ${x/width*100}%, calc(100% - ${edge}))`;label.style.top=`${y/height*100}%`;labels.push(label);
    link.addEventListener('pointerdown',event=>{link.dataset.pointerType=event.pointerType;});
    link.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')highlight(index);});
    link.addEventListener('pointerleave',()=>highlight(selected));
    link.addEventListener('focus',()=>highlight(index));link.addEventListener('blur',()=>highlight(selected));
    link.addEventListener('click',event=>{if(link.dataset.pointerType==='touch'&&selected!==index){event.preventDefault();pick(index);}});
  }
  stage.append(contours,hits,...labels);scroll.append(stage);
  root.replaceChildren(...(showHeading?[heading,scroll]:[scroll]));
}
