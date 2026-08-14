import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Report Abuse & Trust and Safety',
  description:
    'Report phishing, malware, spam, or other abusive short links on OrangeURL. Learn about the safety controls we run and how network administrators can reach our abuse team.',
  path: '/abuse',
  keywords: [
    'report abuse',
    'phishing',
    'malware',
    'trust and safety',
    'url shortener abuse',
    'orangeurl abuse',
  ],
});

export default function AbuseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
