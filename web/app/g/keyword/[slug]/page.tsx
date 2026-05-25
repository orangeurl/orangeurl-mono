/**
 * Keyword Pages - SEO Hub
 * Individual keyword/topic pages with related content
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, TrendingUp, Tag } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/InternalLinks';
import { ArticleSchema, FAQSchema } from '@/components/seo/SchemaMarkup';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Keyword data
const keywordData: Record<string, {
  name: string;
  description: string;
  searches: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  relatedKeywords: string[];
  faqs: Array<{ question: string; answer: string }>;
}> = {
  'bitly-alternative': {
    name: 'Bitly Alternative',
    description: 'Looking for a Bitly alternative? Discover better and more affordable URL shorteners with advanced features, custom domains, and detailed analytics. Compare pricing, features, and find the perfect Bitly replacement for your business.',
    searches: '12K/mo',
    difficulty: 'Medium',
    relatedKeywords: ['cheaper than bitly', 'bitly vs orangeurl', 'best bitly alternative', 'free bitly alternative'],
    faqs: [
      {
        question: 'What is the best alternative to Bitly?',
        answer: 'OrangeURL is considered one of the best Bitly alternatives, offering similar features at 70% lower cost. It provides custom short links, advanced analytics, QR codes, and custom domains starting at just $5/month compared to Bitly\'s $29/month.',
      },
      {
        question: 'Why switch from Bitly to another URL shortener?',
        answer: 'Common reasons include high pricing, limited features on free tier, lack of advanced customization, and restricted analytics. Alternatives like OrangeURL offer more features at lower prices with better customer support.',
      },
      {
        question: 'Is OrangeURL cheaper than Bitly?',
        answer: 'Yes, OrangeURL is 70% cheaper than Bitly. OrangeURL Pro costs $5/month while Bitly Basic starts at $29/month, yet OrangeURL includes more features like unlimited custom domains and QR codes.',
      },
    ],
  },
  'free-url-shortener': {
    name: 'Free URL Shortener',
    description: 'Best free URL shortener with no limits. Create short links, track clicks, and manage your URLs without paying. Perfect for individuals, small businesses, and marketers who need reliable link shortening.',
    searches: '18K/mo',
    difficulty: 'Hard',
    relatedKeywords: ['free link shortener', 'no signup url shortener', 'unlimited free shortener', 'free custom short links'],
    faqs: [
      {
        question: 'What is the best free URL shortener?',
        answer: 'OrangeURL offers one of the best free URL shortener plans with unlimited links, basic analytics, and QR code generation. Unlike other services, there are no hidden limits or forced upgrades.',
      },
      {
        question: 'Are free URL shorteners safe?',
        answer: 'Reputable free URL shorteners like OrangeURL are safe. We use HTTPS encryption, don\'t sell your data, and provide transparent privacy policies. Always choose established services with good reviews.',
      },
    ],
  },
  'qr-code-generator': {
    name: 'QR Code Generator',
    description: 'Free QR code generator with customization. Create professional QR codes for URLs, business cards, marketing, and events. Customize colors, add logos, and track scans with advanced analytics.',
    searches: '15K/mo',
    difficulty: 'Medium',
    relatedKeywords: ['custom qr code', 'qr code maker', 'dynamic qr codes', 'trackable qr codes'],
    faqs: [
      {
        question: 'How do I create a QR code for free?',
        answer: 'With OrangeURL, simply enter your URL and toggle the QR code option. You can customize the design, add your brand colors, and download high-resolution QR codes for print or digital use - all for free.',
      },
      {
        question: 'What\'s the difference between static and dynamic QR codes?',
        answer: 'Static QR codes are permanent and can\'t be edited after creation. Dynamic QR codes allow you to change the destination URL, track scans, and gather analytics even after printing.',
      },
    ],
  },
};

// Available keywords for generateStaticParams
const availableKeywords = [
  'bitly-alternative',
  'free-url-shortener',
  'custom-short-links',
  'qr-code-generator',
  'link-tracking',
  'branded-links',
  'url-analytics',
  'short-link-seo',
  'link-management',
  'utm-tracking',
  'campaign-links',
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = keywordData[resolvedParams.slug];

  if (!data) {
    return {
      title: 'Topic Not Found',
      robots: { index: false, follow: false },
    };
  }

  return generateMeta({
    title: `${data.name} | Complete Guide & Best Practices`,
    description: data.description,
    keywords: [resolvedParams.slug, ...data.relatedKeywords],
    path: `/g/keyword/${resolvedParams.slug}`,
  });
}

export async function generateStaticParams() {
  return availableKeywords.map((slug) => ({ slug }));
}

export default async function KeywordPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = keywordData[resolvedParams.slug];

  if (!data) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/g' },
    { name: data.name, href: `/g/keyword/${resolvedParams.slug}` },
  ];

  const difficultyColor = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <>
      <ArticleSchema
        title={data.name}
        description={data.description}
        url={`https://app.orangeurl.live/g/keyword/${resolvedParams.slug}`}
        image="https://app.orangeurl.live/images/og-image.png"
        datePublished="2024-01-01T00:00:00Z"
        dateModified={new Date().toISOString()}
        author="OrangeURL Team"
      />
      {data.faqs && <FAQSchema items={data.faqs} />}

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        {/* Keyword Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">
              <Search className="w-4 h-4 inline mr-2" />
              {data.searches} monthly searches
            </span>
            <span className={`px-4 py-2 rounded-full font-semibold ${difficultyColor[data.difficulty]}`}>
              {data.difficulty} difficulty
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {data.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            {data.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/">
                Try It Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Related Keywords */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Related Topics</h2>
          <div className="flex flex-wrap gap-3">
            {data.relatedKeywords.map((keyword, index) => (
              <Link
                key={index}
                href={`/g/keyword/${keyword.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-colors flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                {keyword}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        {data.faqs && data.faqs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {data.faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Monthly Searches', value: data.searches, icon: <TrendingUp className="w-6 h-6" /> },
              { label: 'Ranking Difficulty', value: data.difficulty, icon: <Search className="w-6 h-6" /> },
              { label: 'Related Topics', value: data.relatedKeywords.length, icon: <Tag className="w-6 h-6" /> },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center text-primary mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Start with OrangeURL Today</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Everything you need for {data.name.toLowerCase()} - Free forever plan available
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

