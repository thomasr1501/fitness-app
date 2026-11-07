const CACHE_NAME = 'fitness-app-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install: Ressourcen cachen
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch: Bei fehlendem Netz aus dem Cache laden
self.addEventListener('fetch', event => {
    // Firebase API Calls vom Caching ausschließen (das macht Firestore selbst)
    if (event.request.url.includes('firestore.googleapis.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});
