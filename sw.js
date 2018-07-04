var staticCacheID = 'mws-project-1-content-cache-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheID).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/js/main.js',
        '/js/mainController.js',
        '/js/restaurant_info.js',
        '/js/dbhelper.js',
        '/css/styles.css',
        '/images/',
        '/restaurant.html',
        '/manifest.json'
      ]);
    })
  );
});

//Activating Cache and deletion
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          //Filtering with Name Initials
          return cacheName.startsWith('mws-project-') &&
                 cacheName != staticCacheID;
        }).map(function(cacheName) {
          //Deletion
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
      .then(fetchResponse => {
        //Fetching response here
            return caches.open(staticCacheID).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          });
    })
  );
});
