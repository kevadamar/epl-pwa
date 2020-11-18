importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  {url:"/index.html", revision: 1},
  {url:"/nav.html", revision: 1},
  {url:"/pages/pertandingan.html", revision: 1},
  {url:"/pages/klasemen.html", revision: 1},
  {url:"/pages/teams.html", revision: 1},
  {url:"/pages/favorite.html", revision: 1},
  {url:"/css/materialize.min.css", revision: 1},
  {url:"/css/style.css", revision: 1},
  {url:"/js/main.js", revision: 1},
  {url:"/js/ServiceWorkers.js", revision: 1},
  {url:"/js/plugins/materialize.min.js", revision: 1},
  {url:"/js/services/apiServices.js", revision: 1},
  {url:"/js/entities/DB.js", revision: 1},
  {url:"/js/plugins/idb.js", revision: 1},
  {url:"/js/helper/helper.js", revision: 1},
  {url:"/assets/PL-Lion-512x512.png", revision: 1},
  {url:"/assets/maskable_icon.png", revision: 1},
  {url:"/assets/Premier_League_Logo.png", revision: 1},
  {url:"/assets/alt-image.webp", revision: 1},  
  {url:"/manifest.json", revision: 1},
  {url:"/registPushNotif.json", revision: 1},
]);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'images'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Menyimpan cache untuk file font selama 1 bulan
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
        cacheName: 'api-service',
    })
);


self.addEventListener("push", (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no data";
  }

  const options = {
    body: body,
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification Ready", options)
  );
});
