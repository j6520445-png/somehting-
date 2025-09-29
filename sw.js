const CACHE_NAME = 'hk-web-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './TemplateData/style.css',
  './TemplateData/favicon.ico',
  './TemplateData/unity-logo-dark.png',
  './Build/bog.framework.js',
  './Build/bog.loader.js',
  './StreamingAssets/BuildMetadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return; // only handle same-origin

  // Network-first strategy for navigations and index.html to avoid stale UI
  const isNavigation = event.request.mode === 'navigate';
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html') || url.pathname === '/index.html';

  if (isNavigation || isIndex) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For other requests: cache-first with background update
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});