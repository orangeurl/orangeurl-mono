'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Chrome,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Download,
  Shield,
  Sparkles,
  MousePointerClick,
  Clock,
  Copy,
  Lock,
  ChevronRight,
  Zap,
  Star,
  Users,
  BarChart3,
} from 'lucide-react';

export default function ChromeExtensionPage() {
  const features = [
    {
      name: 'One-Click Shortening',
      description: 'Right-click any link, text, or page to shorten instantly',
      icon: MousePointerClick,
    },
    {
      name: 'Auto-Copy',
      description: 'Shortened URLs automatically copied to your clipboard',
      icon: Copy,
    },
    {
      name: 'History Tracking',
      description: 'Keep track of your last 50 shortened URLs in the extension',
      icon: Clock,
    },
    {
      name: 'Custom URLs',
      description: 'Create branded short links with custom slugs (Premium)',
      icon: Sparkles,
    },
    {
      name: 'Password Protection',
      description: 'Secure your links with password protection (Premium)',
      icon: Lock,
    },
    {
      name: 'Flexible Auth',
      description: 'Works with or without an account—your choice',
      icon: Shield,
    },
  ];

  const useCases = [
    {
      title: 'Social Media Managers',
      description: 'Quickly shorten links while browsing and posting across multiple platforms',
      icon: Users,
    },
    {
      title: 'Content Creators',
      description: 'Create trackable links for videos, blogs, and newsletters without leaving your workflow',
      icon: Star,
    },
    {
      title: 'Marketing Teams',
      description: 'Generate campaign links on-the-fly with custom slugs and track performance',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-visible pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 mb-12 overflow-visible">
              {/* OrangeURL Logo */}
              <motion.div
                className="flex items-center shrink-0 overflow-visible"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/images/logo_orange_new.png"
                  alt="OrangeURL"
                  width={140}
                  height={42}
                  className="object-contain"
                  priority
                  unoptimized
                />
              </motion.div>

              <motion.span
                className="text-4xl font-light text-muted-foreground shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ×
              </motion.span>

              {/* Chrome Logo */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 backdrop-blur-sm border border-border/40 shadow-lg flex items-center justify-center shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Chrome className="w-16 h-16 text-blue-500" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent pb-2">
              OrangeURL for Chrome
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Shorten URLs instantly from anywhere on the web. One-click shortening, auto-copy to clipboard,
              and seamless integration with your OrangeURL dashboard.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                asChild
              >
                <a href="https://chromewebstore.google.com/detail/orangeurl-url-shortener/dmpmclneofkdlkcinlijndnbgkaggfni" target="_blank" rel="noopener noreferrer">
                  <Chrome className="w-5 h-5 mr-2" />
                  Add to Chrome
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/api-keys">
                  <Shield className="w-5 h-5 mr-2" />
                  Get API Key
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Works with or without an account • Free download
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">
              Powerful features built right into your browser
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-orange-200 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <feature.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <CardDescription className="mt-2">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Start shortening in seconds
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Install the Extension</CardTitle>
                    <CardDescription>Get started in one click</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-16 space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Click "Add to Chrome" button above</li>
                  <li>Confirm the installation</li>
                  <li>The OrangeURL icon will appear in your toolbar</li>
                </ol>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Configure (Optional)</CardTitle>
                    <CardDescription>Add your API key for premium features</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-16 space-y-4">
                <p className="text-muted-foreground">
                  The extension works without an account, but adding your API key unlocks:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Unlimited shortening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Custom URLs and passwords</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Sync with dashboard analytics</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/api-keys">
                      Get Your API Key
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Start Shortening</CardTitle>
                    <CardDescription>Three ways to create short links</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-16 space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium mb-1">Method 1: Right-Click Menu</p>
                    <p className="text-sm text-muted-foreground">
                      Right-click any link → "Shorten with OrangeURL"
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium mb-1">Method 2: Extension Popup</p>
                    <p className="text-sm text-muted-foreground">
                      Click the toolbar icon → Paste URL → Click "Shorten"
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium mb-1">Method 3: Current Page</p>
                    <p className="text-sm text-muted-foreground">
                      Right-click anywhere → "Shorten this page"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-lg text-muted-foreground">
              Built for professionals who share links every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-orange-200 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-600/20 w-fit mb-4">
                      <useCase.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <CardDescription className="mt-2">{useCase.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Modes */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Two Modes, Your Choice</h2>
            <p className="text-lg text-muted-foreground">
              Use with or without an account
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="w-6 h-6 text-orange-600" />
                  Anonymous Mode
                </CardTitle>
                <CardDescription>Quick and simple</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Start shortening immediately without creating an account.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">No Setup Required</p>
                      <p className="text-sm text-muted-foreground">Works instantly after installation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">IP-Based Rate Limits</p>
                      <p className="text-sm text-muted-foreground">Fair usage for all users</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Basic Features</p>
                      <p className="text-sm text-muted-foreground">Simple URL shortening</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-orange-600" />
                  Authenticated Mode
                </CardTitle>
                <CardDescription>Full power unlocked</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Add your API key to unlock all premium features.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Unlimited Shortening</p>
                      <p className="text-sm text-muted-foreground">No rate limits</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Premium Features</p>
                      <p className="text-sm text-muted-foreground">Custom URLs, passwords, expiry times</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Dashboard Sync</p>
                      <p className="text-sm text-muted-foreground">Track analytics and manage links</p>
                    </div>
                  </li>
                </ul>
                <div className="pt-2">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" asChild>
                    <Link href="/api-keys">
                      Get API Key
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who shorten URLs faster with our Chrome extension
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
                <a href="https://chromewebstore.google.com/detail/orangeurl-url-shortener/dmpmclneofkdlkcinlijndnbgkaggfni" target="_blank" rel="noopener noreferrer">
                  <Chrome className="w-5 h-5 mr-2" />
                  Install Now - It's Free
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View Pricing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
