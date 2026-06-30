const CACHE_NAME = 'kinetic-dice-v1-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Service Worker & Clean Up Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Network First falling back to Cache, with offline HTML response support
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests (skip chrome extensions or POST api calls)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone and cache it for offline use if it's in our core scope
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fetch failed (network offline), try serving from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If a page navigation fails, return the index.html as offline root
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline system active. Network disconnected.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
