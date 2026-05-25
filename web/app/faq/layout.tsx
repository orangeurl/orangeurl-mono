import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | OrangeURL',
  description: 'Find answers to common questions about OrangeURL. Learn about link shortening, analytics, pricing, security, browser extensions, and more.',
  keywords: [
    'OrangeURL FAQ',
    'URL shortener help',
    'link shortening questions',
    'URL shortener guide',
    'OrangeURL support',
    'how to use OrangeURL',
    'URL shortener analytics',
    'link management help'
  ],
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | OrangeURL',
    description: 'Find answers to common questions about OrangeURL. Learn about link shortening, analytics, pricing, security, and more.',
    type: 'website',
    url: 'https://orangeurl.live/faq',
    siteName: 'OrangeURL',
    images: [
      {
        url: 'https://orangeurl.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OrangeURL - URL Shortener FAQ'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - Frequently Asked Questions | OrangeURL',
    description: 'Find answers to common questions about OrangeURL. Learn about link shortening, analytics, pricing, security, and more.',
    images: ['https://orangeurl.live/og-image.png']
  },
  alternates: {
    canonical: 'https://orangeurl.live/faq'
  }
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
