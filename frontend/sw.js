console.log("SW VERSION 3 LOADED");

const CACHE_NAME = 'dashboard-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys =>
        Promise.all(keys.map(k => caches.delete(k)))
      )
    ])
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

// PUSH NOTIFIKACIJE
self.addEventListener('push', event => {
  let data = {
    title: 'Tattoo Studio',
    body: 'Imate zakazan termin uskoro'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'appointment',
      renotify: true,
      data: { url: '/dashboard.html' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/dashboard.html'));
});
