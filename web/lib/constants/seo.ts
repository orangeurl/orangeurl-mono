/**
 * SEO Constants
 * Centralized SEO-related constants for consistency
 */

export const SEO_CONFIG = {
  siteName: 'OrangeURL',
  siteUrl: 'https://app.orangeurl.live',
  defaultTitle: 'OrangeURL - Fast & Secure URL Shortener',
  defaultDescription: 'Create short, memorable links with advanced analytics and custom domains. Professional URL shortening service with QR codes, link tracking, and branded links.',
  twitterHandle: '@orangeurl_app',
  logoUrl: '/images/logo-512.png',
  ogImageUrl: '/images/og-image.png',
} as const;

export const META_DEFAULTS = {
  titleTemplate: '%s | OrangeURL',
  descriptionMaxLength: 160,
  descriptionMinLength: 120,
  titleMaxLength: 60,
  titleMinLength: 30,
  keywordsLimit: 15,
} as const;

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/orangeurl_app',
  discord: 'https://discord.gg/FvJtFw64WV',
  github: 'https://github.com/orangeurl',
} as const;

export const CONTACT = {
  support: 'support@orangeurl.live',
  features: 'feature@orangeurl.live',
  business: 'business@orangeurl.live',
} as const;

// Primary keywords for URL shortener SEO
export const PRIMARY_KEYWORDS = [
  'url shortener',
  'link shortener',
  'short link',
  'custom url shortener',
  'branded links',
  'qr code generator',
  'link analytics',
  'link tracking',
  'link management',
] as const;

// Competitor keywords for SEO
export const COMPETITOR_KEYWORDS = [
  'bitly alternative',
  'cheaper than bitly',
  'tinyurl alternative',
  'rebrandly alternative',
  'best url shortener',
  'affordable url shortener',
] as const;

// Use case keywords
export const USE_CASE_KEYWORDS = [
  'social media link shortener',
  'email marketing links',
  'influencer marketing',
  'qr code marketing',
  'affiliate link tracking',
  'campaign tracking',
] as const;

// Geographic targeting keywords
export const GEO_KEYWORDS = [
  'url shortener usa',
  'url shortener uk',
  'url shortener canada',
  'url shortener australia',
  'url shortener europe',
] as const;

// Feature-specific keywords
export const FEATURE_KEYWORDS = [
  'custom domain url shortener',
  'password protected links',
  'link expiration',
  'qr code customization',
  'link analytics dashboard',
  'api url shortener',
] as const;

