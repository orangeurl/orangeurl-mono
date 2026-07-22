import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Abhinay Singh — Data Analyst Intern | OrangeURL',
  description:
    'Abhinay Singh interned as a Data Analyst Intern at OrangeURL, working on SQL-based platform data analysis.',
  path: '/archive/2026/projects/abhinaysingh',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
