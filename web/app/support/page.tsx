'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  MessageCircle, 
  Book, 
  HelpCircle,
  Send,
  Clock,
  CheckCircle,
  ExternalLink
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

export default function SupportPage() {
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
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            We're Here to <span className="gradient-text-primary">Help</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Get support, find answers, and connect with our community. We're committed to making your experience smooth and successful.
          </p>
        </motion.div>
      </motion.section>

      {/* Contact Methods */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Card className="card-hover h-full border-2 hover:border-primary/30">
            <CardContent className="p-8 space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-600 rounded-xl flex items-center justify-center text-white">
                <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Email Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send us an email and we'll get back to you within 24 hours during business days.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Response time: 24 hours</span>
                </div>
              </div>
              <Button className="btn-primary w-full" asChild>
                <a href="mailto:support@orangeurl.live">
                  <Send className="w-4 h-4 mr-2" />
                  Email Us
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="card-hover h-full border-2 hover:border-primary/30">
            <CardContent className="p-8 space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Community Discord</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join our Discord community for instant help, feature discussions, and updates.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Active community members</span>
                </div>
              </div>
              <Button className="btn-primary w-full" asChild>
                <a href="https://discord.gg/FvJtFw64WV" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discord
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Quick Help Resources */}
      <motion.section 
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Help</h2>
          <p className="text-xl text-muted-foreground">
            Common solutions and helpful resources
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Card className="card-hover border-2 hover:border-primary/20 h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                  <Book className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl">Documentation</h3>
                <p className="text-muted-foreground">
                  Learn how to use all features of OrangeURL with our comprehensive guides.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">
                    View FAQ
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="card-hover border-2 hover:border-primary/20 h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl">Common Issues</h3>
                <p className="text-muted-foreground">
                  Quick fixes for the most common problems users encounter.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Link not working? Check URL format</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom short taken? Try different name</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Analytics not showing? Wait 5-10 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="card-hover border-2 hover:border-primary/20 h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl">Feature Request</h3>
                <p className="text-muted-foreground">
                  Have an idea? We'd love to hear your suggestions for new features.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:support@orangeurl.live?subject=Feature Request">
                    Submit Idea
                    <Send className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
          <h2 className="text-3xl md:text-4xl font-bold">Still Need Help?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our support team is ready to assist you. Don't hesitate to reach out!
          </p>
          <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
            <a href="mailto:support@orangeurl.live">
              Contact Support
              <Mail className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}



