/**
 * SEO Hub - Main Directory Page
 * Central hub for all SEO-optimized content categories and keywords
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Tag, BookOpen, TrendingUp } from 'lucide-react';
import { generateMetadata as generateMeta } from '@/lib/seo/metadata';

export const metadata: Metadata = generateMeta({
  title: 'URL Shortener Guides & Resources | Complete Link Management Hub',
  description: 'Comprehensive guides, tutorials, and resources for URL shortening, link management, QR codes, and link analytics. Learn best practices for social media, marketing, and business.',
  keywords: [
    'url shortener guide',
    'link management resources',
    'url shortener tutorials',
    'link shortening best practices',
    'qr code guides',
    'link analytics resources',
  ],
  path: '/g',
});

const categories = [
  { slug: 'linktree-alternative', name: 'Linktree Alternative', count: 52, icon: '🔗' },
  { slug: 'social-media-marketing', name: 'Social Media Marketing', count: 45, icon: '📱' },
  { slug: 'email-marketing', name: 'Email Marketing', count: 32, icon: '📧' },
  { slug: 'qr-codes', name: 'QR Codes', count: 28, icon: '📊' },
  { slug: 'link-analytics', name: 'Link Analytics', count: 38, icon: '📈' },
  { slug: 'influencer-marketing', name: 'Influencer Marketing', count: 24, icon: '⭐' },
  { slug: 'affiliate-marketing', name: 'Affiliate Marketing', count: 30, icon: '💰' },
  { slug: 'e-commerce', name: 'E-commerce', count: 26, icon: '🛒' },
  { slug: 'seo-optimization', name: 'SEO & Optimization', count: 42, icon: '🔍' },
  { slug: 'business-tools', name: 'Business Tools', count: 35, icon: '💼' },
  { slug: 'mobile-marketing', name: 'Mobile Marketing', count: 22, icon: '📲' },
  { slug: 'content-marketing', name: 'Content Marketing', count: 28, icon: '✍️' },
  { slug: 'brand-management', name: 'Brand Management', count: 20, icon: '🎯' },
];

const popularKeywords = [
  { slug: 'bitly-alternative', name: 'Bitly Alternative', searches: '12K/mo' },
  { slug: 'free-url-shortener', name: 'Free URL Shortener', searches: '18K/mo' },
  { slug: 'custom-short-links', name: 'Custom Short Links', searches: '8K/mo' },
  { slug: 'qr-code-generator', name: 'QR Code Generator', searches: '15K/mo' },
  { slug: 'link-tracking', name: 'Link Tracking', searches: '6K/mo' },
  { slug: 'branded-links', name: 'Branded Links', searches: '5K/mo' },
  { slug: 'url-analytics', name: 'URL Analytics', searches: '4K/mo' },
  { slug: 'short-link-seo', name: 'Short Link SEO', searches: '3K/mo' },
  { slug: 'link-management', name: 'Link Management', searches: '7K/mo' },
  { slug: 'utm-tracking', name: 'UTM Tracking', searches: '9K/mo' },
  { slug: 'campaign-links', name: 'Campaign Links', searches: '5K/mo' },
];

const recentGuides = [
  {
    title: 'Complete Guide to URL Shorteners for Social Media Marketing',
    slug: 'url-shorteners-social-media-complete-guide',
    category: 'Social Media Marketing',
    readTime: '12 min',
    date: 'Jan 10, 2025',
  },
  {
    title: 'How to Track Link Performance with Advanced Analytics',
    slug: 'track-link-performance-analytics',
    category: 'Link Analytics',
    readTime: '8 min',
    date: 'Jan 8, 2025',
  },
  {
    title: 'QR Code Marketing: Best Practices for 2025',
    slug: 'qr-code-marketing-best-practices-2025',
    category: 'QR Codes',
    readTime: '10 min',
    date: 'Jan 5, 2025',
  },
  {
    title: 'Bitly vs OrangeURL: Comprehensive Comparison',
    slug: 'bitly-vs-orangeurl-comparison',
    category: 'Business Tools',
    readTime: '15 min',
    date: 'Jan 3, 2025',
  },
];

export default function GuidesHubPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-6 mb-16">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-semibold">
          <BookOpen className="w-4 h-4 inline mr-2" />
          Knowledge Hub
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          URL Shortener Guides & Resources
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
          Everything you need to know about URL shortening, link management, and digital marketing with short links.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guides, tutorials, and resources..."
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-border focus:border-primary focus:outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <Link href="/g/category" className="text-primary hover:underline flex items-center gap-2">
            View All Categories
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/g/category/${category.slug}`}>
              <Card className="card-hover h-full border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} articles</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Keywords */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Popular Topics</h2>
          <Link href="/g/keyword" className="text-primary hover:underline flex items-center gap-2">
            View All Topics
            <Tag className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularKeywords.map((keyword) => (
            <Link key={keyword.slug} href={`/g/keyword/${keyword.slug}`}>
              <Card className="card-hover border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{keyword.name}</h3>
                      <p className="text-sm text-muted-foreground">{keyword.searches} searches</p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Guides */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Guides</h2>
          <Link href="/blog" className="text-primary hover:underline">
            View All Guides →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentGuides.map((guide) => (
            <Link key={guide.slug} href={`/blog/${guide.slug}`}>
              <Card className="card-hover h-full border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {guide.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{guide.readTime} read</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 line-clamp-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">{guide.date}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shortening URLs?</h2>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands using OrangeURL for professional link management
        </p>
        <Link href="/">
          <button className="btn-primary text-lg px-10 py-4">
            Get Started Free
          </button>
        </Link>
      </div>
    </div>
  );
}

