import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Custom Short Links - Branded URLs & Smart Redirects | OrangeURL',
  description:
    'Create custom branded short links with OrangeURL. Smart redirects, QR codes, click analytics, and edit-after-publish support — all on a free plan.',
  path: '/features/short-links',
});

export default function ShortLinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
