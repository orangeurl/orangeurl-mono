import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About OrangeURL - The Affordable URL Shortener',
  description:
    'Learn about OrangeURL — the affordable, privacy-friendly URL shortener built for creators, marketers, and businesses. Our mission, story, and values.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
