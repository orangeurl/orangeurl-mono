'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';

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

export default function PrivacyPage() {
  return (
    <div className="space-y-16 py-12 max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Privacy <span className="gradient-text-primary">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: October 10, 2025
          </p>
        </motion.div>
      </motion.section>

      {/* Introduction */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Card className="border-2">
          <CardContent className="p-8 space-y-4">
            <p className="text-lg leading-relaxed">
              At OrangeURL, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using OrangeURL, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Information We Collect */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold">Information We Collect</h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-2">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Email address</li>
                  <li>Name (optional)</li>
                  <li>Profile picture (optional)</li>
                  <li>Authentication credentials (managed by Clerk)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  When you use our service, we automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>IP addresses (anonymized for analytics)</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Geographic location (country and city level)</li>
                  <li>Click timestamps and referrer URLs</li>
                  <li>Shortened URLs you create and access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Cookies and Tracking</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use cookies and similar tracking technologies to improve user experience, maintain sessions, and analyze usage patterns.
                </p>
                <div className="space-y-2 ml-4">
                  <p className="text-muted-foreground text-sm">
                    <strong className="text-foreground">Essential Cookies:</strong> Required for authentication and core functionality (always active)
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong className="text-foreground">Analytics Cookies:</strong> Help us understand how you use our service (optional, requires consent)
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  You can manage your cookie preferences through our cookie consent banner or your browser settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* How We Use Your Information */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold">How We Use Your Information</h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-2">
            <CardContent className="p-8">
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Provide Services:</strong> To create, manage, and track your shortened URLs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Analytics:</strong> To provide you with insights about link performance and user behavior</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Improve Service:</strong> To understand usage patterns and enhance our platform</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Security:</strong> To detect and prevent fraud, abuse, and security incidents</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Communication:</strong> To send you service updates, security alerts, and support messages</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Data Sharing */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold">Data Sharing and Disclosure</h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <p className="text-lg font-semibold text-foreground">
                We do NOT sell your personal data to third parties.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-3 text-muted-foreground ml-4">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Service Providers:</strong> With trusted third-party services (Clerk for authentication, payment processors) who assist in operating our service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Legal Requirements:</strong> When required by law, court order, or government regulation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (you will be notified)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">With Your Consent:</strong> When you explicitly authorize us to share specific information</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Data Security */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">Data Security</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>SSL/TLS encryption for data transmission</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Encrypted data storage</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Access controls and authentication</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Your Rights */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">Your Rights (GDPR)</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you are a resident of the European Economic Area (EEA), you have the following data protection rights:
              </p>
              <ul className="space-y-3 text-muted-foreground ml-4">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Access:</strong> Request a copy of your personal data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Deletion:</strong> Request deletion of your data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Portability:</strong> Request transfer of your data to another service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Objection:</strong> Object to processing of your data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Restriction:</strong> Request restriction of processing</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:support@orangeurl.live" className="text-primary hover:underline">support@orangeurl.live</a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>


      {/* Children's Privacy */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">Children's Privacy</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed">
                Our service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Changes to Policy */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">Changes to This Policy</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Contact */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-orange-500/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center text-white mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <a 
              href="mailto:support@orangeurl.live" 
              className="inline-block text-primary hover:underline font-semibold text-lg"
            >
              support@orangeurl.live
            </a>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}

