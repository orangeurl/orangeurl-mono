/**
 * Sitemap Index
 * Points to all individual sitemaps
 */

import { NextRequest, NextResponse } from 'next/server';
import { PROGRAMMATIC_TOTAL, SITEMAP_CHUNK_SIZE } from '@/lib/seo/programmaticData';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://app.orangeurl.live';
  
  // Calculate number of sitemaps needed (only generate sitemaps that have content)
  const numSitemaps = Math.floor(PROGRAMMATIC_TOTAL / SITEMAP_CHUNK_SIZE);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Static sitemap (core pages)
  xml += '  <sitemap>\n';
  xml += `    <loc>${baseUrl}/sitemaps/static.xml</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  // Main sitemap
  xml += '  <sitemap>\n';
  xml += `    <loc>${baseUrl}/sitemap.xml</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
  xml += '  </sitemap>\n';
  
  // Programmatic sitemaps
  for (let i = 0; i < numSitemaps; i++) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${baseUrl}/sitemap-${i}.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }
  
  xml += '</sitemapindex>';
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

