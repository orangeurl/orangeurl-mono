import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Broken Link Reporter | OrangeURL',
  description:
    'Report a broken or suspicious short link. Help keep OrangeURL safe by flagging links that no longer work or violate our acceptable use policy.',
  path: '/broken-link',
  noindex: true,
});

export default function BrokenLinkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
