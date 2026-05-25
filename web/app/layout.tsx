import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthStatusHandler } from '@/components/AuthStatusHandler';
import { CookieConsent } from '@/components/CookieConsent';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OrangeURL - Fast & Secure URL Shortener | Custom Short Links & QR Codes',
    template: '%s | OrangeURL'
  },
  description: 'Create short, memorable links with advanced analytics and custom domains. Professional URL shortening service with QR codes, link tracking, and branded links. Start free today.',
  keywords: [
    // Primary keywords
    'URL shortener',
    'link shortener',
    'short link',
    'custom URL shortener',
    'affordable URL shortener',
    
    // Competitive keywords
    'Bitly alternative',
    'cheaper than Bitly',
    'TinyURL alternative',
    'Rebrandly alternative',
    'best URL shortener',
    
    // Feature-based keywords
    'custom short links',
    'QR code generator',
    'link analytics',
    'link tracking',
    'branded links',
    'bio link',
    'link in bio',
    
    // Geographic keywords
    'URL shortener USA',
    'URL shortener Europe',
    'link shortener US',
    'American URL shortener',
    
    // Use case keywords
    'social media link shortener',
    'marketing link shortener',
    'business URL shortener',
    'Instagram link shortener',
    'Twitter link shortener',
    
    // Long-tail keywords
    'cheap URL shortener service',
    'affordable link management',
    'budget friendly URL shortener',
    'free URL shortener with analytics',
    'custom domain link shortener'
  ],
  authors: [{ name: 'OrangeURL Team', url: 'https://app.orangeurl.live/about' }],
  creator: 'OrangeURL',
  publisher: 'OrangeURL',
  applicationName: 'OrangeURL',
  category: 'Technology',
  classification: 'URL Shortening Service',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://app.orangeurl.live'),
  alternates: {
    canonical: 'https://app.orangeurl.live',
    languages: {
      'en-US': 'https://app.orangeurl.live',
      'en-GB': 'https://app.orangeurl.live',
      'en-CA': 'https://app.orangeurl.live',
      'en-AU': 'https://app.orangeurl.live',
      'en': 'https://app.orangeurl.live',
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'OrangeURL - Affordable URL Shortener | Cheaper than Bitly',
    description: 'Create custom short links, QR codes & track analytics for just $5/month. The most affordable URL shortener for businesses in US & Europe. Free plan available.',
    url: 'https://app.orangeurl.live',
    siteName: 'OrangeURL',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OrangeURL - Affordable URL Shortener & Link Management Platform',
        type: 'image/png',
      },
    ],
    countryName: 'United States',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OrangeURL - Affordable URL Shortener | Cheaper than Bitly',
    description: 'Create custom short links, QR codes & track analytics for just $5/month. Best Bitly alternative for US & Europe.',
    creator: '@orangeurl_app',
    site: '@orangeurl_app',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
    },
  },
  // TODO: populate `verification` with real Google/Yandex codes once available.
  other: {
    'price:currency': 'USD',
    'price:amount': '5.00',
    'geo.region': 'US',
    'geo.placename': 'United States',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  afterSignInUrl="/"
  afterSignUpUrl="/"
>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <head>
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://api.orangeurl.live" />
          
          {/* Icons and manifest */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          
          {/* Theme color for mobile browsers */}
          <meta name="theme-color" content="#ea580c" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          
          {/* Geographic targeting */}
          <meta name="geo.region" content="US" />
          <meta name="geo.placename" content="United States" />
          <meta name="geo.position" content="37.09024;-95.712891" />
          <meta name="ICBM" content="37.09024, -95.712891" />
          
          {/* Open Graph images */}
          <meta property="og:image" content="https://app.orangeurl.live/images/og-image.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="OrangeURL - Affordable URL Shortener & Link Management Platform" />
          <meta property="og:image:type" content="image/png" />
          <meta name="twitter:image" content="https://app.orangeurl.live/images/og-image.png" />
          <meta name="twitter:image:alt" content="OrangeURL - Affordable URL Shortener" />
          
          {/* Schema.org structured data for Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'OrangeURL',
                url: 'https://app.orangeurl.live',
                logo: 'https://app.orangeurl.live/images/logo-512.png',
                description: 'Affordable URL shortener and link management platform for businesses and individuals',
                foundingDate: '2024',
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Support',
                  email: 'support@orangeurl.live',
                  availableLanguage: ['English']
                },
                sameAs: [
                  'https://twitter.com/orangeurl_app',
                  'https://discord.gg/FvJtFw64WV'
                ],
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'US'
                }
              })
            }}
          />
          
          {/* Schema.org structured data for WebApplication */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'OrangeURL',
                url: 'https://app.orangeurl.live',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'AggregateOffer',
                  lowPrice: '0',
                  highPrice: '15',
                  priceCurrency: 'USD',
                  offerCount: '3'
                },
                // aggregateRating intentionally omitted until real review data is wired in.
                // Google penalizes fabricated structured data. TODO: wire to real reviews.
                description: 'Create custom short links, QR codes, and track analytics. The most affordable URL shortener for US & Europe.',
                featureList: [
                  'Custom URL shortening',
                  'QR code generation',
                  'Link analytics and tracking',
                  'Bio link pages',
                  'Branded links',
                  'Link expiration control',
                  'Password-protected links'
                ],
                screenshot: 'https://app.orangeurl.live/images/og-image.png'
              })
            }}
          />
          
          {/* Schema.org structured data for BreadcrumbList */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://app.orangeurl.live'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Pricing',
                    item: 'https://app.orangeurl.live/pricing'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'About',
                    item: 'https://app.orangeurl.live/about'
                  }
                ]
              })
            }}
          />
        </head>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <I18nProvider>
              {children}
              <AuthStatusHandler />
              <Toaster />
              <CookieConsent />
            </I18nProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 