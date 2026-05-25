import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Pricing - Affordable URL Shortener Plans Starting at $0 | OrangeURL',
  description:
    'Simple, transparent pricing for OrangeURL. Free forever plan with custom short links, QR codes, and analytics. Paid plans from $5/month. No hidden fees.',
  path: '/pricing',
  keywords: [
    'URL shortener pricing',
    'cheap URL shortener',
    'Bitly alternative pricing',
    'free URL shortener',
    'affordable link management',
  ],
});

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'OrangeURL',
  description:
    'Affordable URL shortener with custom branded links, QR codes, analytics, and bio pages.',
  brand: {
    '@type': 'Brand',
    name: 'OrangeURL',
  },
  image: 'https://app.orangeurl.live/images/og-image.png',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '15',
    offerCount: '3',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://app.orangeurl.live/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '5',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://app.orangeurl.live/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Business',
        price: '15',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://app.orangeurl.live/pricing',
      },
    ],
  },
  // aggregateRating intentionally omitted until real review data is wired in.
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
