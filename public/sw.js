const VERSION = "golink-v1";
const SHELL = ["/", "/manifest.webmanifest", "/icon.svg", "/apple-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API calls or slug lookups (they're dynamic/redirects)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) return;
  if (url.pathname !== "/" && !url.pathname.match(/\.(svg|png|ico|css|js|woff2?)$/)) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(VERSION).then((c) => c.put(req, clone)).catch(() => undefined);
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
