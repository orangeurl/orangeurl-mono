import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Arman Singh — Software Development Intern | OrangeURL',
  description:
    'Arman Singh interned as a Software Development Intern at OrangeURL, building the admin analytics dashboard.',
  path: '/archive/2026/projects/armansingh',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
