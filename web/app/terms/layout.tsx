import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service | OrangeURL',
  description:
    'OrangeURL Terms of Service. Read the rules and conditions for using our URL shortener, bio pages, and link management platform.',
  path: '/terms',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
