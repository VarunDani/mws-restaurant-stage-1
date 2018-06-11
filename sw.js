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
        '/data/restaurants.json',
        '/css/styles.css',
        '/images/',
        '/js/',
        '/css/',
        '/restaurant.html',
        '/restaurant.html?id=1',
        '/restaurant.html?id=2',
        '/restaurant.html?id=3',
        '/restaurant.html?id=4',
        '/restaurant.html?id=5',
        '/restaurant.html?id=6',
        '/restaurant.html?id=7',
        '/restaurant.html?id=8',
        '/restaurant.html?id=9',
        '/restaurant.html?id=10'
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
