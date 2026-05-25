import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'OrangeURL Blog - URL Shortening Tips, Guides & Best Practices',
  description:
    'Learn about URL shortening, link management, QR codes, and digital marketing. Expert guides, comparisons, and tutorials for marketers and businesses.',
  path: '/blog',
  type: 'website',
});

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'OrangeURL Blog',
  description:
    'Guides, comparisons, and tutorials about URL shortening, QR codes, link analytics, and digital marketing.',
  url: 'https://app.orangeurl.live/blog',
  publisher: {
    '@type': 'Organization',
    name: 'OrangeURL',
    logo: {
      '@type': 'ImageObject',
      url: 'https://app.orangeurl.live/images/logo-512.png',
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {children}
    </>
  );
}
