'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  Heart,
  Sparkles,
  ArrowRight,
  Award,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export default function AboutPage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Making the Web <span className="gradient-text-primary">More Connected</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            What started as a simple URL shortener has evolved into a comprehensive link management platform.
            OrangeURL now powers workflows for thousands of users worldwide with advanced analytics,
            seamless integrations, and enterprise-grade features.
          </p>
        </motion.div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're on a mission to simplify the web by making URLs more manageable, trackable, and secure.
            Our platform empowers businesses and individuals to create meaningful connections through
            shortened links that don't just redirect—they tell a story.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From solo creators to enterprise teams, from social media managers to marketing agencies—
            OrangeURL has evolved to meet the diverse needs of our growing community. With features like
            Zapier integration, browser extensions, advanced analytics, password protection, and custom domains,
            we're building the most comprehensive link management ecosystem.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe you deserve tools that are both powerful and easy to use. That's why we continue to
            innovate and expand, always listening to our users and pushing the boundaries of what a URL
            shortener can be.
          </p>
          <Button asChild className="btn-primary">
            <Link href="/pricing">
              Start Your Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card className="card-hover bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground mt-2">Sub-second response times</p>
                </CardContent>
              </Card>
              <Card className="card-hover bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Secure</h3>
                  <p className="text-sm text-muted-foreground mt-2">Enterprise-grade protection</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4 pt-8">
              <Card className="card-hover bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Global</h3>
                  <p className="text-sm text-muted-foreground mt-2">Worldwide CDN coverage</p>
                </CardContent>
              </Card>
              <Card className="card-hover bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">User-First</h3>
                  <p className="text-sm text-muted-foreground mt-2">Built for your success</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Evolution Timeline / Key Features */}
      <motion.section
        className="py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Our Evolution</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From a simple URL shortener to a comprehensive link management platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={scaleIn}>
            <Card className="h-full border-2 hover:border-orange-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Zapier Integration</h3>
                <p className="text-muted-foreground">
                  Connect to 7,000+ apps and automate your workflow with our official Zapier integration.
                  Create, track, and manage links across your entire tech stack.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full border-2 hover:border-blue-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Browser Extension</h3>
                <p className="text-muted-foreground">
                  Shorten URLs instantly from anywhere with our Chrome extension. Right-click any link,
                  select text, or use the popup—it's that easy.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full border-2 hover:border-green-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Track every click with detailed analytics including geographic data, referrer information,
                  device types, and real-time performance metrics.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full border-2 hover:border-purple-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Security First</h3>
                <p className="text-muted-foreground">
                  Password protection, link expiration, API authentication, and enterprise-grade security
                  features keep your links safe and under control.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full border-2 hover:border-orange-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Custom Branding</h3>
                <p className="text-muted-foreground">
                  Create branded short links with custom domains and custom slugs. Make every link
                  an extension of your brand identity.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="h-full border-2 hover:border-pink-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Growing Community</h3>
                <p className="text-muted-foreground">
                  Join thousands of users worldwide who trust OrangeURL for their link management needs.
                  From startups to established brands.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        className="text-center py-16 relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl" />
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Join Us?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Be part of the next generation of URL shortening. Start creating better links today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <Link href="/">Start Shortening</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" asChild>
              <Link href="https://discord.gg/FvJtFw64WV" target="_blank" rel="noopener noreferrer">Join Community</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
} 