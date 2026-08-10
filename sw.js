/**
 * Service Worker for Offline Capability
 * Caches static assets and provides offline fallback
 */

const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `ajay-godara-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/blog.html',
  '/gallery.html',
  '/education.html',
  '/research.html',
  '/css/main.css',
  '/js/blog.js',
  '/js/gallery.js',
  // Add critical images
  '/images/gallery/fulls/Anatarctica 44th 2024/DSCF3796-Enhanced-NR.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API requests and data files (always fetch fresh)
  if (url.pathname.includes('/data/') || url.pathname.includes('/api/')) {
    return event.respondWith(fetch(request));
  }

  // Network first for HTML pages
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page if available
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Cache first for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version and update in background
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          });
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[ServiceWorker] Cache cleared');
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Background sync for offline actions (future feature)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Sync any pending data when back online
      syncPendingData()
    );
  }
});

async function syncPendingData() {
  // Placeholder for future offline data sync
  console.log('[ServiceWorker] Syncing pending data...');
}
