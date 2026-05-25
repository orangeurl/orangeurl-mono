import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'OrangeURL vs Bitly, TinyURL & Rebrandly - URL Shortener Comparison',
  description:
    'Side-by-side comparison of OrangeURL against Bitly, TinyURL, Rebrandly, and other URL shorteners. Features, pricing, and analytics compared.',
  path: '/comparison',
});

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does OrangeURL compare to Bitly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OrangeURL offers the same core link-shortening, QR-code, and analytics features as Bitly at roughly one-sixth of the price, starting at $5/month with a free forever tier.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is OrangeURL really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. OrangeURL has a free plan that includes custom short links, QR codes, and basic click analytics. Paid plans unlock branded domains and advanced reporting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I migrate my links from another shortener?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. OrangeURL supports bulk import via CSV and our API, so you can move your existing links from Bitly, TinyURL, or Rebrandly without breaking destinations.',
      },
    },
  ],
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
