const choice = document.querySelector('#page-choice');
const knownViews = new Set([...choice.options].map(option => option.value));
const requested = new URLSearchParams(location.search).get('view');
if (knownViews.has(requested)) choice.value = requested;
let loaded = false;
function showPair() {
  const route = choice.selectedOptions[0].dataset.route;
  for (const [name,folder] of [['main','website'],['preview','design-preview']]) {
    const url = `../${folder}/${route}`;
    document.querySelector(`#${name}-link`).href = url;
    document.querySelector(`#${name}-frame`).src = url;
  }
  document.querySelector('#pair').hidden = false;
  document.querySelector('#show-pair').textContent = 'Reload both versions';
  history.replaceState(null,'',`?view=${encodeURIComponent(choice.value)}`);
  loaded = true;
}
document.querySelector('#show-pair').addEventListener('click',showPair);
choice.addEventListener('change',()=>{if(loaded)showPair();});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  choice.value = button.dataset.view;showPair();document.querySelector('#compare').scrollIntoView();choice.focus({preventScroll:true});
}));
const status = document.querySelector('#save-state');
const storageKey = 'cushman-design-review-20260910';
let notes = {};
try { notes = JSON.parse(localStorage.getItem(storageKey)||'{}'); } catch { status.textContent='Browser storage is unavailable. Download your notes before leaving this page.'; }
if(!notes || typeof notes !== 'object' || Array.isArray(notes)) notes = {};
document.querySelectorAll('[data-save]').forEach(field=>{
  field.value = typeof notes[field.dataset.save] === 'string' ? notes[field.dataset.save] : '';
  field.addEventListener('input',()=>{
    notes[field.dataset.save] = field.value;
    try { localStorage.setItem(storageKey,JSON.stringify(notes));status.textContent='Saved in this browser only. Download a copy to share with someone else.'; }
    catch {status.textContent='Browser storage is unavailable. Download your notes before leaving this page.';}
  });
});
document.querySelector('#export-notes').addEventListener('click',()=>{
  const lines=['Cushman Collected — design review','Main: https://teecush.github.io/cushman-collected-draft/website/','Preview: https://teecush.github.io/cushman-collected-draft/design-preview/',''];
  document.querySelectorAll('tbody tr').forEach(row=>{
    const title=row.querySelector('th').childNodes[1].textContent;
    lines.push(`${row.id} — ${title}`,`Preference: ${notes[row.id+'-choice']||'Undecided'}`,`Notes: ${notes[row.id+'-note']||''}`,'');
  });
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='cushman-design-preferences.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.querySelector('#print-list').addEventListener('click',()=>window.print());
if (requested) showPair();
