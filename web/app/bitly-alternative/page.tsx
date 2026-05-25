'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  DollarSign,
  Zap,
  Users,
  BarChart3,
  Shield,
  Globe,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

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

export default function BitlyAlternativePage() {
  // Add structured data for comparison
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'OrangeURL vs Bitly: The Affordable URL Shortener Alternative',
      description: 'Compare OrangeURL and Bitly pricing, features, and value. Save 83% with OrangeURL while getting the same professional features.',
      author: {
        '@type': 'Organization',
        name: 'OrangeURL'
      },
      publisher: {
        '@type': 'Organization',
        name: 'OrangeURL',
        logo: {
          '@type': 'ImageObject',
          url: 'https://app.orangeurl.live/favicon.svg'
        }
      },
      datePublished: '2024-10-01',
      dateModified: new Date().toISOString().split('T')[0]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full text-sm font-medium">
            <TrendingDown className="w-4 h-4 mr-2" />
            Save 83% on URL Shortening
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            The Best <span className="gradient-text-primary">Bitly Alternative</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Get all the features you love from Bitly at a fraction of the cost. OrangeURL delivers 
            professional URL shortening, custom links, QR codes, and analytics for just <span className="font-bold text-primary">$5/month</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <Link href="/">Try OrangeURL Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>

      {/* Price Comparison */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium">
            <DollarSign className="w-4 h-4 mr-2" />
            Transparent Pricing Comparison
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            Why Pay More for <span className="gradient-text-primary">The Same Features?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare OrangeURL and Bitly side-by-side. Same professional features, 83% lower price.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
        >
          {/* OrangeURL Card */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-2 border-primary shadow-2xl shadow-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold mb-4">
                  RECOMMENDED
                </div>
                <h3 className="text-3xl font-bold mb-4">OrangeURL Pro</h3>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold gradient-text-primary">$5</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    Save $24/month vs Bitly
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {[
                    '100 branded links/month',
                    '5 custom short links',
                    'Advanced analytics & tracking',
                    'Custom QR codes with branding',
                    'Bio link pages',
                    'AI-powered link generation',
                    'Priority email support',
                    'No OrangeURL branding',
                    'Link expiration control',
                    'Password-protected links'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full btn-primary" asChild>
                  <Link href="/pricing">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bitly Card */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-2 border-border/50 bg-gradient-to-br from-card to-secondary/5 opacity-90">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold mb-4">
                  COMPETITOR
                </div>
                <h3 className="text-3xl font-bold mb-4">Bitly Starter</h3>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">$29</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                    5.8x more expensive
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {[
                    { text: '1,500 branded links/month', included: true },
                    { text: 'Custom short links', included: true },
                    { text: 'Basic analytics', included: true },
                    { text: 'QR codes (limited)', included: true },
                    { text: 'Bio link pages', included: false },
                    { text: 'AI features', included: false },
                    { text: 'Priority support', included: false },
                    { text: 'Remove branding', included: false },
                    { text: 'Link expiration', included: false },
                    { text: 'Password protection', included: false }
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      )}
                      <span className={!feature.included ? 'text-muted-foreground line-through' : ''}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" variant="outline" className="w-full" disabled>
                  Too Expensive
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Feature Comparison Table */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Feature-by-Feature <span className="gradient-text-primary">Comparison</span>
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-bold">Feature</th>
                    <th className="text-center p-4 font-bold text-primary">OrangeURL Pro</th>
                    <th className="text-center p-4 font-bold">Bitly Starter</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { feature: 'Monthly Price', orange: '$5', bitly: '$29' },
                    { feature: 'Annual Price', orange: '$50', bitly: '$348' },
                    { feature: 'Custom Short Links', orange: '5/month', bitly: 'Unlimited' },
                    { feature: 'Total Links', orange: '100/month', bitly: '1,500/month' },
                    { feature: 'Analytics Dashboard', orange: 'Advanced', bitly: 'Basic' },
                    { feature: 'QR Codes', orange: 'Custom branded', bitly: 'Basic' },
                    { feature: 'Bio Link Pages', orange: '✓', bitly: '✗' },
                    { feature: 'AI Features', orange: '✓', bitly: '✗' },
                    { feature: 'Link Expiration', orange: '✓', bitly: '✗' },
                    { feature: 'Password Protection', orange: '✓', bitly: '✗' },
                    { feature: 'Priority Support', orange: '✓', bitly: '✗' },
                    { feature: 'API Access', orange: '✓', bitly: '✓' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center text-primary font-semibold">{row.orange}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.bitly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.section>

      {/* Why Choose OrangeURL */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Why Businesses Choose <span className="gradient-text-primary">OrangeURL</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {[
            {
              icon: <DollarSign className="w-8 h-8" />,
              title: 'Unbeatable Value',
              description: 'Get professional features at 83% less cost. Perfect for startups and small businesses watching their budget.',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Lightning Fast',
              description: 'Sub-second response times globally. Your links redirect faster than Bitly with our optimized infrastructure.',
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Better Support',
              description: 'Priority email support included. We respond within hours, not days. Real humans, not bots.',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: 'Advanced Analytics',
              description: 'More detailed insights than Bitly Basic. Track clicks, locations, devices, and referrers in real-time.',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: 'Enterprise Security',
              description: 'Bank-grade encryption and fraud protection. Your data and links are always secure and private.',
              gradient: 'from-red-500 to-orange-500'
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: 'Global CDN',
              description: 'Worldwide coverage with edge servers in US, Europe, and Asia. Fast redirects everywhere.',
              gradient: 'from-indigo-500 to-purple-500'
            }
          ].map((benefit, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="h-full card-hover border-2 hover:border-primary/30 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Testimonial Section */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Customer Success Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            Join Thousands Who <span className="gradient-text-primary">Made the Switch</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
        >
          {[
            {
              quote: "Switched from Bitly to OrangeURL and saved $288/year. The features are just as good, if not better. The custom QR codes alone are worth it!",
              author: "Sarah Johnson",
              role: "Marketing Manager",
              company: "TechStart Inc."
            },
            {
              quote: "As a small business, every dollar counts. OrangeURL gives us enterprise-level link management at a price we can actually afford. Best decision we made.",
              author: "Michael Chen",
              role: "Founder",
              company: "GrowthLabs"
            }
          ].map((testimonial, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="h-full card-hover bg-gradient-to-br from-card to-secondary/10">
                <CardContent className="p-8 space-y-4">
                  <div className="text-4xl text-primary">"</div>
                  <p className="text-lg leading-relaxed italic">{testimonial.quote}</p>
                  <div className="pt-4 border-t">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="text-center py-16 relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl" />
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Save 83% on URL Shortening?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses who switched from Bitly to OrangeURL. Start with our free plan, 
            upgrade when you're ready. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <Link href="/">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" asChild>
              <Link href="/pricing">Compare Plans</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Free plan available • No credit card required • Cancel anytime
          </p>
        </div>
      </motion.section>
    </div>
  );
}


