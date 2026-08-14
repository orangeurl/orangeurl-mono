import type { MetadataRoute } from 'next';

const BASE_URL = 'https://app.orangeurl.live';

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Homepage
  const home: Entry = {
    url: BASE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  // Core marketing pages
  const marketing: Entry[] = [
    { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/team', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/support', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/docs', priority: 0.6, changeFrequency: 'monthly' as const },
  ].map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Feature pages
  const features: Entry[] = [
    '/features/short-links',
    '/features/lock-links',
    '/utm-builder',
    '/webhooks',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Integrations
  const integrations: Entry[] = [
    '/integrations/chrome-extension',
    '/integrations/zapier',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Comparison & landing pages
  const landing: Entry[] = [
    '/comparison',
    '/bitly-alternative',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog hub
  const blog: Entry[] = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Legal
  const legal: Entry[] = [
    '/privacy',
    '/terms',
    '/abuse',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [home, ...marketing, ...features, ...integrations, ...landing, ...blog, ...legal];
}
