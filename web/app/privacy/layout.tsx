import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | OrangeURL',
  description:
    'How OrangeURL collects, uses, and protects your data. Read our full privacy policy, GDPR commitments, and cookie practices.',
  path: '/privacy',
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
