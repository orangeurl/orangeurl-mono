import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Blocked at Your School or Workplace? How to Unblock OrangeURL',
  description:
    'If OrangeURL short links are blocked by your school, college, or workplace web filter, use this ready-made request to ask your IT team or C2k Coordinator to allow-list the domain.',
  path: '/unblock',
  keywords: [
    'orangeurl blocked',
    'unblock url shortener',
    'allow-list orangeurl',
    'school firewall url shortener',
    'c2k allow list',
    'links blocked at school',
  ],
});

export default function UnblockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
