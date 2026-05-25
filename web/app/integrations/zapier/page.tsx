'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Copy,
  Shield,
  Sparkles,
  Globe,
  BarChart3,
  Webhook,
  Link2,
  ChevronRight,
  Code,
  PlayCircle,
} from 'lucide-react';

export default function ZapierIntegrationPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const triggers = [
    {
      name: 'New Short URL Created',
      description: 'Triggers when you create a new short link',
      icon: Link2,
      useCase: 'Automatically share new links to Slack or add them to a spreadsheet',
    },
    {
      name: 'URL Clicked',
      description: 'Triggers when someone clicks your short link',
      icon: BarChart3,
      useCase: 'Track engagement by logging clicks to Google Sheets or sending notifications',
    },
  ];

  const actions = [
    {
      name: 'Create Short URL',
      description: 'Create a new short link from any trigger',
      icon: Sparkles,
      useCase: 'Automatically shorten URLs from RSS feeds, emails, or forms',
    },
  ];

  const workflows = [
    {
      title: 'Auto-Share Blog Posts',
      trigger: 'RSS Feed',
      steps: ['New item in feed', 'Create short URL', 'Post to Twitter/LinkedIn'],
      icon: Globe,
    },
    {
      title: 'Track Marketing Campaigns',
      trigger: 'URL Clicked',
      steps: ['Someone clicks link', 'Log to Google Sheets', 'Send Slack notification'],
      icon: BarChart3,
    },
    {
      title: 'Email Link Shortener',
      trigger: 'Gmail',
      steps: ['New email with link', 'Extract URL', 'Create short link', 'Reply with short URL'],
      icon: Link2,
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
              {/* OrangeURL Logo - Using new logo image */}
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

              {/* Zapier Logo */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 backdrop-blur-sm border border-border/40 shadow-lg flex items-center justify-center shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/images/partners/zapier-logo.svg"
                  alt="Zapier"
                  width={120}
                  height={40}
                  className="dark:hidden"
                />
                <Image
                  src="/images/partners/zapier-logo-white.svg"
                  alt="Zapier"
                  width={120}
                  height={40}
                  className="hidden dark:block"
                />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent pb-2">
              OrangeURL for Zapier
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect OrangeURL to 7,000+ apps with Zapier. Automate link shortening, track clicks, and build powerful workflows—no code required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                asChild
              >
                <a href="https://zapier.com/apps/orangeurl/integrations" target="_blank" rel="noopener noreferrer">
                  <Zap className="w-5 h-5 mr-2" />
                  Connect on Zapier
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
              Pro or Premium subscription required
            </p>
          </motion.div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Do</h2>
            <p className="text-lg text-muted-foreground">
              Powerful triggers and actions to automate your workflow
            </p>
          </div>

          <Tabs defaultValue="triggers" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="triggers">
                <Webhook className="w-4 h-4 mr-2" />
                Triggers
              </TabsTrigger>
              <TabsTrigger value="actions">
                <Sparkles className="w-4 h-4 mr-2" />
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="space-y-4">
              {triggers.map((trigger, index) => (
                <motion.div
                  key={trigger.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 hover:border-orange-200 transition-colors">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                          <trigger.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle>{trigger.name}</CardTitle>
                          <CardDescription className="mt-2">{trigger.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4" />
                        <span>Example: {trigger.useCase}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {actions.map((action, index) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 hover:border-orange-200 transition-colors">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                          <action.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle>{action.name}</CardTitle>
                          <CardDescription className="mt-2">{action.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4" />
                        <span>Example: {action.useCase}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Popular Workflows */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Workflows</h2>
            <p className="text-lg text-muted-foreground">
              Get inspired by these automation ideas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-orange-200 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-600/20 w-fit mb-4">
                      <workflow.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{workflow.title}</CardTitle>
                    <CardDescription>Trigger: {workflow.trigger}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workflow.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-semibold flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <p className="text-sm text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Guide */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Steps</h2>
            <p className="text-lg text-muted-foreground">
              Set up your first automation in minutes
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
                    <CardTitle className="text-2xl mb-2">Get Your API Key</CardTitle>
                    <CardDescription>API keys are required to authenticate with Zapier</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-16 space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Go to <Link href="/api-keys" className="text-orange-600 hover:underline">API Keys page</Link></li>
                  <li>Click "Create API Key"</li>
                  <li>Name it "Zapier Integration"</li>
                  <li>Select all permissions</li>
                  <li>Copy your API key (starts with <code className="bg-muted px-1 py-0.5 rounded">oran_live_</code>)</li>
                </ol>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <Shield className="w-4 h-4 inline mr-2" />
                    <strong>Pro or Premium required:</strong> API keys are available on paid plans only
                  </p>
                </div>
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
                    <CardTitle className="text-2xl mb-2">Connect to Zapier</CardTitle>
                    <CardDescription>Link your OrangeURL account to Zapier</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-16 space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Go to <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Zapier.com</a></li>
                  <li>Create a new Zap</li>
                  <li>Search for "OrangeURL"</li>
                  <li>Click "Sign in to OrangeURL"</li>
                  <li>Paste your API key</li>
                  <li>Click "Yes, Continue"</li>
                </ol>
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
                    <CardTitle className="text-2xl mb-2">Build Your Automation</CardTitle>
                    <CardDescription>Create your first Zap</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-16 space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Choose a trigger (e.g., "New Short URL Created")</li>
                  <li>Test the trigger to pull sample data</li>
                  <li>Add an action (e.g., "Send Email" or "Create Row in Google Sheets")</li>
                  <li>Configure the action with your URL data</li>
                  <li>Turn on your Zap!</li>
                </ol>

                <div className="flex gap-4 pt-4">
                  <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                    <a href="https://zapier.com/apps/orangeurl/integrations" target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Building
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Support */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Enterprise-Grade Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Encrypted API Keys</p>
                    <p className="text-sm text-muted-foreground">All API keys are encrypted and stored securely</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">HMAC Signature Verification</p>
                    <p className="text-sm text-muted-foreground">Webhooks are signed to prevent tampering</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Rate Limiting</p>
                    <p className="text-sm text-muted-foreground">Automatic protection against abuse</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-6 h-6 text-orange-600" />
                  Developer Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/docs/api" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">API Documentation</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
                <Link href="/webhooks" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">Webhook Management</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
                <a
                  href="https://github.com/xenonnn4w/orangeurl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">GitHub Repository</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
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
            <h2 className="text-4xl font-bold mb-6">Ready to Automate?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users automating their link management with Zapier
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
                <a href="https://zapier.com/apps/orangeurl/integrations" target="_blank" rel="noopener noreferrer">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started on Zapier
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

      {/* Trademark Attribution */}
      <section className="py-8 px-4 border-t border-border/40 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Zapier and the Zapier logo are trademarks of Zapier Inc. OrangeURL is not affiliated with, associated with, or endorsed by Zapier Inc.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This integration is built using Zapier&apos;s official platform and follows their{' '}
            <a
              href="https://zapier.com/legal/trademark-notice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              trademark guidelines
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
}
