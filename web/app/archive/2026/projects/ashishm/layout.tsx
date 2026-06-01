import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Ashish Meena — Software Development Intern | OrangeURL',
  description:
    'Ashish Meena interned as a Software Development Intern at OrangeURL, building the UTM Campaign Builder.',
  path: '/archive/2026/projects/ashishm',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
