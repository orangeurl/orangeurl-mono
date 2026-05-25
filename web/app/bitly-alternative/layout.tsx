import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Best Bitly Alternative - Cheaper URL Shortener with Analytics | OrangeURL',
  description:
    'Looking for a Bitly alternative? OrangeURL offers custom short links, QR codes, and analytics starting at $5/month. Free plan available. Switch in minutes.',
  path: '/bitly-alternative',
  keywords: [
    'Bitly alternative',
    'cheaper than Bitly',
    'Bitly competitor',
    'best Bitly alternative',
    'free Bitly alternative',
  ],
});

export default function BitlyAlternativeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
