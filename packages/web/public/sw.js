self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('fox-store').then((cache) => cache.addAll([
        '/index.html',
        '/logo/black.png'
      ])),
    );
  });

  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });