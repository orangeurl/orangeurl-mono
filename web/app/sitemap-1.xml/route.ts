import { NextRequest, NextResponse } from 'next/server';
import { SITEMAP_CHUNK_SIZE, PROGRAMMATIC_TOTAL, getProgrammaticItemsRange } from '@/lib/seo/programmaticData';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://app.orangeurl.live';
  const index = 1;
  const start = index * SITEMAP_CHUNK_SIZE;
  const end = Math.min(start + SITEMAP_CHUNK_SIZE, PROGRAMMATIC_TOTAL);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Get items in batch for better performance
  const items = getProgrammaticItemsRange(start, end);
  
  console.log(`Sitemap-1: Generating ${items.length} items (${start}-${end})`);
  
  for (const item of items) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/seo/${encodeURIComponent(item.slug)}</loc>\n`;
    xml += `    <lastmod>${item.updatedAt}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}


