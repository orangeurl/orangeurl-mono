/**
 * Programmatic SEO Pages
 * Dynamically generates 100,000+ SEO-optimized pages
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  BarChart3, 
  Shield,
  QrCode,
  Link as LinkIcon,
  Globe,
  TrendingUp
} from 'lucide-react';
import { 
  getProgrammaticItemBySlug, 
  getAllProgrammaticSlugs,
  ProgrammaticItem 
} from '@/lib/seo/programmaticData';
import { generateMetadata as generateMeta } from '@/lib/seo/metadata';
import { InternalLinks, Breadcrumbs } from '@/components/seo/InternalLinks';
import { getBreadcrumbs } from '@/lib/seo/internalLinks';
import { BreadcrumbSchema, ArticleSchema } from '@/components/seo/SchemaMarkup';

// Disable static generation to avoid prerendering issues with client components
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const item = getProgrammaticItemBySlug(slug);

  if (!item) {
    return {
      title: 'Page Not Found',
      robots: { index: false, follow: false },
    };
  }

  const metadata = generateMeta({
    title: item.title,
    description: item.description,
    keywords: item.keywords.split(', '),
    path: `/seo/${slug}`,
    type: 'article',
    modifiedTime: item.updatedAt,
  });

  // Add explicit canonical URL to fix duplicate content issues
  return {
    ...metadata,
    alternates: {
      canonical: `https://app.orangeurl.live/seo/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

// Generate static paths for top priority pages
// Note: We're only pre-rendering a subset due to build time constraints
// Removed generateStaticParams to avoid prerendering issues
// Pages will be generated on-demand

// Enable ISR - revalidate every 7 days
export const revalidate = 604800;

export default async function ProgrammaticSEOPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const item = getProgrammaticItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbs(`/seo/${slug}`);
  const currentDate = new Date().toISOString();

  return (
    <>
      {/* Schema Markup */}
      <BreadcrumbSchema 
        items={breadcrumbs.map(b => ({ 
          name: b.name, 
          url: `https://app.orangeurl.live${b.href}` 
        }))} 
      />
      <ArticleSchema
        title={item.title}
        description={item.description}
        url={`https://app.orangeurl.live/seo/${slug}`}
        image="https://app.orangeurl.live/images/og-image.png"
        datePublished={item.updatedAt}
        dateModified={currentDate}
        author="OrangeURL Team"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {item.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            {item.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/">
                Start Shortening URLs Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Lightning Fast',
              description: 'Create short links in milliseconds with our optimized infrastructure',
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: 'Advanced Analytics',
              description: 'Track clicks, geographic data, and user behavior in real-time',
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: 'Enterprise Security',
              description: 'Bank-grade security with SSL encryption and fraud protection',
            },
            {
              icon: <QrCode className="w-8 h-8" />,
              title: 'Custom QR Codes',
              description: 'Generate branded QR codes with your custom colors and logo',
            },
            {
              icon: <LinkIcon className="w-8 h-8" />,
              title: 'Branded Links',
              description: 'Use custom domains for professional branded short links',
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: 'Global CDN',
              description: 'Fast redirects worldwide with our global CDN network',
            },
          ].map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Why Choose OrangeURL for {extractMainKeyword(item.title)}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Unlimited short links on all plans',
                  'Real-time click analytics and insights',
                  'Custom branded domains included',
                  'QR code generator with customization',
                  'Password-protected secure links',
                  'Link expiration and scheduling',
                  'Geo-targeting capabilities',
                  'API access for developers',
                  'Priority customer support',
                  'GDPR compliant and secure',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Paste Your URL',
                description: 'Enter your long URL into our shortener tool',
              },
              {
                step: '2',
                title: 'Customize & Create',
                description: 'Add custom slug, QR code, or password protection',
              },
              {
                step: '3',
                title: 'Share & Track',
                description: 'Share your short link and monitor analytics in real-time',
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Users', value: '10,000+' },
              { label: 'Links Created', value: '1M+' },
              { label: 'Countries Served', value: '150+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold gradient-text-primary">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Links?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of businesses and individuals using OrangeURL to create, manage, and track their short links.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <Link href="/">
                Get Started Free
                <TrendingUp className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" asChild>
              <Link href="/pricing">Compare Plans</Link>
            </Button>
          </div>
        </div>

        {/* Related Pages */}
        <InternalLinks
          currentPath={`/seo/${slug}`}
          category={item.category}
          keywords={item.keywords.split(', ')}
          limit={6}
          title="Explore Related Solutions"
        />
      </div>
    </>
  );
}

// Helper function to extract main keyword
function extractMainKeyword(title: string): string {
  // Remove common words and extract the meaningful part
  const cleaned = title
    .replace(/URL Shortener|Link Shortener|Short Links|Best|Top|for|the|and|-|–/gi, '')
    .trim();
  return cleaned || 'Link Management';
}

