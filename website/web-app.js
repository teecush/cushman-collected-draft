/* Resolve from the script, including article pages with the shared website base. */
(() => {
  const script = document.currentScript;
  const displayMode = window.matchMedia('(display-mode: standalone)');
  let navigationBar, backButton, forwardButton;
  let entryIndex = 0, lastEntryIndex = 0, trail = '';
  const entryPath = window.location.pathname;
  const validEntry = entry => entry?.path === entryPath && Number.isInteger(entry.index) && entry.index >= 0;
  const readLastEntry = () => {
    try { return Math.max(entryIndex, Number(sessionStorage.getItem('cc-app-navigation:' + trail)) || 0); }
    catch { return Math.max(entryIndex, lastEntryIndex); }
  };
  const syncControls = () => {
    history.replaceState({...history.state, ccAppNavigation: {path: entryPath, index: entryIndex, trail}}, '');
    try { sessionStorage.setItem('cc-app-navigation:' + trail, String(lastEntryIndex)); } catch { /* History still works without session storage. */ }
    backButton.disabled = entryIndex === 0;
    forwardButton.disabled = entryIndex >= lastEntryIndex;
  };
  const setAppMode = () => {
    const installed = displayMode.matches || navigator.standalone === true;
    document.body.classList.toggle('web-app-mode', installed);
    if (!installed || navigationBar) return;
    const entry = history.state?.ccAppNavigation;
    entryIndex = validEntry(entry) ? entry.index : 0;
    trail = (validEntry(entry) && entry.trail) || crypto.randomUUID();
    lastEntryIndex = readLastEntry();
    navigationBar = document.createElement('nav');
    navigationBar.className = 'web-app-navigation';
    navigationBar.setAttribute('aria-label', 'App navigation');
    const control = (label, markup, action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'web-app-navigation-button';
      button.setAttribute('aria-label', label);
      button.innerHTML = markup;
      button.addEventListener('click', action);
      navigationBar.append(button);
      return button;
    };
    backButton = control('Go back', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>', () => { if (entryIndex > 0) history.back(); });
    control('Home', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/></svg>', () => {
      if (location.hash === '#home' || !location.hash && !document.documentElement.dataset.articleSlug) window.scrollTo({top: 0, behavior: 'auto'});
      else location.hash = '#home';
    });
    forwardButton = control('Go forward', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>', () => { if (entryIndex < lastEntryIndex) history.forward(); });
    document.body.append(navigationBar);
    syncControls();
  };
  window.addEventListener('popstate', event => {
    if (!navigationBar) return;
    const entry = event.state?.ccAppNavigation;
    if (validEntry(entry)) {
      entryIndex = entry.index;
      if (entry.trail) trail = entry.trail;
      lastEntryIndex = readLastEntry();
    } else {
      entryIndex += 1;
      lastEntryIndex = entryIndex;
    }
    syncControls();
  });
  window.addEventListener('hashchange', () => { if (navigationBar) syncControls(); });
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
