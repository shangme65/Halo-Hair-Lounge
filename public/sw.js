// Service Worker for Halo Hair Lounge
// This is a minimal service worker to prevent 404 errors

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass through all fetch requests without caching
  event.respondWith(fetch(event.request));
});
