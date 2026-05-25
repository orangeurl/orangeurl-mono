import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'OrangeURL Zapier Integration - Automate Link Shortening',
  description:
    'Connect OrangeURL to 5,000+ apps with Zapier. Automate short link creation, QR code generation, and analytics in your existing workflows.',
  path: '/integrations/zapier',
});

export default function ZapierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
