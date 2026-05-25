'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp,
  Lightbulb,
  Target,
  ArrowRight,
  Calendar,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const blogPosts = [
  {
    title: 'URL Shortener Comparison 2024: OrangeURL vs Bitly vs TinyURL',
    excerpt: 'Comprehensive comparison of the top URL shorteners. See why OrangeURL offers the best value for money with 83% savings compared to Bitly.',
    category: 'Comparison',
    readTime: '8 min read',
    date: 'October 2024',
    slug: 'url-shortener-comparison-2024',
    icon: <Target className="w-6 h-6" />
  },
  {
    title: 'How to Create Custom Short Links for Social Media Marketing',
    excerpt: 'Learn how to create branded short links that boost click-through rates on Instagram, Twitter, LinkedIn, and TikTok.',
    category: 'Tutorial',
    readTime: '6 min read',
    date: 'October 2024',
    slug: 'custom-short-links-social-media',
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    title: 'QR Code Marketing: Complete Guide for 2024',
    excerpt: 'Everything you need to know about QR code marketing - from generation to tracking. Includes best practices and real examples.',
    category: 'Guide',
    readTime: '10 min read',
    date: 'October 2024',
    slug: 'qr-code-marketing-guide',
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    title: 'Link Analytics: Track and Optimize Your Marketing Campaigns',
    excerpt: 'Master link analytics to understand your audience, optimize campaigns, and increase ROI. A practical guide for marketers.',
    category: 'Marketing',
    readTime: '7 min read',
    date: 'October 2024',
    slug: 'link-analytics-guide',
    icon: <TrendingUp className="w-6 h-6" />
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-sm font-medium">
            <BookOpen className="w-4 h-4 mr-2" />
            Resources & Guides
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            OrangeURL <span className="gradient-text-primary">Blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Learn about URL shortening, link management, QR codes, and digital marketing strategies. 
            Expert tips to grow your business and optimize your online presence.
          </p>
        </motion.div>
      </motion.section>

      {/* Blog Posts Grid */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
        >
          {blogPosts.map((post, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="h-full card-hover border-2 hover:border-primary/30 transition-all group">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center text-white">
                      {post.icon}
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Browse by <span className="gradient-text-primary">Category</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={staggerContainer}
        >
          {[
            { name: 'Tutorials', count: '12 articles', color: 'from-blue-500 to-cyan-500' },
            { name: 'Comparisons', count: '8 articles', color: 'from-orange-500 to-red-500' },
            { name: 'Marketing', count: '15 articles', color: 'from-purple-500 to-pink-500' },
            { name: 'Guides', count: '10 articles', color: 'from-green-500 to-emerald-500' },
          ].map((category, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="card-hover border-2 hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl mx-auto`} />
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Newsletter CTA */}
      <motion.section 
        className="text-center py-16 relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl" />
        
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
          <p className="text-xl text-muted-foreground">
            Get the latest tips, guides, and updates on URL shortening and digital marketing. 
            Join 1,000+ marketers who read our newsletter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none"
            />
            <Button size="lg" className="btn-primary">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No spam. Unsubscribe anytime. Read our <Link href="/privacy" className="text-primary hover:underline">privacy policy</Link>.
          </p>
        </div>
      </motion.section>
    </div>
  );
}


