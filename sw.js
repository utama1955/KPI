const CACHE_NAME = 'kraepelin-cache-v1';
const urlsToCache = [
  '/',
  '/kraeplinv2.html',
  '/Banner Utama.png',
  '/persiapan.mp3',
  '/tiga.mp3',
  '/dua.mp3',
  '/satu.mp3',
  '/mulai.mp3',
  '/pindah.mp3',
  '/selesai.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Gunakan versi cache
        }
        return fetch(event.request); // Ambil dari internet
      })
  );
});
