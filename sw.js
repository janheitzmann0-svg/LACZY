// LACZY — Service Worker (gehärtet)
// Strategie: Cache-First für die App-Shell. Voll offline-fähig nach erstem Laden.
// Cross-Origin-Anfragen werden auf eine explizite Whitelist beschränkt.

const VERSION = 'laczy-v4.5.0';
const CACHE = `laczy-cache-${VERSION}`;

// Alle für den Offline-Betrieb benötigten Dateien (Same-Origin).
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon.png',
  './detail-gs40-profil.jpg',
  './detail-anschluss-vertikal.jpg',
  './detail-anschluss-horizontal.jpg'
];

// Cross-Origin-Whitelist — nur diese Hosts dürfen Inhalte liefern.
// Alles andere wird verworfen, auch wenn die App es anfordern würde.
const ALLOWED_CROSS_ORIGIN = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com'
]);

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
// Strategie nach Asset-Typ:
//   - HTML + app.js: Network-First (verhindert Mischversionen nach Update)
//   - Bilder, Icons, manifest, Fonts: Cache-First (Offline-Performance)
const NETWORK_FIRST_RE = /\.(html|js)$/i;
const NETWORK_FIRST_EXACT = new Set(['', '/']);  // root '/'

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Nur http(s) — andere Schemas ignorieren
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Same-Origin
  if (url.origin === self.location.origin) {
    const path = url.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const isNetworkFirst = req.mode === 'navigate' ||
                           NETWORK_FIRST_RE.test(fileName) ||
                           NETWORK_FIRST_EXACT.has(fileName);

    if (isNetworkFirst) {
      // Network-First: immer versuchen, frisch zu laden. Cache nur als Offline-Fallback.
      event.respondWith(
        fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
      );
      return;
    }

    // Cache-First für statische Assets (Bilder, Manifest)
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

  // Cross-Origin: nur explizit erlaubte Hosts
  if (!ALLOWED_CROSS_ORIGIN.has(url.hostname)) {
    // Anfrage abweisen — Browser fällt auf eigenen Default zurück (i.d.R. Fehler)
    return;
  }

  // Stale-While-Revalidate für Whitelist
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
