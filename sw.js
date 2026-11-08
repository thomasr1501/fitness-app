const CACHE_NAME = 'fitness-app-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js'
];

self.addEventListener('install', event => {
    // Erzwingt, dass der neue Service Worker sofort aktiv wird
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', event => {
    // Alte Caches löschen, um Speicherlecks (und das iOS Homescreen-Problem) zu verhindern
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});

self.addEventListener('fetch', event => {
    // API-Aufrufe an die Datenbank ignorieren (Firestore regelt Offline-Sync selbst)
    if (event.request.url.includes('firestore.googleapis.com')) return;
    
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});
