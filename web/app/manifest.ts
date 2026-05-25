import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OrangeURL - Affordable URL Shortener',
    short_name: 'OrangeURL',
    description: 'Create custom short links, QR codes, and track analytics. The best affordable Bitly alternative for US & Europe.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ea580c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity', 'utilities'],
    lang: 'en',
    dir: 'ltr',
  };
}


