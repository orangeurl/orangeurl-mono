/**
 * SEO Helper Utilities
 * Common SEO-related helper functions
 */

/**
 * Generate clean URL slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, count: number = 10): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3); // Filter out short words

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * Generate reading time estimate
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Clean HTML for meta descriptions
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, baseUrl: string = 'https://app.orangeurl.live'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Generate Open Graph image URL
 */
export function generateOgImageUrl(
  title: string,
  description?: string,
  baseUrl: string = 'https://app.orangeurl.live'
): string {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });
  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string, baseUrl: string = 'https://app.orangeurl.live'): boolean {
  try {
    const urlObj = new URL(url, baseUrl);
    const baseUrlObj = new URL(baseUrl);
    return urlObj.hostname !== baseUrlObj.hostname;
  } catch {
    return false;
  }
}

/**
 * Generate structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return JSON.stringify(schema);
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Format date for SEO (ISO 8601)
 */
export function formatSeoDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * Generate alt text for images from filename
 */
export function generateAltText(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes and underscores
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
}

/**
 * Validate meta description length
 */
export function validateMetaDescription(description: string): {
  valid: boolean;
  length: number;
  message: string;
} {
  const length = description.length;
  const minLength = 120;
  const maxLength = 160;

  if (length < minLength) {
    return {
      valid: false,
      length,
      message: `Too short. Recommended: ${minLength}-${maxLength} characters.`,
    };
  }

  if (length > maxLength) {
    return {
      valid: false,
      length,
      message: `Too long. Recommended: ${minLength}-${maxLength} characters.`,
    };
  }

  return {
    valid: true,
    length,
    message: 'Perfect length!',
  };
}

/**
 * Validate title length for SEO
 */
export function validateTitle(title: string): {
  valid: boolean;
  length: number;
  message: string;
} {
  const length = title.length;
  const minLength = 30;
  const maxLength = 60;

  if (length < minLength) {
    return {
      valid: false,
      length,
      message: `Too short. Recommended: ${minLength}-${maxLength} characters.`,
    };
  }

  if (length > maxLength) {
    return {
      valid: false,
      length,
      message: `Too long. Recommended: ${minLength}-${maxLength} characters.`,
    };
  }

  return {
    valid: true,
    length,
    message: 'Perfect length!',
  };
}

