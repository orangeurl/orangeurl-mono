import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Team Link Management | OrangeURL',
  description:
    'Manage links across your team with OrangeURL. Shared workspaces, role-based access, and team analytics for marketing and product teams.',
  path: '/team',
});

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
