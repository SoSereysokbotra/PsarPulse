const CACHE_NAME = "psarpulse-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install event: Pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network-first for API, Cache-first for static/navigation
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Identify request scopes
  const isApi = url.pathname.startsWith("/api/");
  const isNavigate = event.request.mode === "navigate";
  const isMethodNotGet = event.request.method !== "GET";
  const isRSC = url.searchParams.has("_rsc") || event.request.headers.get("rsc") === "1" || event.request.headers.get("RSC") === "1";
  const isNextStatic = url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/_next/image");
  const isStaticAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff2?|map|ico)$/i);

  // Network-First for APIs, HTML navigations, Data payloads, and anything not explicitly a static asset
  if (isApi || isNavigate || isMethodNotGet || isRSC || (!isNextStatic && !isStaticAsset)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Cache successful GET responses for next time
          if (networkResponse.ok && event.request.method === "GET") {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // For navigations, fallback to offline markup or cache if available
          if (event.request.mode === "navigate") {
            return caches.match(event.request).then(res => res || caches.match("/"));
          }
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to keep cache fresh
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});

// Background Sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-data") {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "PROCESS_OFFLINE_QUEUE" });
        });
      })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
