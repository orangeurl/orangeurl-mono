import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Anup Kumar — Software Development Intern | OrangeURL',
  description:
    'Anup Kumar interned as a Software Development Intern at OrangeURL, working on the OrangeURL browser extension.',
  path: '/archive/2026/projects/anupk',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
