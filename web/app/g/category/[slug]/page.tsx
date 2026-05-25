/**
 * Category Pages - SEO Hub
 * Individual category pages with related content
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/InternalLinks';
import { getBreadcrumbs } from '@/lib/seo/internalLinks';
import { ArticleSchema } from '@/components/seo/SchemaMarkup';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Category data
const categoryData: Record<string, {
  name: string;
  description: string;
  icon: string;
  articles: Array<{
    title: string;
    slug: string;
    excerpt: string;
    readTime: string;
    date: string;
    tags: string[];
  }>;
}> = {
  'social-media-marketing': {
    name: 'Social Media Marketing',
    description: 'Master URL shortening for social media platforms. Learn how to create engaging short links for Twitter, Instagram, Facebook, LinkedIn, and TikTok to boost your social media ROI.',
    icon: '📱',
    articles: [
      {
        title: 'Instagram Link Optimization: Complete Guide 2025',
        slug: 'instagram-link-optimization-guide',
        excerpt: 'Learn how to maximize clicks on your Instagram links with custom short URLs, link tracking, and conversion optimization strategies.',
        readTime: '10 min',
        date: 'Jan 10, 2025',
        tags: ['Instagram', 'Link Optimization', 'Social Media'],
      },
      {
        title: 'Twitter Link Shortening Best Practices',
        slug: 'twitter-link-shortening-best-practices',
        excerpt: 'Optimize your Twitter marketing with custom short links. Track engagement, save characters, and increase click-through rates.',
        readTime: '8 min',
        date: 'Jan 8, 2025',
        tags: ['Twitter', 'Link Shortening', 'CTR Optimization'],
      },
      {
        title: 'TikTok Link Strategy for Creators',
        slug: 'tiktok-link-strategy-creators',
        excerpt: 'Drive traffic from TikTok with optimized short links. Learn the best practices for TikTok link sharing and tracking.',
        readTime: '7 min',
        date: 'Jan 5, 2025',
        tags: ['TikTok', 'Content Creators', 'Traffic Generation'],
      },
    ],
  },
  'qr-codes': {
    name: 'QR Codes',
    description: 'Everything about QR code marketing. Learn to create, customize, and track QR codes for offline marketing, packaging, events, and print advertising.',
    icon: '📊',
    articles: [
      {
        title: 'QR Code Marketing: Complete Beginners Guide',
        slug: 'qr-code-marketing-beginners-guide',
        excerpt: 'Start with QR code marketing from scratch. Learn how to create, customize, and track QR codes for your business.',
        readTime: '12 min',
        date: 'Jan 12, 2025',
        tags: ['QR Codes', 'Marketing', 'Beginners'],
      },
      {
        title: 'Dynamic vs Static QR Codes: Which Should You Use?',
        slug: 'dynamic-vs-static-qr-codes',
        excerpt: 'Understand the difference between dynamic and static QR codes and when to use each type for maximum effectiveness.',
        readTime: '6 min',
        date: 'Jan 9, 2025',
        tags: ['QR Codes', 'Comparison', 'Best Practices'],
      },
    ],
  },
  'link-analytics': {
    name: 'Link Analytics',
    description: 'Master link tracking and analytics. Learn to measure click-through rates, analyze traffic sources, and optimize your link performance with data-driven insights.',
    icon: '📈',
    articles: [
      {
        title: 'URL Analytics Guide: Track Every Click',
        slug: 'url-analytics-guide-track-clicks',
        excerpt: 'Comprehensive guide to link analytics. Learn which metrics matter and how to use data to improve your marketing ROI.',
        readTime: '15 min',
        date: 'Jan 11, 2025',
        tags: ['Analytics', 'Tracking', 'ROI'],
      },
    ],
  },
};

// Available categories for generateStaticParams
const availableCategories = [
  'social-media-marketing',
  'email-marketing',
  'qr-codes',
  'link-analytics',
  'influencer-marketing',
  'affiliate-marketing',
  'e-commerce',
  'seo-optimization',
  'business-tools',
  'mobile-marketing',
  'content-marketing',
  'brand-management',
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = categoryData[resolvedParams.slug];

  if (!data) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  return generateMeta({
    title: `${data.name} URL Shortener Guide | ${data.articles.length}+ Resources`,
    description: data.description,
    keywords: [
      `${resolvedParams.slug} url shortener`,
      `${data.name.toLowerCase()} link shortening`,
      `${resolvedParams.slug} guides`,
      'url shortener resources',
    ],
    path: `/g/category/${resolvedParams.slug}`,
  });
}

export async function generateStaticParams() {
  return availableCategories.map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = categoryData[resolvedParams.slug];

  if (!data) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/g' },
    { name: data.name, href: `/g/category/${resolvedParams.slug}` },
  ];

  return (
    <>
      <ArticleSchema
        title={data.name}
        description={data.description}
        url={`https://app.orangeurl.live/g/category/${resolvedParams.slug}`}
        image="https://app.orangeurl.live/images/og-image.png"
        datePublished="2024-01-01T00:00:00Z"
        dateModified={new Date().toISOString()}
        author="OrangeURL Team"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        {/* Category Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="text-6xl mb-4">{data.icon}</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {data.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            {data.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/">
                Try OrangeURL Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/g">Browse All Categories</Link>
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.articles.map((article, index) => (
              <Link key={index} href={`/blog/${article.slug}`}>
                <Card className="card-hover h-full border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{article.readTime} read</span>
                      <span className="text-sm text-muted-foreground">• {article.date}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Related Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Related Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableCategories
              .filter((cat) => cat !== resolvedParams.slug)
              .slice(0, 3)
              .map((catSlug) => (
                <Link key={catSlug} href={`/g/category/${catSlug}`}>
                  <Card className="card-hover border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold capitalize">
                        {catSlug.replace(/-/g, ' ')}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Using OrangeURL Today</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Apply these {data.name.toLowerCase()} strategies with our powerful URL shortener
          </p>
          <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
            <Link href="/">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

