/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for production deployment
  output: 'standalone',
  // Performance optimizations
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.orangeurl.live https://accounts.orangeurl.live https://challenges.cloudflare.com https://checkout.dodopayments.com https://*.dodopayments.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://checkout.dodopayments.com https://*.dodopayments.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.orangeurl.live https://clerk.orangeurl.live https://accounts.orangeurl.live https://challenges.cloudflare.com https://checkout.dodopayments.com https://*.dodopayments.com https://api.stripe.com; frame-src https://clerk.orangeurl.live https://accounts.orangeurl.live https://challenges.cloudflare.com https://checkout.dodopayments.com https://*.dodopayments.com https://js.stripe.com https://hooks.stripe.com;"
          }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
        ],
      },
      // Cache static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,gif,ico,svg,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/bitly',
        destination: '/bitly-alternative',
        permanent: true,
      },
      {
        source: '/compare-bitly',
        destination: '/bitly-alternative',
        permanent: true,
      },
      {
        source: '/vs-bitly',
        destination: '/bitly-alternative',
        permanent: true,
      },
      {
        source: '/tinyurl-alternative',
        destination: '/bitly-alternative',
        permanent: false,
      },
      {
        source: '/rebrandly-alternative',
        destination: '/bitly-alternative',
        permanent: false,
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    return config;
  },

  // Production source maps disabled for performance
  productionBrowserSourceMaps: false,

  // React strict mode for better development
  reactStrictMode: true,

  // Power by header removal
  poweredByHeader: false,

  // Skip type checking and linting during build (run separately in CI)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
 
module.exports = nextConfig 