importScripts('/js/idb.js');
importScripts('/js/DBHelper.js');

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
        '/js/idb.js',
        '/css/styles.css',
        '/css/restDtls.css',
        '/images/',
        '/restaurant.html',
        '/manifest.json',
        '/images/1_small_1x.jpg',
        '/images/2_small_1x.jpg',
        '/images/3_small_1x.jpg',
        '/images/4_small_1x.jpg',
        '/images/5_small_1x.jpg',
        '/images/6_small_1x.jpg',
        '/images/7_small_1x.jpg',
        '/images/8_small_1x.jpg',
        '/images/9_small_1x.jpg',
        '/images/10_small_1x.jpg'
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
            }).catch((err) => {
              console.log('sw: '+err);
            });
          });
    })
  );
});

//Background Sync Event
self.addEventListener('sync', function(event) {
  if (event.tag === 'syncApp'){
    console.log("Start Syncing Application Data");
    event.waitUntil(DBHelper.syncPendingData());
  }

});
