import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Anish Kumar — Software Development Intern | OrangeURL',
  description:
    'Anish Kumar interned as a Software Development Intern at OrangeURL, implementing the Zapier integration.',
  path: '/archive/2026/projects/anishk',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
