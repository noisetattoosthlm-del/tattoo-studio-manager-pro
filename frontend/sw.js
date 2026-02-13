const CACHE_NAME = 'dashboard-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html', // Proveri da li se fajl baš ovako zove
  '/style.css',      // Dodaj putanje do svojih CSS/JS fajlova
  '/script.js'
];

// Instalacija Service Worker-a i keširanje resursa
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivacija i brisanje starog keša
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Strategija: Mreža prvo, pa keš (bolje za dashboard sa podacima)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

