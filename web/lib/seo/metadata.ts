import { Metadata } from 'next';

/**
 * SEO Metadata Generator
 * Centralized metadata generation for consistent SEO across all pages
 */

const BASE_URL = 'https://app.orangeurl.live';
const SITE_NAME = 'OrangeURL';
const DEFAULT_IMAGE = '/images/og-image.png';

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  canonical?: string;
}

export function generateMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '',
    image = DEFAULT_IMAGE,
    type = 'website' as const,
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
    canonical,
  } = options;

  const url = `${BASE_URL}${path}`;
  const canonicalUrl = canonical || url;

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@orangeurl_app',
      site: '@orangeurl_app',
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      nocache: false,
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

/**
 * Generate schema.org JSON-LD structured data
 */
export interface SchemaOptions {
  type: 'Organization' | 'WebPage' | 'Article' | 'Product' | 'FAQPage' | 'HowTo' | 'BreadcrumbList';
  data: Record<string, any>;
}

export function generateSchema(options: SchemaOptions): string {
  const { type, data } = options;

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(baseSchema);
}

/**
 * Pre-configured schema generators
 */
export const schemaGenerators = {
  breadcrumb: (items: Array<{ name: string; url: string }>): string => {
    return generateSchema({
      type: 'BreadcrumbList',
      data: {
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    });
  },

  article: (data: {
    title: string;
    description: string;
    url: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: string;
  }): string => {
    return generateSchema({
      type: 'Article',
      data: {
        headline: data.title,
        description: data.description,
        url: data.url,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/images/logo-512.png`,
          },
        },
      },
    });
  },

  product: (data: {
    name: string;
    description: string;
    image: string;
    price: string;
    currency: string;
    availability: string;
  }): string => {
    return generateSchema({
      type: 'Product',
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.currency,
          availability: `https://schema.org/${data.availability}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '100',
          bestRating: '5',
          worstRating: '1',
        },
      },
    });
  },

  faq: (items: Array<{ question: string; answer: string }>): string => {
    return generateSchema({
      type: 'FAQPage',
      data: {
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    });
  },

  howTo: (data: {
    name: string;
    description: string;
    image: string;
    totalTime: string;
    steps: Array<{ name: string; text: string }>;
  }): string => {
    return generateSchema({
      type: 'HowTo',
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        totalTime: data.totalTime,
        step: data.steps.map((step) => ({
          '@type': 'HowToStep',
          name: step.name,
          text: step.text,
        })),
      },
    });
  },
};

/**
 * Common keyword sets for different page types
 */
export const keywordSets = {
  urlShortener: [
    'url shortener',
    'link shortener',
    'short link',
    'shorten url',
    'tiny url',
    'custom short links',
    'branded links',
    'link management',
  ],
  analytics: [
    'link analytics',
    'link tracking',
    'click tracking',
    'link statistics',
    'url analytics',
    'link performance',
  ],
  qrCode: [
    'qr code generator',
    'custom qr code',
    'qr code maker',
    'qr code creator',
    'branded qr code',
  ],
  social: [
    'bio link',
    'link in bio',
    'social media links',
    'instagram link',
    'twitter link',
    'social media marketing',
  ],
  business: [
    'business url shortener',
    'enterprise link management',
    'professional short links',
    'marketing links',
    'campaign tracking',
  ],
  alternatives: [
    'bitly alternative',
    'cheaper than bitly',
    'tinyurl alternative',
    'rebrandly alternative',
    'best url shortener',
  ],
};

/**
 * Generate comprehensive keywords for a page
 */
export function generateKeywords(
  primaryKeywords: string[],
  ...additionalSets: (keyof typeof keywordSets)[]
): string[] {
  const allKeywords = [...primaryKeywords];
  
  for (const setName of additionalSets) {
    allKeywords.push(...keywordSets[setName]);
  }
  
  return Array.from(new Set(allKeywords)); // Remove duplicates
}

