import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Jagjeet Singh — Data Analyst Intern | OrangeURL',
  description:
    'Jagjeet Singh interned as a Data Analyst Intern at OrangeURL, working on the Data Quality Monitoring project.',
  path: '/archive/2026/projects/jagjeetsingh',
  noindex: true,
});

export default function ArchiveProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
