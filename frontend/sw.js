const CACHE_NAME = 'dashboard-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html', 
  '/style.css',      
  '/script.js'
];

// 1. KEŠIRANJE (Tvoj stari kod)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// 2. NOTIFIKACIJE (Ovo mora biti tu da bi taster "Uključi" reagovao)
self.addEventListener('push', (event) => {
  let data = { title: 'Obaveštenje', body: 'Stigla je nova poruka.' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log("Push podaci nisu JSON, koristim default.");
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png', // Moraš imati ovu ikonicu u public folderu
    badge: '/icon-192.png',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Otvaranje aplikacije na klik notifikacije
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
