// Basic service worker for Send PWA
const CACHE_NAME = 'send-pwa-v1';
const URLS_TO_CACHE = [
  '/',
  '/send/send.html',
  '/send/send.js',
  '/send/style.css',
  '/send/manifest.json',
  '/send/icon-192.png',
  '/send/icon-512.png',
  '/send/sendmobile.html',
  '/send/sendmobile.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
