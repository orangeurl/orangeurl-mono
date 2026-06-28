import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Rahul Goswami — Software Development Intern | OrangeURL',
  description:
    'Rahul Goswami interned as a Software Development Intern at OrangeURL, building the QR code generator.',
  path: '/archive/2026/projects/rahulgo',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
