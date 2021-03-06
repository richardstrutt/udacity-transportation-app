var staticCacheName = 'app-train-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                    '/',
                    '/js/scripts.js',
                    '/js/library.js',
                    '/css/main.css',
                    '/css/bootstrap.css',
                    '/imgs/cc.svg',
                    '/fonts/glyphicons-halflings-regular.woff2',
                    'https://fonts.googleapis.com/css?family=Open+Sans:300'
                ])
                .then(function () {
                    self.skipWaiting();
                });
        })
    );
});

self.addEventListener('activate', function (event) {
    self.clients.claim();
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('app-') &&
                        cacheNames != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url),
        fetchReq = event.request.clone();
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(fetchReq);
        })
    );
});
