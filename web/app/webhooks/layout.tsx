import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Webhooks - Real-Time Click Events from OrangeURL',
  description:
    'Get real-time click and link events delivered to your endpoint with OrangeURL webhooks. Build automations, audit logs, and custom analytics pipelines.',
  path: '/webhooks',
});

export default function WebhooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
