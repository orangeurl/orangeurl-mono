/**
 * Performance Utilities
 * Helper functions for optimizing performance
 */

/**
 * Debounce function for reducing API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for rate limiting
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.unobserve(img);
      }
    });
  }, options);

  observer.observe(img);
  return observer;
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

/**
 * Measure performance metrics
 */
export function measurePerformance(name: string, callback: () => void) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
  return duration;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Optimize images with srcset
 */
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(', ');
}

/**
 * Cache data in localStorage with expiration
 */
export function cacheData<T>(key: string, data: T, expirationMs: number): void {
  const item = {
    data,
    expiration: Date.now() + expirationMs,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get cached data from localStorage
 */
export function getCachedData<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsed = JSON.parse(item);
  if (Date.now() > parsed.expiration) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
}

/**
 * Prefetch route for faster navigation
 */
export function prefetchRoute(href: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Optimize animations based on device performance
 */
export function getOptimizedAnimationConfig() {
  // Check if device is low-end based on hardware concurrency
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
  
  return {
    duration: isLowEnd ? 0.2 : 0.6,
    ease: isLowEnd ? 'easeOut' : [0.6, -0.05, 0.01, 0.99],
    reducedMotion: prefersReducedMotion(),
  };
}

