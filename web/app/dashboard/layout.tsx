import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Dashboard | OrangeURL',
  description: 'OrangeURL link management dashboard.',
  path: '/dashboard',
  noindex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
