import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Support & Help Center | OrangeURL',
  description:
    'Get help with OrangeURL. Contact our support team, browse common questions, and find guides for link shortening, analytics, and account management.',
  path: '/support',
});

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
