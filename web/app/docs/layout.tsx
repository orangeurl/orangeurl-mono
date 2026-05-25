import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Documentation - OrangeURL Developer Docs & API Reference',
  description:
    'OrangeURL developer documentation. Quickstart guides, REST API reference, webhook payloads, and SDK examples for building on OrangeURL.',
  path: '/docs',
});

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
