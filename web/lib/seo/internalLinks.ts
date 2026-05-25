/**
 * Internal Linking Strategy
 * Manages internal links for better SEO and user navigation
 */

export interface InternalLink {
  href: string;
  text: string;
  title?: string;
  category: string;
  priority: number; // 1-10, higher is more important
}

/**
 * Core navigation links
 */
export const coreLinks: InternalLink[] = [
  {
    href: '/',
    text: 'URL Shortener',
    title: 'Free URL Shortener - Create Short Links',
    category: 'main',
    priority: 10,
  },
  {
    href: '/pricing',
    text: 'Pricing',
    title: 'Affordable URL Shortener Pricing Plans',
    category: 'main',
    priority: 9,
  },
  {
    href: '/features/short-links',
    text: 'Features',
    title: 'URL Shortener Features',
    category: 'main',
    priority: 8,
  },
  {
    href: '/about',
    text: 'About',
    title: 'About OrangeURL',
    category: 'main',
    priority: 7,
  },
];

/**
 * Feature links
 */
export const featureLinks: InternalLink[] = [
  {
    href: '/features/short-links',
    text: 'Custom Short Links',
    title: 'Create Custom Short Links with Branded Domains',
    category: 'features',
    priority: 9,
  },
  {
    href: '/features/lock-links',
    text: 'Password Protected Links',
    title: 'Secure Links with Password Protection',
    category: 'features',
    priority: 7,
  },
  {
    href: '/bio',
    text: 'Bio Link Pages',
    title: 'Create Bio Link Pages for Social Media',
    category: 'features',
    priority: 8,
  },
];

/**
 * Use case links
 */
export const useCaseLinks: InternalLink[] = [
  {
    href: '/use-cases/social-media',
    text: 'Social Media Marketing',
    title: 'URL Shortener for Social Media',
    category: 'use-cases',
    priority: 9,
  },
  {
    href: '/use-cases/email-marketing',
    text: 'Email Marketing',
    title: 'URL Shortener for Email Campaigns',
    category: 'use-cases',
    priority: 8,
  },
  {
    href: '/use-cases/qr-codes',
    text: 'QR Code Marketing',
    title: 'QR Code Generator for Marketing',
    category: 'use-cases',
    priority: 8,
  },
  {
    href: '/use-cases/influencer-marketing',
    text: 'Influencer Marketing',
    title: 'URL Shortener for Influencers',
    category: 'use-cases',
    priority: 7,
  },
];

/**
 * Competitor alternative links
 */
export const competitorLinks: InternalLink[] = [
  {
    href: '/bitly-alternative',
    text: 'Bitly Alternative',
    title: 'Best Bitly Alternative - Cheaper & Better',
    category: 'alternatives',
    priority: 9,
  },
  {
    href: '/alternatives/tinyurl',
    text: 'TinyURL Alternative',
    title: 'Better TinyURL Alternative',
    category: 'alternatives',
    priority: 8,
  },
  {
    href: '/alternatives/rebrandly',
    text: 'Rebrandly Alternative',
    title: 'Affordable Rebrandly Alternative',
    category: 'alternatives',
    priority: 8,
  },
];

/**
 * Resource links
 */
export const resourceLinks: InternalLink[] = [
  {
    href: '/blog',
    text: 'Blog',
    title: 'URL Shortener Blog & Resources',
    category: 'resources',
    priority: 7,
  },
  {
    href: '/comparison',
    text: 'URL Shortener Comparison',
    title: 'Compare URL Shorteners',
    category: 'resources',
    priority: 7,
  },
  {
    href: '/support',
    text: 'Support',
    title: 'Customer Support & Help Center',
    category: 'resources',
    priority: 6,
  },
];

/**
 * Get related links based on current page context
 */
export function getRelatedLinks(
  currentPath: string,
  category?: string,
  limit: number = 5
): InternalLink[] {
  const allLinks = [
    ...coreLinks,
    ...featureLinks,
    ...useCaseLinks,
    ...competitorLinks,
    ...resourceLinks,
  ];

  // Filter out current page
  const filteredLinks = allLinks.filter((link) => link.href !== currentPath);

  // If category is specified, prioritize links from that category
  if (category) {
    const categoryLinks = filteredLinks
      .filter((link) => link.category === category)
      .sort((a, b) => b.priority - a.priority);

    const otherLinks = filteredLinks
      .filter((link) => link.category !== category)
      .sort((a, b) => b.priority - a.priority);

    return [...categoryLinks, ...otherLinks].slice(0, limit);
  }

  // Otherwise, return by priority
  return filteredLinks.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

/**
 * Get contextual links based on keywords in the page
 */
export function getContextualLinks(
  keywords: string[],
  currentPath: string,
  limit: number = 3
): InternalLink[] {
  const allLinks = [
    ...coreLinks,
    ...featureLinks,
    ...useCaseLinks,
    ...competitorLinks,
    ...resourceLinks,
  ];

  // Score links based on keyword matches
  const scoredLinks = allLinks
    .filter((link) => link.href !== currentPath)
    .map((link) => {
      let score = link.priority;

      // Boost score if keywords match
      keywords.forEach((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        if (
          link.text.toLowerCase().includes(lowerKeyword) ||
          link.title?.toLowerCase().includes(lowerKeyword) ||
          link.href.toLowerCase().includes(lowerKeyword)
        ) {
          score += 5;
        }
      });

      return { ...link, score };
    })
    .sort((a, b) => b.score - a.score);

  return scoredLinks.slice(0, limit);
}

/**
 * Get breadcrumb links for a given path
 */
export function getBreadcrumbs(path: string): Array<{ name: string; href: string }> {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: Array<{ name: string; href: string }> = [
    { name: 'Home', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format segment name
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      name,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Generate footer links organized by category
 */
export function getFooterLinks(): Record<string, InternalLink[]> {
  return {
    Product: [
      ...coreLinks.filter((link) => link.href !== '/'),
      ...featureLinks.slice(0, 3),
    ],
    'Use Cases': useCaseLinks.slice(0, 4),
    Alternatives: competitorLinks,
    Resources: resourceLinks,
  };
}

/**
 * Get sitemap structure for navigation
 */
export function getSitemapStructure(): Record<string, InternalLink[]> {
  return {
    'Main Pages': coreLinks,
    Features: featureLinks,
    'Use Cases': useCaseLinks,
    Alternatives: competitorLinks,
    Resources: resourceLinks,
  };
}

