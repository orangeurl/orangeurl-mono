import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/settings',
          '/settings/',
          '/api-keys',
          '/api-keys/',
          '/admin',
          '/admin/',
          '/api/',
          '/sign-in',
          '/sign-up',
        ],
      },
    ],
    sitemap: 'https://app.orangeurl.live/sitemap.xml',
    host: 'https://app.orangeurl.live',
  };
}
