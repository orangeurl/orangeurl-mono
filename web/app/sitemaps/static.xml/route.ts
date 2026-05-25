/**
 * Static Sitemap - Core Pages Only
 * Similar to superfa.st structure
 * Contains all non-programmatic, high-priority pages
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://app.orangeurl.live';
  const currentDate = new Date().toISOString();
  
  // Generate static sitemap XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Core pages
  const staticPages = [
    { url: '/', lastmod: currentDate, changefreq: 'daily', priority: 1.0 },
    { url: '/about', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { url: '/pricing', lastmod: currentDate, changefreq: 'weekly', priority: 0.9 },
    { url: '/terms', lastmod: currentDate, changefreq: 'yearly', priority: 0.3 },
    { url: '/privacy', lastmod: currentDate, changefreq: 'yearly', priority: 0.3 },
    { url: '/support', lastmod: currentDate, changefreq: 'weekly', priority: 0.6 },
    
    // SEO Hub
    { url: '/g', lastmod: currentDate, changefreq: 'daily', priority: 0.9 },
    
    // Categories
    { url: '/g/category/linktree-alternative', lastmod: currentDate, changefreq: 'daily', priority: 0.9 },
    { url: '/g/category/social-media-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/category/email-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/category/qr-codes', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/category/link-analytics', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/category/influencer-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/category/affiliate-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/category/e-commerce', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/category/seo-optimization', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/category/business-tools', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/category/mobile-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/category/content-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/category/brand-management', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    
    // Keywords/Topics
    { url: '/g/keyword/bitly-alternative', lastmod: currentDate, changefreq: 'weekly', priority: 0.9 },
    { url: '/g/keyword/free-url-shortener', lastmod: currentDate, changefreq: 'weekly', priority: 0.9 },
    { url: '/g/keyword/custom-short-links', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/keyword/qr-code-generator', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/keyword/link-tracking', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/keyword/branded-links', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/keyword/bio-link', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/g/keyword/url-analytics', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/keyword/short-link-seo', lastmod: currentDate, changefreq: 'weekly', priority: 0.6 },
    { url: '/g/keyword/link-management', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    { url: '/g/keyword/utm-tracking', lastmod: currentDate, changefreq: 'weekly', priority: 0.6 },
    { url: '/g/keyword/campaign-links', lastmod: currentDate, changefreq: 'weekly', priority: 0.6 },
    
    // Features
    { url: '/features/short-links', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { url: '/features/lock-links', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    
    // Other pages
    { url: '/bio', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/bitly-alternative', lastmod: currentDate, changefreq: 'weekly', priority: 0.9 },
    { url: '/blog', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/comparison', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    
    // Use cases
    { url: '/use-cases/social-media', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/use-cases/email-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/use-cases/qr-codes', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/use-cases/influencer-marketing', lastmod: currentDate, changefreq: 'weekly', priority: 0.7 },
    
    // Alternatives
    { url: '/alternatives/bitly', lastmod: currentDate, changefreq: 'weekly', priority: 0.9 },
    { url: '/alternatives/tinyurl', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { url: '/alternatives/rebrandly', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
  ];
  
  staticPages.forEach((page) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

