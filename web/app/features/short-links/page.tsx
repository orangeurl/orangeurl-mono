'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Link as LinkIcon,
  Sparkles,
  BarChart3,
  Zap,
  Shield,
  Globe,
  QrCode,
  Clock,
  CheckCircle,
  Copy,
  TrendingUp,
  ArrowRight
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

export default function ShortLinksPage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero */}
      <motion.section 
        className="text-center space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium">
            <LinkIcon className="w-4 h-4 mr-2" />
            Core Feature
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="gradient-text-primary">Short Links</span> That
            <br />Work Harder
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Transform long, complex URLs into short, memorable links. Track every click, understand your audience, and optimize your marketing.
          </p>
          <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
            <Link href="/">
              Start Shortening
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground">Simple, fast, and powerful</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {[
            {
              step: "1",
              title: "Paste Your URL",
              description: "Copy any long URL and paste it into OrangeURL",
              icon: <Copy className="w-6 h-6" />
            },
            {
              step: "2",
              title: "Get Short Link",
              description: "Instantly receive a shortened orangeurl.live link",
              icon: <Zap className="w-6 h-6" />
            },
            {
              step: "3",
              title: "Share & Track",
              description: "Share your link and monitor clicks in real-time",
              icon: <TrendingUp className="w-6 h-6" />
            }
          ].map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-hover h-full border-2 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                  {item.step}
                </div>
                <CardContent className="p-8 space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={staggerContainer}>
          {[
            {
              title: "Custom Short URLs",
              description: "Create branded links like orangeurl.live/your-brand instead of random characters. Make your links memorable and trustworthy.",
              icon: <Sparkles className="w-8 h-8" />,
              gradient: "from-orange-500 to-red-500",
              badge: "Pro"
            },
            {
              title: "Detailed Analytics",
              description: "Track clicks, locations, devices, and referrers. Understand who's clicking your links and optimize your strategy.",
              icon: <BarChart3 className="w-8 h-8" />,
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              title: "QR Code Generation",
              description: "Automatically generate beautiful QR codes for your short links. Perfect for print materials and offline marketing.",
              icon: <QrCode className="w-8 h-8" />,
              gradient: "from-purple-500 to-pink-500",
              badge: "Pro"
            },
            {
              title: "Link Management",
              description: "Organize, edit, and delete your links from one dashboard. Keep track of all your shortened URLs in one place.",
              icon: <LinkIcon className="w-8 h-8" />,
              gradient: "from-green-500 to-emerald-500"
            },
            {
              title: "Lightning Fast Redirects",
              description: "Our global CDN ensures your links redirect in milliseconds, anywhere in the world.",
              icon: <Zap className="w-8 h-8" />,
              gradient: "from-amber-500 to-orange-500"
            },
            {
              title: "Enterprise Security",
              description: "All links are scanned for malware and phishing. SSL encryption ensures safe redirects for your users.",
              icon: <Shield className="w-8 h-8" />,
              gradient: "from-red-500 to-pink-500"
            }
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-hover h-full border-2 hover:border-primary/20">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white`}>
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-primary text-xs font-semibold rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Use Cases */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Perfect For</h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={staggerContainer}>
          {[
            { title: "Social Media Marketing", desc: "Share trackable links on Twitter, Instagram, Facebook", emoji: "📱" },
            { title: "Email Campaigns", desc: "Track email click-through rates and engagement", emoji: "📧" },
            { title: "Print Materials", desc: "Use QR codes on flyers, business cards, posters", emoji: "🖨️" },
            { title: "Affiliate Marketing", desc: "Manage and track affiliate links efficiently", emoji: "💰" }
          ].map((useCase, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-hover text-center h-full border-2">
                <CardContent className="p-6 space-y-3">
                  <div className="text-4xl mb-2">{useCase.emoji}</div>
                  <h3 className="font-bold">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start creating short links today. Choose a plan that fits your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <Link href="/">Create Short Link</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}






