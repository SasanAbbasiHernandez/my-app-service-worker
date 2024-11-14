/* eslint no-restricted-globals: ["error", "name", "length"] */

// src/serviceWorker.js
const CACHE_NAME = "my-cache-v1.1"; // Cambia el nombre del caché con cada nueva versión

self.addEventListener("install", event => {
  self.skipWaiting(); // Forzar que tome control inmediatamente
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Elimina cachés viejos
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(newResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, newResponse.clone());
          return newResponse;
        });
      });
    })
  );
});

// Registra el service worker
export function register(config) {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
  
        navigator.serviceWorker
          .register(swUrl)
          .then(registration => {
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // Nueva actualización disponible
                    if (window.confirm("Nueva versión disponible. ¿Deseas actualizar?")) {
                      window.location.reload();
                    }
                  }
                }
              };
            };
          })
          .catch(error => {
            console.error("Error registrando el service worker:", error);
          });
      });
    }
  }
