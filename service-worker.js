/* Keep published pages fresh. Only the small offline notice is stored. */
const OFFLINE_CACHE = 'cushman-collected-offline-v1';
const OFFLINE_URL = new URL('./offline.html', self.location.href).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then(cache => cache.add(OFFLINE_URL))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(async () => {
    const cache = await caches.open(OFFLINE_CACHE);
    return await cache.match(OFFLINE_URL) || Response.error();
  }));
});
