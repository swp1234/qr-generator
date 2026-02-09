// Service Worker for QR Code Generator

const CACHE_NAME = 'qr-generator-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/i18n.js',
    '/js/locales/ko.json',
    '/js/locales/en.json',
    '/js/locales/zh.json',
    '/js/locales/hi.json',
    '/js/locales/ru.json',
    '/js/locales/ja.json',
    '/js/locales/es.json',
    '/js/locales/pt.json',
    '/js/locales/id.json',
    '/js/locales/tr.json',
    '/js/locales/de.json',
    '/js/locales/fr.json',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('Cache addAll error:', err);
                // Continue even if some assets fail to cache
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Cache-first strategy for assets
    if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(response => {
                    if (response.ok) {
                        const cache = caches.open(CACHE_NAME);
                        cache.then(c => c.put(request, response.clone()));
                    }
                    return response;
                });
            }).catch(() => {
                return caches.match(request);
            })
        );
        return;
    }

    // Network-first strategy for everything else
    event.respondWith(
        fetch(request)
            .then(response => {
                if (response.ok) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, response.clone());
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).then(response => {
                    return response || new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
});

// Background sync for offline queue (future enhancement)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-qr-queue') {
        event.waitUntil(syncQRQueue());
    }
});

async function syncQRQueue() {
    // Implement QR generation queue sync if needed
    return Promise.resolve();
}

// Message handler
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
