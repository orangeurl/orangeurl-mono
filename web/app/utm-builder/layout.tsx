import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Free UTM Builder - Generate Campaign Tracking URLs | OrangeURL',
  description:
    'Build UTM-tagged URLs in seconds with our free UTM builder. Track campaign source, medium, and content across Google Analytics and OrangeURL.',
  path: '/utm-builder',
});

export default function UtmBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
