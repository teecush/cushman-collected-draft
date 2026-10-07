/* Resolve from the script, including article pages with the shared website base. */
(() => {
  const script = document.currentScript;
  if (!script || !('serviceWorker' in navigator) || !window.isSecureContext) return;
  const worker = new URL('../service-worker.js', script.src);
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(worker.href, {
      scope: new URL('./', worker).href,
      updateViaCache: 'none',
    }).catch(error => console.warn('Home-screen app support could not start.', error));
  }, { once: true });
})();
