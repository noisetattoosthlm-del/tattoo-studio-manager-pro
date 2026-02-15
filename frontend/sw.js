const CACHE_NAME = 'dashboard-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html', 
  '/style.css',      
  '/script.js'
];

// 1. KEŠIRANJE (Instalacija i aktivacija)
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

// 2. PUSH NOTIFIKACIJE - Ovde hvatamo podsetnike za termine
self.addEventListener('push', (event) => {
  let data = { 
    title: 'Tattoo Studio', 
    body: 'Imate zakazan termin uskoro!' 
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png', // Proveri da li imaš ovu sliku u root folderu
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'appointment-reminder', // Sprečava gomilanje više istih notifikacija
    renotify: true,
    data: {
      url: '/dashboard.html' // Putanja koju otvara na klik
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 3. KLIK NA NOTIFIKACIJU
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Zatvori notifikaciju

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Ako je aplikacija već otvorena, fokusiraj se na taj tab
      for (const client of clientList) {
        if (client.url.includes('/dashboard.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Ako nije otvorena, otvori novu
      if (clients.openWindow) {
        return clients.openWindow('/dashboard.html');
      }
    })
  );
});
