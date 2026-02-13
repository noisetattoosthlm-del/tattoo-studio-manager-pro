const CACHE_NAME = 'dashboard-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/style.css',
  '/script.js'
];

// --- POSTOJEĆI KOD ZA KEŠIRANJE ---
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

// --- NOVI KOD ZA NOTIFIKACIJE (Ovo ti fali) ---

// Slušaj dolazne poruke (Push)
self.addEventListener('push', (event) => {
  let data = { title: 'Nova poruka', body: 'Imate novo obaveštenje.' };
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png', // Putanja do ikonice koju si stavio u manifest
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/' // Adresa koju otvara klik na notifikaciju
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Slušaj klik na samu notifikaciju
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Zatvori obaveštenje
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url) // Otvori dashboard
  );
});
