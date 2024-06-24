self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('todo-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/lit-all.min.js', // Adjust paths as needed
        '/style.css' // Add other assets
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});