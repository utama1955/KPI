const CACHE_NAME = 'kraepelin-cache-v3'; // Versi diubah ke v3 untuk memaksa update cache
const urlsToCache = [
  './kraeplinv2.html',
  './manifest.json',
  './logoku.png',
  './persiapan.mp3',
  './tiga.mp3',
  './dua.mp3',
  './satu.mp3',
  './mulai.mp3',
  './pindah.mp3',
  './selesai.mp3'
  // CATATAN: Untuk Banner, karena menggunakan spasi, kadang menyebabkan gagal cache. 
  // Pastikan nama file ini persis sama dengan yang ada di repository GitHub Anda.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Jika ada 1 file saja yg gagal di-cache, proses akan gagal semua.
        // Sebaiknya hindari nama file berspasi seperti "Banner Utama.png"
        return cache.addAll(urlsToCache.concat(['./Banner Utama.png']));
      })
      .catch(err => console.error('Gagal caching:', err))
  );
  self.skipWaiting(); // Memaksa service worker baru langsung aktif
});

self.addEventListener('activate', event => {
  // Menghapus cache versi lama (v1 atau v2) agar tidak menumpuk
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
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Gunakan file dari cache jika ada, jika tidak ambil dari internet
        return response || fetch(event.request);
      })
  );
});
