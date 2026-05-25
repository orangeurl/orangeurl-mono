import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://app.orangeurl.live';
  const currentDate = new Date();
  
  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/short-links`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/lock-links`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bitly-alternative`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comparison`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // SEO Hub pages
    {
      url: `${baseUrl}/g`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Add SEO Hub category pages
  const categories = [
    'social-media-marketing', 'email-marketing', 'qr-codes', 'link-analytics',
    'influencer-marketing', 'affiliate-marketing', 'e-commerce', 'seo-optimization',
    'business-tools', 'mobile-marketing', 'content-marketing', 'brand-management'
  ];
  
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/g/category/${cat}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Add SEO Hub keyword pages
  const keywords = [
    'bitly-alternative', 'free-url-shortener', 'custom-short-links', 'qr-code-generator',
    'link-tracking', 'branded-links', 'url-analytics',
    'short-link-seo', 'link-management', 'utm-tracking', 'campaign-links'
  ];
  
  const keywordPages: MetadataRoute.Sitemap = keywords.map((kw) => ({
    url: `${baseUrl}/g/keyword/${kw}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Note: Programmatic SEO pages (100,000+ URLs) are served via separate sitemap chunks
  // See sitemap-0.xml, sitemap-1.xml, etc. and sitemap-index.xml for the full list
  // This main sitemap only includes core pages to prevent timeouts

  return [...corePages, ...categoryPages, ...keywordPages];
}
