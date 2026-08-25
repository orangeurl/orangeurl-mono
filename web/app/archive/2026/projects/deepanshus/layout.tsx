import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Deepanshu Srivastava — Software Development Intern | OrangeURL',
  description:
    'Deepanshu Srivastava interned as a Software Development Intern at OrangeURL, working on URL Shortener Clickstream & Traffic Analytics.',
  path: '/archive/2026/projects/deepanshus',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
