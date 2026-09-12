// Service Worker v100 - TOMBSTONE
// Questo SW esiste solo per deregistrare se stesso e cancellare cache precedenti.
// Non intercetta nessuna richiesta di rete.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});

// Non intercetta nulla
self.addEventListener('fetch', () => { return; });
