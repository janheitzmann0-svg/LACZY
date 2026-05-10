// LACZY — Service Worker
// Strategie: Cache-First für die App-Shell. Voll offline-fähig nach erstem Laden.
// Bei neuer Version: alter Cache wird ersetzt, Clients werden benachrichtigt.

const VERSION = 'laczy-v2.0.0';
const CACHE = `laczy-cache-${VERSION}`;

// Alle für den Offline-Betrieb benötigten Dateien.
// Externe Schriften werden zur Laufzeit gecacht (siehe fetch-Handler).
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon.png'
];

// ─── Install: Core-Assets vorab cachen ───────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: alte Caches entsorgen ─────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch-Strategie ─────────────────────────────────────────────────
// Navigationsanfragen → Cache-First mit Fallback zur Index-Seite.
// Statische Assets (gleiche Origin) → Cache-First, im Hintergrund aktualisieren.
// Cross-Origin (Google Fonts etc.) → Stale-While-Revalidate.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Navigationsanfragen
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Same-Origin: Cache-First
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // Hintergrund-Update
          fetch(req).then((res) => {
            if (res && res.ok) {
              caches.open(CACHE).then((c) => c.put(req, res.clone()));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => caches.match('./'));
      })
    );
    return;
  }

  // Cross-Origin (Google Fonts u.ä.): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ─── Update-Mechanismus ──────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
