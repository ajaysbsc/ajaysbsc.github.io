/**
 * Progressive Image Loader with WebP Support
 * Automatically handles modern image formats with fallbacks
 */

(function() {
  'use strict';

  /**
   * Check if browser supports WebP
   */
  function supportsWebP() {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  /**
   * Get the best image source based on browser support
   */
  function getBestImageSource(imagePath) {
    const hasWebP = supportsWebP();
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    if (hasWebP) {
      // Check if WebP version exists by attempting to load it
      return webpPath;
    }

    return imagePath;
  }

  /**
   * Lazy load images when they enter viewport
   */
  function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
      });

      images.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback: load all images immediately
      images.forEach(img => loadImage(img));
    }
  }

  /**
   * Load an image with WebP fallback
   */
  function loadImage(img) {
    const originalSrc = img.dataset.src || img.src;

    if (!originalSrc) return;

    // Try WebP first if supported
    const imageSrc = getBestImageSource(originalSrc);

    const tempImg = new Image();

    tempImg.onload = function() {
      img.src = imageSrc;
      img.classList.add('loaded');

      // Fire custom event
      img.dispatchEvent(new CustomEvent('imageloaded', {
        detail: { src: imageSrc }
      }));
    };

    tempImg.onerror = function() {
      // Fallback to original if WebP fails
      if (imageSrc !== originalSrc) {
        img.src = originalSrc;
        img.classList.add('loaded');
      }
    };

    tempImg.src = imageSrc;
  }

  /**
   * Create picture element with WebP support
   */
  function createResponsivePicture(imagePath, alt = '', className = '') {
    const picture = document.createElement('picture');

    // WebP source
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.srcset = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    // Original format source
    const originalExt = imagePath.match(/\.(jpg|jpeg|png)$/i)[0];
    const mimeType = originalExt.toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
    const originalSource = document.createElement('source');
    originalSource.type = mimeType;
    originalSource.srcset = imagePath;

    // Fallback img
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';

    picture.appendChild(webpSource);
    picture.appendChild(originalSource);
    picture.appendChild(img);

    return picture;
  }

  /**
   * Preload critical images
   */
  function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('[data-preload="true"]');

    criticalImages.forEach(img => {
      const src = img.dataset.src || img.src;
      if (src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = getBestImageSource(src);

        if (supportsWebP()) {
          link.type = 'image/webp';
        }

        document.head.appendChild(link);
      }
    });
  }

  /**
   * Initialize on page load
   */
  function init() {
    // Store WebP support in sessionStorage for quick access
    sessionStorage.setItem('webp-support', supportsWebP());

    // Preload critical images
    preloadCriticalImages();

    // Setup lazy loading
    setupLazyLoading();

    // Expose utilities
    window.imageLoader = {
      supportsWebP,
      getBestImageSource,
      createResponsivePicture,
      loadImage
    };
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
