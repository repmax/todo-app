self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('todo-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
				'/manifest.json',
				'/src/todo-app.js',
				'/src/todo-item.js',
        '/lib/lit-all.min.js', 
        '/lib/tailwind-styles.css',
				'/lib/custom-styles.css'
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