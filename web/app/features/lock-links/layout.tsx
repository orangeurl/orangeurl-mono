import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Password-Protected Short Links | OrangeURL Lock Links',
  description:
    'Lock short links behind a password or expiration date. Share sensitive URLs securely with OrangeURL Lock Links — perfect for paid content and private docs.',
  path: '/features/lock-links',
});

export default function LockLinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
