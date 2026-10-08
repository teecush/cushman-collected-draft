/* Resolve from the script, including article pages with the shared website base. */
(() => {
  const script = document.currentScript;
  const displayMode = window.matchMedia('(display-mode: standalone)');
  let backButton;
  let entryIndex = 0;
  const entryPath = window.location.pathname;
  const syncBackButton = () => {
    const entry = history.state?.ccAppNavigation;
    if (entry?.path === entryPath && Number.isInteger(entry.index)) entryIndex = entry.index;
    else history.replaceState({...history.state, ccAppNavigation: {path: entryPath, index: entryIndex}}, '');
    if (backButton) backButton.disabled = entryIndex === 0;
  };
  const setAppMode = () => {
    const installed = displayMode.matches || navigator.standalone === true;
    document.body.classList.toggle('web-app-mode', installed);
    if (!installed || backButton) return;
    backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'web-app-back';
    backButton.setAttribute('aria-label', 'Go back');
    backButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg><span>Back</span>';
    backButton.addEventListener('click', () => { if (entryIndex > 0) history.back(); });
    document.body.append(backButton);
    syncBackButton();
  };
  window.addEventListener('popstate', event => {
    if (!backButton) return;
    const entry = event.state?.ccAppNavigation;
    if (entry?.path === entryPath && Number.isInteger(entry.index)) entryIndex = entry.index;
    else entryIndex += 1;
    syncBackButton();
  });
  window.addEventListener('hashchange', () => { if (backButton) syncBackButton(); });
  displayMode.addEventListener('change', setAppMode);
  setAppMode();
  if (!script || !('serviceWorker' in navigator) || !window.isSecureContext) return;
  const worker = new URL('../service-worker.js', script.src);
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(worker.href, {
      scope: new URL('./', worker).href,
      updateViaCache: 'none',
    }).catch(error => console.warn('Home-screen app support could not start.', error));
  }, { once: true });
})();
