import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'API Keys | OrangeURL',
  description: 'Manage your OrangeURL API keys.',
  path: '/api-keys',
  noindex: true,
});

export default function ApiKeysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
