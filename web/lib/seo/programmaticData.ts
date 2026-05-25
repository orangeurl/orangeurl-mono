// Deterministic programmatic SEO data generator
// Produces at least 100,000 unique slugs and associated metadata

export type ProgrammaticItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string;
  updatedAt: string;
};

// Actual count based on generator combinations
export const PROGRAMMATIC_TOTAL = 74_255;
export const SITEMAP_CHUNK_SIZE = 25_000; // Keep well under 50k size limits

export const categories = [
  "saas",
  "starter",
  "template",
  "boilerplate",
  "component",
  "integration",
  "workflow",
  "automation",
  "guide",
  "playbook",
  "tutorial",
  "framework",
  "library",
  "tool",
  "platform",
  "api",
  "service",
  "solution",
  "kit",
  "builder",
];

// URL shortener specific use cases
export const useCases = [
  "social-media",
  "email-marketing",
  "sms-campaigns",
  "qr-codes",
  "print-advertising",
  "influencer-marketing",
  "affiliate-marketing",
  "event-promotion",
  "product-launches",
  "customer-support",
  "link-tracking",
  "brand-monitoring",
  "competitor-analysis",
  "utm-tracking",
  "bio-links",
  "landing-pages",
  "conversion-optimization",
  "a-b-testing",
  "retargeting",
  "analytics",
];

// Industries that use URL shorteners
export const industries = [
  "ecommerce",
  "retail",
  "healthcare",
  "education",
  "finance",
  "real-estate",
  "hospitality",
  "automotive",
  "technology",
  "media",
  "entertainment",
  "non-profit",
  "government",
  "consulting",
  "legal",
  "manufacturing",
  "construction",
  "agriculture",
  "logistics",
  "telecommunications",
];

// Platforms and integrations
export const platforms = [
  "twitter",
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "youtube",
  "pinterest",
  "reddit",
  "whatsapp",
  "telegram",
  "discord",
  "slack",
  "mailchimp",
  "hubspot",
  "salesforce",
  "zapier",
  "google-ads",
  "facebook-ads",
  "shopify",
  "wordpress",
];

// Competitor alternatives
export const competitors = [
  "bitly",
  "tinyurl",
  "rebrandly",
  "ow.ly",
  "short.io",
  "cutt.ly",
  "bl.ink",
  "t2m.io",
  "dub",
  "sniply",
  "branch.io",
  "firebase-dynamic-links",
  "smarturl",
  "linktr.ee",
  "bio.fm",
  "shorby",
];

// Geographic locations for local SEO
export const locations = [
  "usa",
  "uk",
  "canada",
  "australia",
  "germany",
  "france",
  "spain",
  "italy",
  "netherlands",
  "sweden",
  "norway",
  "denmark",
  "finland",
  "poland",
  "brazil",
  "mexico",
  "india",
  "singapore",
  "japan",
  "south-korea",
];

// Features
export const features = [
  "custom-domains",
  "branded-links",
  "link-analytics",
  "qr-code-generator",
  "link-expiration",
  "password-protection",
  "link-rotation",
  "geo-targeting",
  "device-targeting",
  "retargeting-pixels",
  "utm-builder",
  "link-cloaking",
  "deep-linking",
  "mobile-links",
  "api-access",
];

/**
 * Generate programmatic items deterministically
 * This creates combinations of categories, use cases, industries, etc.
 */
export function* generateProgrammaticItems(): Generator<ProgrammaticItem> {
  let count = 0;
  const baseDate = new Date('2024-01-01');

  // 1. Category-based pages (20 items)
  for (const category of categories) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `${category}`,
      title: `${capitalize(category)} URL Shortener - Best Short Links for ${capitalize(category)}`,
      description: `Professional URL shortening for ${category} projects. Create custom short links, track analytics, and boost your ${category} marketing campaigns.`,
      category: category,
      keywords: `${category} url shortener, ${category} link shortener, ${category} short links`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 2. Use case pages (20 items)
  for (const useCase of useCases) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `use-cases/${useCase}`,
      title: `URL Shortener for ${formatTitle(useCase)} - Track & Optimize Links`,
      description: `Optimize your ${formatTitle(useCase)} with powerful URL shortening. Track clicks, analyze performance, and increase engagement with custom short links.`,
      category: 'use-cases',
      keywords: `${useCase} url shortener, ${useCase} link tracking, ${useCase} short links`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 3. Industry pages (20 items)
  for (const industry of industries) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `industries/${industry}`,
      title: `URL Shortener for ${capitalize(industry)} - Industry-Leading Link Management`,
      description: `Tailored URL shortening solutions for the ${industry} industry. Manage, track, and optimize your marketing links with advanced analytics.`,
      category: 'industries',
      keywords: `${industry} url shortener, ${industry} link management, ${industry} marketing links`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 4. Platform integration pages (20 items)
  for (const platform of platforms) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `integrations/${platform}`,
      title: `${capitalize(platform)} URL Shortener - Seamless Integration & Tracking`,
      description: `Perfect URL shortener for ${capitalize(platform)}. Create trackable short links, monitor performance, and grow your ${platform} presence.`,
      category: 'integrations',
      keywords: `${platform} url shortener, ${platform} link shortener, ${platform} short links`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 5. Competitor alternative pages (15 items)
  for (const competitor of competitors) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `alternatives/${competitor}`,
      title: `Best ${capitalize(competitor)} Alternative - OrangeURL | Cheaper & Better`,
      description: `Looking for a ${competitor} alternative? OrangeURL offers better pricing, more features, and superior analytics. Switch today and save up to 70%.`,
      category: 'alternatives',
      keywords: `${competitor} alternative, cheaper than ${competitor}, ${competitor} vs orangeurl`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 6. Location-based pages (20 items)
  for (const location of locations) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `location/${location}`,
      title: `URL Shortener in ${location.toUpperCase()} - Fast & Reliable Link Shortening`,
      description: `Best URL shortener for ${location.toUpperCase()} businesses. Create branded short links with local targeting and comprehensive analytics.`,
      category: 'location',
      keywords: `url shortener ${location}, ${location} link shortener, ${location} short links`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 7. Feature-specific pages (15 items)
  for (const feature of features) {
    if (count >= PROGRAMMATIC_TOTAL) return;
    yield {
      slug: `features/${feature}`,
      title: `URL Shortener with ${formatTitle(feature)} - Advanced Link Management`,
      description: `Professional URL shortener featuring ${formatTitle(feature)}. Create powerful short links with advanced features and detailed analytics.`,
      category: 'features',
      keywords: `url shortener ${feature}, ${feature} link shortener, ${feature} short links`,
      updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
    };
    count++;
  }

  // 8. Combined use-case + industry pages (400 items = 20 × 20)
  for (const useCase of useCases) {
    for (const industry of industries) {
      if (count >= PROGRAMMATIC_TOTAL) return;
      yield {
        slug: `solutions/${useCase}-for-${industry}`,
        title: `${formatTitle(useCase)} URL Shortener for ${capitalize(industry)} Industry`,
        description: `Specialized URL shortening for ${formatTitle(useCase)} in ${industry}. Track performance, optimize campaigns, and grow your business.`,
        category: 'solutions',
        keywords: `${useCase} ${industry}, ${industry} ${useCase} links, ${useCase} url shortener ${industry}`,
        updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
      };
      count++;
    }
  }

  // 9. Combined platform + use-case pages (400 items = 20 × 20)
  for (const platform of platforms) {
    for (const useCase of useCases) {
      if (count >= PROGRAMMATIC_TOTAL) return;
      yield {
        slug: `guides/${platform}-${useCase}`,
        title: `${capitalize(platform)} ${formatTitle(useCase)} - URL Shortener Guide`,
        description: `Complete guide to ${formatTitle(useCase)} on ${capitalize(platform)} using OrangeURL. Best practices, tips, and strategies for success.`,
        category: 'guides',
        keywords: `${platform} ${useCase}, ${platform} url shortener, ${useCase} ${platform} guide`,
        updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
      };
      count++;
    }
  }

  // 10. Combined feature + industry pages (300 items = 15 × 20)
  for (const feature of features) {
    for (const industry of industries) {
      if (count >= PROGRAMMATIC_TOTAL) return;
      yield {
        slug: `tools/${feature}-for-${industry}`,
        title: `${formatTitle(feature)} for ${capitalize(industry)} - Professional URL Shortener`,
        description: `Advanced ${formatTitle(feature)} tailored for ${industry} businesses. Powerful link management with enterprise-grade features.`,
        category: 'tools',
        keywords: `${feature} ${industry}, ${industry} ${feature}, ${feature} url shortener ${industry}`,
        updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
      };
      count++;
    }
  }

  // 11. Triple combinations: platform + use-case + industry (8000 items = 20 × 20 × 20)
  for (const platform of platforms) {
    for (const useCase of useCases) {
      for (const industry of industries) {
        if (count >= PROGRAMMATIC_TOTAL) return;
        yield {
          slug: `resources/${platform}-${useCase}-${industry}`,
          title: `${capitalize(platform)} ${formatTitle(useCase)} for ${capitalize(industry)}`,
          description: `Master ${formatTitle(useCase)} on ${capitalize(platform)} for ${industry} with OrangeURL. Track, analyze, and optimize your marketing links.`,
          category: 'resources',
          keywords: `${platform} ${useCase} ${industry}, ${industry} ${platform} ${useCase}`,
          updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
        };
        count++;
      }
    }
  }

  // 12. Comparison pages: competitor + feature (225 items = 15 × 15)
  for (const competitor of competitors) {
    for (const feature of features) {
      if (count >= PROGRAMMATIC_TOTAL) return;
      yield {
        slug: `compare/${competitor}-vs-orangeurl-${feature}`,
        title: `${capitalize(competitor)} vs OrangeURL: ${formatTitle(feature)} Comparison`,
        description: `Compare ${capitalize(competitor)} and OrangeURL for ${formatTitle(feature)}. See why thousands choose OrangeURL for better features at lower prices.`,
        category: 'compare',
        keywords: `${competitor} vs orangeurl, ${competitor} alternative ${feature}, ${competitor} comparison`,
        updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
      };
      count++;
    }
  }

  // 13. Location + industry combinations (400 items = 20 × 20)
  for (const location of locations) {
    for (const industry of industries) {
      if (count >= PROGRAMMATIC_TOTAL) return;
      yield {
        slug: `local/${location}-${industry}`,
        title: `URL Shortener for ${capitalize(industry)} in ${location.toUpperCase()}`,
        description: `Best URL shortening service for ${industry} businesses in ${location.toUpperCase()}. Local support, fast performance, and comprehensive analytics.`,
        category: 'local',
        keywords: `${location} ${industry} url shortener, ${industry} ${location} link shortener`,
        updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
      };
      count++;
    }
  }

  // 14. Continue with more variations to reach 100,000
  // Category + platform combinations (400 items = 20 × 20)
  for (const category of categories) {
    for (const platform of platforms) {
      if (count >= PROGRAMMATIC_TOTAL) return;
      yield {
        slug: `hub/${category}-${platform}`,
        title: `${capitalize(category)} URL Shortener for ${capitalize(platform)} Marketing`,
        description: `Optimize your ${category} ${platform} marketing with powerful URL shortening. Track clicks, analyze campaigns, and boost engagement.`,
        category: 'hub',
        keywords: `${category} ${platform}, ${platform} ${category} links, ${category} url shortener ${platform}`,
        updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
      };
      count++;
    }
  }

  // 15. Quadruple combinations to fill remaining slots (continuing pattern)
  // This will generate the remaining items up to 100,000
  const fillerCategories = ['best', 'top', 'cheap', 'free', 'premium', 'enterprise', 'small-business', 'startup'];
  
  for (const filler of fillerCategories) {
    for (const platform of platforms) {
      for (const useCase of useCases) {
        for (const industry of industries) {
          if (count >= PROGRAMMATIC_TOTAL) return;
          yield {
            slug: `discover/${filler}-${platform}-${useCase}-${industry}`,
            title: `${capitalize(filler)} ${capitalize(platform)} URL Shortener for ${formatTitle(useCase)} in ${capitalize(industry)}`,
            description: `Discover the ${filler} URL shortener for ${formatTitle(useCase)} on ${capitalize(platform)} in the ${industry} industry. Professional link management made simple.`,
            category: 'discover',
            keywords: `${filler} url shortener, ${platform} ${useCase} ${industry}, ${filler} link shortener`,
            updatedAt: new Date(baseDate.getTime() + count * 86400000).toISOString(),
          };
          count++;
        }
      }
    }
  }
}

/**
 * Get a range of programmatic items efficiently
 */
export function getProgrammaticItemsRange(start: number, end: number): ProgrammaticItem[] {
  if (start < 0 || end > PROGRAMMATIC_TOTAL || start >= end) return [];
  
  const items: ProgrammaticItem[] = [];
  const gen = generateProgrammaticItems();
  
  // Skip to start position
  for (let i = 0; i < start; i++) {
    gen.next();
  }
  
  // Collect items in range
  for (let i = start; i < end; i++) {
    const result = gen.next();
    if (result.done) break;
    items.push(result.value);
  }
  
  return items;
}

/**
 * Get a specific page by index (0-indexed)
 * Note: For batch operations, use getProgrammaticItemsRange instead
 */
export function getProgrammaticItem(index: number): ProgrammaticItem | null {
  if (index < 0 || index >= PROGRAMMATIC_TOTAL) return null;
  
  const items = getProgrammaticItemsRange(index, index + 1);
  return items.length > 0 ? items[0] : null;
}

/**
 * Get a page by slug
 */
export function getProgrammaticItemBySlug(slug: string): ProgrammaticItem | null {
  for (const item of generateProgrammaticItems()) {
    if (item.slug === slug) {
      return item;
    }
  }
  return null;
}

/**
 * Get all slugs (for static generation)
 * WARNING: This returns 100,000 items - use with caution
 */
export function getAllProgrammaticSlugs(): string[] {
  const slugs: string[] = [];
  for (const item of generateProgrammaticItems()) {
    slugs.push(item.slug);
  }
  return slugs;
}

/**
 * Get items for a specific category
 */
export function getItemsByCategory(category: string, limit?: number): ProgrammaticItem[] {
  const items: ProgrammaticItem[] = [];
  for (const item of generateProgrammaticItems()) {
    if (item.category === category) {
      items.push(item);
      if (limit && items.length >= limit) break;
    }
  }
  return items;
}

// Helper functions
function capitalize(str: string): string {
  return str.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatTitle(str: string): string {
  return str.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

