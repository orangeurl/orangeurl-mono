'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Link as LinkIcon,
  Shield,
  BarChart3,
  Zap,
  CreditCard,
  Settings,
  HelpCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

interface FAQCategory {
  title: string;
  icon: JSX.Element;
  gradient: string;
  faqs: FAQItem[];
}

function FAQAccordion({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-4 flex items-start justify-between gap-4 text-left hover:bg-muted/50 transition-colors rounded-lg"
      >
        <span className="font-semibold text-lg pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 mt-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-6 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQPage() {
  const categories: FAQCategory[] = [
    {
      title: 'Getting Started',
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500',
      faqs: [
        {
          question: 'What is OrangeURL?',
          answer: 'OrangeURL is a modern URL shortening service that transforms long, complex URLs into short, shareable links. It provides real-time analytics, custom short links, QR code generation, AI-powered suggestions, link locking, team collaboration, and API access to help you manage and track your links effectively.'
        },
        {
          question: 'Do I need an account to use OrangeURL?',
          answer: 'No! You can create short links without an account. However, creating a free account gives you access to analytics, link management, and the ability to view all your shortened links in one dashboard. Paid plans unlock additional features like custom short codes, QR codes, AI suggestions, and link locking.'
        },
        {
          question: 'How do I create a short link?',
          answer: (
            <div className="space-y-2">
              <p>There are several ways to create short links:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Website:</strong> Paste your long URL in the input field on the homepage and click "Shorten"</li>
                <li><strong>Dashboard:</strong> Use the URL shortener in your dashboard if you're logged in</li>
                <li><strong>Browser Extension:</strong> Install our Chrome extension to shorten URLs with one click from any webpage</li>
                <li><strong>API:</strong> Integrate OrangeURL into your applications using our API</li>
              </ul>
            </div>
          )
        },
        {
          question: 'How much does OrangeURL cost?',
          answer: 'OrangeURL offers Pro ($5/month) and Premium ($15/month) plans with features like custom links, QR codes, AI suggestions, analytics, and link locking. Check out our pricing page for more details.'
        },
        {
          question: 'How long do shortened links last?',
          answer: 'By default, shortened links last forever and never expire. However, Premium plan users can optionally set custom expiration dates when creating links. You can also manually delete any link from your dashboard at any time.'
        }
      ]
    },
    {
      title: 'Link Management',
      icon: <LinkIcon className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      faqs: [
        {
          question: 'Can I customize my short links?',
          answer: 'Yes! Pro plan users get 5 custom links per month, and Premium users get 15 custom links per month. This allows you to create memorable short codes like "orangeurl.live/my-product" instead of random characters. Custom codes must be unique and available.'
        },
        {
          question: 'Can I edit a short link after creating it?',
          answer: 'Currently, you cannot edit the destination URL after a short link is created. The short code also cannot be changed once created. If you need to change where a link points to, you\'ll need to create a new short link and delete the old one.'
        },
        {
          question: 'How do I delete a shortened link?',
          answer: 'Sign in to your dashboard, find the link you want to delete in your links list, and click the delete button. Once deleted, the short link will no longer work and will show a "Link not found" message. Deletion is permanent and cannot be undone.'
        },
        {
          question: 'Can I organize my links?',
          answer: 'Your links are displayed in your dashboard with their creation dates, click counts, and analytics. You can view detailed analytics for each link and use the search features to find specific links. Premium users can also share links with team members for collaboration.'
        },
        {
          question: 'What happens if someone uses my custom short code?',
          answer: 'Each custom short code must be unique across all of OrangeURL. If someone has already claimed a custom code, you\'ll need to choose a different one. Try adding numbers, hyphens, or variations to make your desired code unique.'
        },
        {
          question: 'What is the AI suggestion feature?',
          answer: 'Pro and Premium users have access to AI-powered short link suggestions. When creating a link, the AI analyzes your destination URL and suggests relevant, memorable custom short codes that are available. This makes it easier to create branded, easy-to-remember links.'
        },
        {
          question: 'Can I generate QR codes for my links?',
          answer: 'Yes! Pro users can generate up to 5 custom QR codes per month, and Premium users get 15 per month. QR codes are available in multiple styles (classic, rounded, gradient, minimal, dots) and can be downloaded in high resolution for printing and sharing.'
        }
      ]
    },
    {
      title: 'Analytics & Tracking',
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      faqs: [
        {
          question: 'What analytics does OrangeURL provide?',
          answer: (
            <div className="space-y-2">
              <p>OrangeURL provides comprehensive analytics for your shortened links:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Click counts:</strong> Total clicks tracked</li>
                <li><strong>Geographic data:</strong> Countries where your visitors are from</li>
                <li><strong>Referrers:</strong> Where your traffic is coming from</li>
                <li><strong>Devices:</strong> Desktop vs mobile vs tablet breakdown</li>
                <li><strong>Browsers:</strong> Which browsers visitors use</li>
                <li><strong>Time series:</strong> Clicks over time with interactive charts</li>
              </ul>
            </div>
          )
        },
        {
          question: 'How often are analytics updated?',
          answer: 'Analytics are updated in real-time. When someone clicks your link, the data is recorded immediately and will appear in your dashboard within a few seconds. Charts and graphs are refreshed automatically.'
        },
        {
          question: 'Can I see who clicked my links?',
          answer: 'For privacy reasons, we do not track or display individual user identities. We only show aggregate, anonymous data such as location, device type, and referrer. This ensures your visitors\' privacy while still giving you valuable insights.'
        },
        {
          question: 'Do anonymous links have analytics?',
          answer: 'Links created without an account do not have analytics. You must be signed in when creating a link to access analytics for that link. This is why we recommend creating a free account.'
        },
        {
          question: 'Can I export my analytics data?',
          answer: 'Analytics data can be viewed and analyzed directly in your dashboard with interactive charts and detailed breakdowns. For programmatic access to analytics data, Premium users can use the API to retrieve analytics in JSON format.'
        }
      ]
    },
    {
      title: 'Security & Privacy',
      icon: <Shield className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500',
      faqs: [
        {
          question: 'Are shortened links secure?',
          answer: 'Yes! All OrangeURL links use HTTPS encryption. We also scan destination URLs for known malware and phishing sites. However, we recommend only shortening URLs from trusted sources and being cautious when clicking shortened links from unknown sources.'
        },
        {
          question: 'Can I password-protect my links?',
          answer: 'Yes! Premium users can add password protection to any link (called "Link Locking"). When someone tries to access a locked link, they\'ll be prompted to enter the password before being redirected. This is great for sharing sensitive content with specific people.'
        },
        {
          question: 'What data does OrangeURL collect?',
          answer: 'We collect minimal data necessary for the service: destination URLs, click analytics (location, device, referrer), and account information if you sign up. We never sell your data to third parties. Read our full privacy policy for complete details.'
        },
        {
          question: 'Can I report malicious links?',
          answer: 'Yes! If you encounter a shortened link that leads to malicious content, phishing, or spam, please report it to support@orangeurl.live. We take abuse seriously and will investigate and take action promptly.'
        },
        {
          question: 'How do you prevent spam and abuse?',
          answer: 'We implement rate limiting, monitor for suspicious patterns, scan URLs for malware, and have an abuse reporting system. Links that violate our terms of service or lead to illegal content will be immediately disabled.'
        }
      ]
    },
    {
      title: 'Browser Extension',
      icon: <Settings className="w-6 h-6" />,
      gradient: 'from-yellow-500 to-orange-500',
      faqs: [
        {
          question: 'What is the OrangeURL browser extension?',
          answer: 'The OrangeURL browser extension allows you to shorten URLs directly from your browser without visiting our website. Right-click any link to shorten it, or click the extension icon to shorten the current page. The shortened URL is automatically copied to your clipboard.'
        },
        {
          question: 'Which browsers are supported?',
          answer: 'Currently, we support Chrome and all Chromium-based browsers (Edge, Brave, Opera, Vivaldi, etc.). Firefox support is coming soon. Download the extension from the Chrome Web Store.'
        },
        {
          question: 'Do I need an account to use the extension?',
          answer: 'No, the extension works without an account for anonymous link shortening. However, signing in within the extension gives you access to your link history, analytics, and custom short codes.'
        },
        {
          question: 'How do I sign in to the extension?',
          answer: 'Click the extension icon, then click "Sign In" in the popup. You\'ll be redirected to our website to authenticate. Once signed in, the extension will remember your session and sync with your account.'
        },
        {
          question: 'Can I view my link history in the extension?',
          answer: 'Yes! If you\'re signed in, the extension displays your recently shortened links. Click any link to copy it again, or click "View All" to open your full dashboard on the website.'
        }
      ]
    },
    {
      title: 'Plans & Billing',
      icon: <CreditCard className="w-6 h-6" />,
      gradient: 'from-indigo-500 to-purple-500',
      faqs: [
        {
          question: 'What are the different pricing tiers?',
          answer: (
            <div className="space-y-2">
              <p>OrangeURL offers three plans:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Free:</strong> 5 links/month, basic analytics (1 month retention)</li>
                <li><strong>Pro ($5/month):</strong> 100 links/month, 1 year analytics retention, 5 custom links/month, 5 custom QR codes/month, AI suggestions, priority support</li>
                <li><strong>Premium ($15/month):</strong> 500 links/month, custom analytics retention, 15 custom links/month, 15 custom QR codes/month, AI suggestions, custom expiry, link locking, team features, API access, webhooks</li>
              </ul>
              <p className="mt-2">Visit our <Link href="/pricing" className="text-primary hover:underline">pricing page</Link> for detailed feature comparison.</p>
            </div>
          )
        },
        {
          question: 'Can I upgrade or downgrade my plan?',
          answer: 'Yes! You can upgrade or downgrade your plan at any time from your account settings. When upgrading, you\'ll be charged a prorated amount for the remainder of your billing cycle. When downgrading, the change takes effect at the end of your current billing period.'
        },
        {
          question: 'What happens to my links if I downgrade?',
          answer: 'Your existing links continue to work and redirect normally even if you downgrade. However, you may lose access to certain features like custom links, QR codes, link locking, or extended analytics retention. You won\'t be able to create new links if you\'ve exceeded your plan\'s monthly limit.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied for any reason, contact support@orangeurl.live within 14 days of your purchase for a full refund. After 14 days, we do not offer refunds for unused portions of your subscription.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and debit cards. All payments are processed securely through our payment provider, DodoPayments. We do not store your card details on our servers.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes! You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing period, and you won\'t be charged again. You can reactivate your subscription at any time.'
        }
      ]
    },
    {
      title: 'API & Integration',
      icon: <Settings className="w-6 h-6" />,
      gradient: 'from-red-500 to-pink-500',
      faqs: [
        {
          question: 'Does OrangeURL have an API?',
          answer: 'Yes! Premium plan users have access to our RESTful API. The API allows you to programmatically create, manage, and retrieve analytics for shortened links. Perfect for integrating OrangeURL into your applications, automation workflows, or custom tools.'
        },
        {
          question: 'How do I get API access?',
          answer: 'API access is included with Premium plans. Once subscribed, you can generate API keys from your dashboard under the API Keys section. Each key has configurable permissions (urls:read, urls:write, analytics:read, webhooks:read, webhooks:write). Keep your API keys secure and never share them publicly.'
        },
        {
          question: 'What can I do with the API?',
          answer: (
            <div className="space-y-2">
              <p>The OrangeURL API allows you to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Create shortened links programmatically</li>
                <li>Retrieve link analytics and statistics</li>
                <li>Update link status (activate/deactivate)</li>
                <li>Delete links</li>
                <li>List all your links with filtering</li>
                <li>Manage webhooks for link events</li>
              </ul>
            </div>
          )
        },
        {
          question: 'Are there API rate limits?',
          answer: 'Yes. API keys have rate limits based on your plan tier. Premium plans have generous rate limits to support most use cases. Rate limits are enforced per API key to prevent abuse. If you need higher limits for enterprise use cases, contact us at support@orangeurl.live.'
        },
        {
          question: 'Is there API documentation?',
          answer: 'Yes! Complete API documentation is available at https://api.orangeurl.live/docs with interactive Swagger UI. The documentation includes authentication guides, endpoint references, and example requests. You can also access it from your dashboard\'s API Keys section.'
        },
        {
          question: 'What are webhooks and how do I use them?',
          answer: 'Webhooks allow you to receive real-time notifications when events happen (like link clicks). Premium users can create webhooks that send HTTP POST requests to your specified URL when links are clicked. This is useful for integrating OrangeURL with your own systems and automation workflows.'
        },
        {
          question: 'Can I collaborate with my team?',
          answer: 'Yes! Premium users can create teams and invite team members. Team owners can share specific links with the team, allowing all members to view analytics and collaborate on link management. This is perfect for marketing teams, agencies, and businesses.'
        }
      ]
    },
    {
      title: 'Troubleshooting',
      icon: <HelpCircle className="w-6 h-6" />,
      gradient: 'from-pink-500 to-rose-500',
      faqs: [
        {
          question: 'My shortened link isn\'t working. What should I do?',
          answer: (
            <div className="space-y-2">
              <p>If your link isn\'t working, try these steps:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Check that the destination URL is valid and accessible</li>
                <li>Verify the link hasn\'t expired (check expiration date in dashboard)</li>
                <li>Ensure the link hasn\'t been deleted</li>
                <li>If password-protected, verify you\'re using the correct password</li>
                <li>Try accessing the link from a different browser or device</li>
                <li>Contact support if the issue persists</li>
              </ol>
            </div>
          )
        },
        {
          question: 'I\'m not receiving analytics data. Why?',
          answer: 'Analytics are only available for links created while signed in to an account. If you created the link anonymously, analytics won\'t be available. Also, ensure you\'re viewing the correct link in your dashboard and that there have actually been clicks on the link. Analytics appear in real-time after clicks are recorded.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Sign In" on the homepage, then click "Forgot password?" below the password field. Enter your email address and we\'ll send you a password reset link. Check your spam folder if you don\'t receive it within a few minutes.'
        },
        {
          question: 'Can I recover a deleted link?',
          answer: 'Unfortunately, deleted links cannot be recovered. Once you delete a link, it\'s permanently removed from our system and the short code becomes available for others to use. We recommend being careful when deleting links.'
        },
        {
          question: 'Why is my custom short code not available?',
          answer: 'Custom short codes must be unique across all of OrangeURL. If a code is already taken by another user, you\'ll need to choose a different one. Try adding numbers, hyphens, or variations. You can also check availability by trying to create the link.'
        },
        {
          question: 'How do I contact support?',
          answer: (
            <div className="space-y-2">
              <p>We\'re here to help! You can reach us through:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Email:</strong> <a href="mailto:support@orangeurl.live" className="text-primary hover:underline">support@orangeurl.live</a></li>
                <li><strong>Discord:</strong> Join our <a href="https://discord.gg/FvJtFw64WV" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">community server</a></li>
                <li><strong>Support page:</strong> Visit our <Link href="/support" className="text-primary hover:underline">support page</Link></li>
              </ul>
              <p className="mt-2">We typically respond within 24 hours during business days.</p>
            </div>
          )
        }
      ]
    }
  ];

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
            Frequently Asked <span className="gradient-text-primary">Questions</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Everything you need to know about OrangeURL. Can't find what you're looking for?
            {' '}<Link href="/support" className="text-primary hover:underline">Contact our support team</Link>.
          </p>
        </motion.div>
      </motion.section>

      {/* FAQ Categories */}
      {categories.map((category, idx) => (
        <motion.section
          key={idx}
          className="space-y-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            <div className={`w-14 h-14 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {category.icon}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{category.title}</h2>
          </motion.div>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="divide-y divide-border">
                {category.faqs.map((faq, faqIdx) => (
                  <FAQAccordion key={faqIdx} {...faq} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      ))}

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
          <h2 className="text-3xl md:text-4xl font-bold">Still Have Questions?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <Link href="/support">
                Contact Support
                <Mail className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6" asChild>
              <a href="https://discord.gg/FvJtFw64WV" target="_blank" rel="noopener noreferrer">
                Join Discord
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
