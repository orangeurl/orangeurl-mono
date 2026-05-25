/**
 * Security utilities for URL validation and sanitization
 */

/**
 * Validates if a URL is safe to redirect to
 * Only allows http:// and https:// protocols to prevent XSS and phishing
 */
export function isSecureRedirectURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      console.warn('[Security] Blocked potentially malicious URL with protocol:', parsedUrl.protocol);
      return false;
    }

    // Block localhost and local network redirects in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      const hostname = parsedUrl.hostname.toLowerCase();

      // Block localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        console.warn('[Security] Blocked localhost redirect');
        return false;
      }

      // Block private IP ranges (10.x.x.x, 172.16.x.x-172.31.x.x, 192.168.x.x)
      if (
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
      ) {
        console.warn('[Security] Blocked private IP redirect');
        return false;
      }
    }

    return true;
  } catch (error) {
    // Invalid URL format
    console.warn('[Security] Invalid URL format:', url);
    return false;
  }
}

/**
 * Validates if a URL uses only allowed protocols (http/https)
 */
export function validateURLProtocol(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim().toLowerCase();

  // Check for dangerous protocols
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
    'blob:',
  ];

  for (const protocol of dangerousProtocols) {
    if (trimmedUrl.startsWith(protocol)) {
      console.warn('[Security] Blocked dangerous protocol:', protocol);
      return false;
    }
  }

  return true;
}

/**
 * Validates custom short URL for alphanumeric characters only
 * Prevents path traversal and XSS attacks
 */
export function validateCustomShortURL(shortUrl: string): boolean {
  if (!shortUrl || typeof shortUrl !== 'string') {
    return false;
  }

  // Only allow alphanumeric characters (a-z, A-Z, 0-9), hyphens, and underscores
  // Length between 1 and 50 characters
  const regex = /^[a-zA-Z0-9_-]{1,50}$/;

  if (!regex.test(shortUrl)) {
    console.warn('[Security] Invalid custom short URL format:', shortUrl);
    return false;
  }

  // Block common attack patterns
  const blockedPatterns = ['..', './', '\\', '<', '>', '"', "'", '`'];
  for (const pattern of blockedPatterns) {
    if (shortUrl.includes(pattern)) {
      console.warn('[Security] Blocked pattern in custom short URL:', pattern);
      return false;
    }
  }

  return true;
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '');
}
