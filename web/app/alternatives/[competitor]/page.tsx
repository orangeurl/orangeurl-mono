/**
 * Competitor Alternative Pages
 * SEO-optimized comparison pages
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  CheckCircle,
  X,
  DollarSign,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/seo/metadata';
import { InternalLinks, Breadcrumbs } from '@/components/seo/InternalLinks';
import { getBreadcrumbs } from '@/lib/seo/internalLinks';
import { ProductSchema } from '@/components/seo/SchemaMarkup';
import { competitors } from '@/lib/seo/programmaticData';

interface PageProps {
  params: Promise<{ competitor: string }>;
}

// Competitor comparison data
const competitorData: Record<string, {
  name: string;
  title: string;
  description: string;
  pricing: { orangeUrl: string; competitor: string };
  comparison: Array<{ feature: string; orangeUrl: boolean | string; competitor: boolean | string }>;
}> = {
  'bitly': {
    name: 'Bitly',
    title: 'Best Bitly Alternative - OrangeURL | 70% Cheaper with More Features',
    description: 'Looking for a Bitly alternative? OrangeURL offers all of Bitly\'s features at 70% less cost. Get unlimited links, advanced analytics, custom domains, and QR codes. Switch today!',
    pricing: {
      orangeUrl: '$5/month',
      competitor: '$29/month',
    },
    comparison: [
      { feature: 'Custom Short Links', orangeUrl: true, competitor: true },
      { feature: 'Link Analytics', orangeUrl: true, competitor: true },
      { feature: 'Custom Domains', orangeUrl: true, competitor: 'Paid only' },
      { feature: 'QR Code Generator', orangeUrl: true, competitor: 'Paid only' },
      { feature: 'Unlimited Links', orangeUrl: true, competitor: false },
      { feature: 'Password Protection', orangeUrl: true, competitor: 'Enterprise only' },
      { feature: 'Link Expiration', orangeUrl: true, competitor: 'Paid only' },
      { feature: 'API Access', orangeUrl: true, competitor: 'Paid only' },
      { feature: 'Monthly Price', orangeUrl: '$5', competitor: '$29' },
    ],
  },
  'tinyurl': {
    name: 'TinyURL',
    title: 'Better TinyURL Alternative - OrangeURL | Modern Features & Analytics',
    description: 'Upgrade from TinyURL to OrangeURL for modern link management. Get analytics, custom domains, QR codes, and branded links that TinyURL doesn\'t offer. Try free!',
    pricing: {
      orangeUrl: '$5/month',
      competitor: 'Limited Free',
    },
    comparison: [
      { feature: 'Custom Short Links', orangeUrl: true, competitor: 'Limited' },
      { feature: 'Link Analytics', orangeUrl: true, competitor: false },
      { feature: 'Custom Domains', orangeUrl: true, competitor: false },
      { feature: 'QR Code Generator', orangeUrl: true, competitor: false },
      { feature: 'Password Protection', orangeUrl: true, competitor: false },
      { feature: 'Modern Dashboard', orangeUrl: true, competitor: false },
      { feature: 'API Access', orangeUrl: true, competitor: false },
      { feature: 'Team Collaboration', orangeUrl: true, competitor: false },
    ],
  },
  'rebrandly': {
    name: 'Rebrandly',
    title: 'Affordable Rebrandly Alternative - OrangeURL | Same Features, Lower Price',
    description: 'Get Rebrandly\'s branded link features at a fraction of the cost. OrangeURL offers custom domains, analytics, and link management starting at just $5/month. Compare now!',
    pricing: {
      orangeUrl: '$5/month',
      competitor: '$59/month',
    },
    comparison: [
      { feature: 'Custom Branded Links', orangeUrl: true, competitor: true },
      { feature: 'Custom Domains', orangeUrl: true, competitor: true },
      { feature: 'Link Analytics', orangeUrl: true, competitor: true },
      { feature: 'QR Code Generator', orangeUrl: true, competitor: 'Paid only' },
      { feature: 'Unlimited Links', orangeUrl: true, competitor: 'Limited' },
      { feature: 'Password Protection', orangeUrl: true, competitor: 'Enterprise only' },
      { feature: 'Affordable Pricing', orangeUrl: '$5/mo', competitor: '$59/mo' },
      { feature: 'Free Plan', orangeUrl: true, competitor: 'Limited' },
    ],
  },
};

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = competitorData[resolvedParams.competitor];

  if (!data) {
    return {
      title: 'Alternative Not Found',
      robots: { index: false, follow: false },
    };
  }

  return generateMeta({
    title: data.title,
    description: data.description,
    keywords: [
      `${data.name} alternative`,
      `cheaper than ${data.name}`,
      `${data.name} vs orangeurl`,
      `best ${data.name} alternative`,
      'url shortener alternative',
    ],
    path: `/alternatives/${resolvedParams.competitor}`,
    type: 'article',
  });
}

// Generate static paths
export async function generateStaticParams() {
  return competitors.map((competitor) => ({ competitor }));
}

// Disable static generation to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default async function AlternativePage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = competitorData[resolvedParams.competitor];

  if (!data) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbs(`/alternatives/${resolvedParams.competitor}`);

  return (
    <>
      {/* Schema Markup */}
      <ProductSchema
        name="OrangeURL Pro"
        description={data.description}
        image="https://app.orangeurl.live/images/og-image.png"
        price="5.00"
        currency="USD"
        availability="InStock"
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-4">
            Save up to 70% vs {data.name}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {data.title}
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
              <Link href="/pricing">Compare Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Pricing Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">OrangeURL</h3>
                <div className="text-5xl font-bold gradient-text-primary mb-2">
                  {data.pricing.orangeUrl}
                </div>
                <p className="text-muted-foreground mb-6">All features included</p>
                <Button className="w-full btn-primary" asChild>
                  <Link href="/">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">{data.name}</h3>
                <div className="text-5xl font-bold text-muted-foreground mb-2">
                  {data.pricing.competitor}
                </div>
                <p className="text-muted-foreground mb-6">Limited features</p>
                <Button variant="outline" className="w-full" disabled>
                  More Expensive
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-center font-semibold">OrangeURL</th>
                      <th className="p-4 text-center font-semibold">{data.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.comparison.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          {typeof row.orangeUrl === 'boolean' ? (
                            row.orangeUrl ? (
                              <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-green-600 font-semibold">{row.orangeUrl}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof row.competitor === 'boolean' ? (
                            row.competitor ? (
                              <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-muted-foreground">{row.competitor}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Switch */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Switch from {data.name} to OrangeURL?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'Save Money',
                description: 'Get all features at a fraction of the cost',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'More Features',
                description: 'Access advanced features on every plan',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Better Security',
                description: 'Enterprise-grade security for all users',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Advanced Analytics',
                description: 'Detailed insights into your link performance',
              },
            ].map((item, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Switch from {data.name}?
          </h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands who've already made the switch. Start free, no credit card required.
          </p>
          <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
            <Link href="/">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Related Pages */}
        <div className="mt-16">
          <InternalLinks
            currentPath={`/alternatives/${resolvedParams.competitor}`}
            category="alternatives"
            limit={6}
            title="Compare More Alternatives"
          />
        </div>
      </div>
    </>
  );
}

