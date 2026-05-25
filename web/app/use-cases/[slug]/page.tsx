/**
 * Use Case Pages
 * SEO-optimized pages for different use cases
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  BarChart3,
  Shield,
  Globe,
  TrendingUp,
  Users
} from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/seo/metadata';
import { InternalLinks, Breadcrumbs } from '@/components/seo/InternalLinks';
import { getBreadcrumbs } from '@/lib/seo/internalLinks';
import { ArticleSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { useCases } from '@/lib/seo/programmaticData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Use case data
const useCaseData: Record<string, {
  title: string;
  description: string;
  benefits: string[];
  features: string[];
  stats: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
}> = {
  'social-media': {
    title: 'URL Shortener for Social Media Marketing',
    description: 'Optimize your social media presence with trackable short links. Perfect for Instagram, Twitter, Facebook, LinkedIn, and more. Track clicks, engagement, and ROI across all platforms.',
    benefits: [
      'Fit more content in character-limited posts',
      'Track engagement across different platforms',
      'Create memorable, branded links',
      'Boost click-through rates by up to 39%',
      'A/B test different link variations',
      'Measure social media ROI accurately',
    ],
    features: [
      'Platform-specific analytics',
      'UTM parameter automation',
      'Link scheduling',
      'Bio link pages',
      'QR codes for offline-to-online',
      'Team collaboration tools',
    ],
    stats: [
      { label: 'Avg CTR Increase', value: '39%' },
      { label: 'Social Platforms', value: '15+' },
      { label: 'Links Created', value: '500K+' },
      { label: 'Brands Trust Us', value: '1000+' },
    ],
    faqs: [
      {
        question: 'How does a URL shortener help social media marketing?',
        answer: 'URL shorteners make links look cleaner, save character space, and provide detailed analytics about who clicks your links. This helps you understand which platforms and content types drive the most engagement.',
      },
      {
        question: 'Can I track which social platform drives the most clicks?',
        answer: 'Yes! OrangeURL provides detailed analytics showing exactly which platforms, posts, and campaigns drive clicks. You can segment by platform, device, location, and more.',
      },
      {
        question: 'Do shortened URLs work on all social media platforms?',
        answer: 'Absolutely! Our shortened URLs work on Instagram, Twitter, Facebook, LinkedIn, TikTok, Pinterest, and all other major social platforms.',
      },
    ],
  },
  'email-marketing': {
    title: 'URL Shortener for Email Marketing Campaigns',
    description: 'Enhance your email marketing with clean, trackable links. Monitor campaign performance, increase click-through rates, and optimize your email strategy with detailed analytics.',
    benefits: [
      'Clean, professional-looking links in emails',
      'Track email campaign performance',
      'Reduce spam filter triggers',
      'A/B test different CTAs',
      'Integrate with email platforms',
      'Boost deliverability rates',
    ],
    features: [
      'Campaign tracking',
      'Click heatmaps',
      'Device analytics',
      'Time-based reporting',
      'API integration',
      'Custom domains',
    ],
    stats: [
      { label: 'Email CTR Boost', value: '27%' },
      { label: 'Campaigns Tracked', value: '100K+' },
      { label: 'Emails Sent', value: '50M+' },
      { label: 'Integration Partners', value: '20+' },
    ],
    faqs: [
      {
        question: 'Will shortened URLs affect email deliverability?',
        answer: 'No! OrangeURL uses trusted domains with excellent sender reputation. Our links actually improve deliverability by making emails look cleaner and more professional.',
      },
      {
        question: 'Can I integrate with my email marketing platform?',
        answer: 'Yes! We offer API integration and work seamlessly with Mailchimp, SendGrid, Constant Contact, and other major email platforms.',
      },
    ],
  },
  'qr-codes': {
    title: 'QR Code Generator for Marketing & Business',
    description: 'Create custom QR codes with your brand colors and logo. Perfect for print marketing, packaging, events, and offline-to-online campaigns. Track scans and measure offline marketing ROI.',
    benefits: [
      'Bridge offline and online marketing',
      'Track physical marketing performance',
      'Customize QR codes with branding',
      'Update destination without reprinting',
      'Measure event and print campaign ROI',
      'Generate bulk QR codes',
    ],
    features: [
      'Custom branded QR codes',
      'Dynamic QR codes (editable)',
      'Scan analytics',
      'Bulk generation',
      'High-resolution downloads',
      'Multiple design styles',
    ],
    stats: [
      { label: 'QR Codes Created', value: '250K+' },
      { label: 'Scans Tracked', value: '5M+' },
      { label: 'Design Styles', value: '10+' },
      { label: 'Industries Served', value: '50+' },
    ],
    faqs: [
      {
        question: 'What\'s the difference between static and dynamic QR codes?',
        answer: 'Dynamic QR codes let you change the destination URL after printing, track scans, and gather analytics. Static QR codes are permanent and can\'t be edited.',
      },
      {
        question: 'Can I use my brand colors in QR codes?',
        answer: 'Yes! OrangeURL allows full customization of QR code colors, styles, and even adding your logo in the center.',
      },
    ],
  },
  'influencer-marketing': {
    title: 'URL Shortener for Influencers & Content Creators',
    description: 'Perfect for influencers, YouTubers, and content creators. Create memorable bio links, track affiliate performance, and optimize your monetization strategy with detailed analytics.',
    benefits: [
      'Memorable links for your audience',
      'Track affiliate link performance',
      'Multiple links in bio (Link in Bio page)',
      'Professional brand presence',
      'Monetization analytics',
      'Partner performance tracking',
    ],
    features: [
      'Bio link pages',
      'Affiliate link tracking',
      'Revenue attribution',
      'Audience analytics',
      'Custom branding',
      'QR codes for content',
    ],
    stats: [
      { label: 'Influencers Using', value: '5K+' },
      { label: 'Total Followers', value: '100M+' },
      { label: 'Revenue Tracked', value: '$50M+' },
      { label: 'Platforms Supported', value: '15+' },
    ],
    faqs: [
      {
        question: 'Can I track which content drives the most clicks?',
        answer: 'Yes! You can create unique links for each piece of content and see exactly which videos, posts, or stories drive the most engagement.',
      },
      {
        question: 'Do you support affiliate link tracking?',
        answer: 'Absolutely! Track clicks, conversions, and revenue from all your affiliate partnerships in one dashboard.',
      },
    ],
  },
};

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = useCaseData[resolvedParams.slug];

  if (!data) {
    return {
      title: 'Use Case Not Found',
      robots: { index: false, follow: false },
    };
  }

  return generateMeta({
    title: data.title,
    description: data.description,
    keywords: [
      `${resolvedParams.slug} url shortener`,
      `${resolvedParams.slug} link tracking`,
      `${resolvedParams.slug} analytics`,
      'url shortener',
      'link management',
    ],
    path: `/use-cases/${resolvedParams.slug}`,
    type: 'article',
  });
}

// Generate static paths
export async function generateStaticParams() {
  return useCases.map((slug) => ({ slug }));
}

// Disable static generation to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default async function UseCasePage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = useCaseData[resolvedParams.slug];

  if (!data) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbs(`/use-cases/${resolvedParams.slug}`);

  return (
    <>
      {/* Schema Markup */}
      <ArticleSchema
        title={data.title}
        description={data.description}
        url={`https://app.orangeurl.live/use-cases/${resolvedParams.slug}`}
        image="https://app.orangeurl.live/images/og-image.png"
        datePublished="2024-01-01T00:00:00Z"
        dateModified={new Date().toISOString()}
        author="OrangeURL Team"
      />
      <FAQSchema items={data.faqs} />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            {data.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {data.stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl font-bold gradient-text-primary">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.benefits.map((benefit, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{benefit}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features You'll Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {data.faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands using OrangeURL to optimize their {resolvedParams.slug.replace(/-/g, ' ')} strategy.
          </p>
          <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
            <Link href="/">
              Start Free Today
              <TrendingUp className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Related Pages */}
        <InternalLinks
          currentPath={`/use-cases/${resolvedParams.slug}`}
          category="use-cases"
          limit={6}
          title="Explore More Use Cases"
        />
      </div>
    </>
  );
}

