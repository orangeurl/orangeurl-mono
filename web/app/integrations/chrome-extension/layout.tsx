import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'OrangeURL Chrome Extension - Shorten Links from Your Browser',
  description:
    'Shorten URLs without leaving your browser. Install the OrangeURL Chrome extension to create short links, QR codes, and track clicks in one click.',
  path: '/integrations/chrome-extension',
});

export default function ChromeExtensionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
