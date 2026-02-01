/**
 * Service Worker Registration
 * Register and manage the service worker for offline capability
 */

(function() {
  'use strict';

  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  }

  async function registerServiceWorker() {
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[SW] Service Worker registered successfully:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[SW] New Service Worker found, installing...');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('[SW] New content available, please refresh.');
            showUpdateNotification();
          }
        });
      });

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  }

  function showUpdateNotification() {
    // Optional: Show a notification to the user
    // You can customize this to show a toast/banner
    if (confirm('New content available! Click OK to refresh.')) {
      window.location.reload();
    }
  }

  // Listen for controller change
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    console.log('[SW] Controller changed, reloading page');
    window.location.reload();
  });

  // Expose utility functions
  window.swUtils = {
    // Unregister service worker
    async unregister() {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('[SW] Service Worker unregistered');
      }
    },

    // Clear cache
    async clearCache() {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        registration.active.postMessage({ type: 'CLEAR_CACHE' });
      }
    },

    // Get cache status
    async getCacheStatus() {
      const cacheNames = await caches.keys();
      return cacheNames;
    }
  };

})();
