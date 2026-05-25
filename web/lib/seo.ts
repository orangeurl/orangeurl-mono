import type { Metadata } from 'next';

/**
 * Shared metadata helper for marketing/public pages.
 *
 * Produces a complete `Metadata` object with consistent canonical URLs,
 * OpenGraph + Twitter cards, and robots directives. Use this for any
 * public page; for noindex routes (dashboard, settings, api-keys), pass
 * `noindex: true`.
 */

export const SITE_URL = 'https://app.orangeurl.live';
export const SITE_NAME = 'OrangeURL';
export const DEFAULT_OG_IMAGE = '/images/og-image.png';
export const TWITTER_HANDLE = '@orangeurl_app';

export interface BuildMetadataOptions {
  /** Page-specific title (the layout template will append "| OrangeURL"). */
  title: string;
  /** Meta description. Keep under ~160 chars. */
  description: string;
  /** Path beginning with `/` (e.g. "/pricing"). Used for canonical + OG url. */
  path: string;
  /** Absolute or relative URL to a 1200x630 OG image. */
  image?: string;
  /** When true, sets robots noindex/nofollow. */
  noindex?: boolean;
  /** Optional extra keywords. */
  keywords?: string[];
  /** Optional OG type override (default "website"). */
  type?: 'website' | 'article';
}

function normalizeImage(image: string): string {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;
}

function normalizePath(path: string): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  keywords,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const normalizedPath = normalizePath(path);
  const canonical = `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;
  const ogImage = normalizeImage(image);

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
