self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('todo-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
				'/manifest.json',
				'/src/my-app.js',	
				'/src/todo-list.js',
				'/src/todo-item.js',
        '/lib/lit-all.min.js', 
        '/lib/tailwind-style.css'
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