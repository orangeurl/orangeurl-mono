'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle, Shield, Mail } from 'lucide-react';

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

export default function TermsPage() {
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
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Terms of <span className="gradient-text-primary">Service</span>
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
              Welcome to OrangeURL. These Terms of Service ("Terms") govern your use of our URL shortening service. By accessing or using OrangeURL, you agree to be bound by these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Please read these Terms carefully before using our service. If you do not agree with any part of these Terms, you may not use our service.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Acceptance of Terms */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">1. Acceptance of Terms</h2>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                By creating an account or using OrangeURL, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. These Terms apply to all users of the service, including visitors, registered users, and paid subscribers.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Service Description */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">2. Service Description</h2>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                OrangeURL provides a URL shortening service that allows users to create shortened versions of long URLs. Our service includes:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>URL shortening and redirection</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Custom short URL creation (Pro tier)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>QR code generation (Pro tier)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Analytics and click tracking</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Link management dashboard</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of our service at any time with or without notice.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* User Accounts */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">3. User Accounts</h2>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Creation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Termination</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in any fraudulent, abusive, or illegal activity.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Acceptable Use */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold">4. Acceptable Use Policy</h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-2 border-red-200 dark:border-red-900">
            <CardContent className="p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You agree NOT to use OrangeURL to:
              </p>
              <ul className="space-y-3 text-muted-foreground ml-4">
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Shorten URLs that link to illegal content, malware, phishing sites, or spam</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Distribute viruses, malware, or any harmful code</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Engage in fraud, scams, or deceptive practices</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Violate intellectual property rights of others</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Harass, abuse, or harm others</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Distribute adult content without proper age verification</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Bypass security features or attempt unauthorized access</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✕</span>
                  <span>Use automated systems to create excessive links (unless on Enterprise plan)</span>
                </li>
              </ul>
              <p className="text-red-600 dark:text-red-400 font-semibold mt-4">
                Violation of this policy may result in immediate account termination and reporting to relevant authorities.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Subscription and Billing */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">5. Subscription and Billing</h2>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Paid Plans</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Certain features require a paid subscription. By subscribing, you agree to pay the fees for the selected plan. All fees are exclusive of taxes unless stated otherwise.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Billing Cycle</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Subscriptions are billed in advance on a recurring basis (monthly or annually) depending on your chosen plan. Your subscription will automatically renew unless you cancel before the renewal date.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cancellation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may cancel your subscription at any time from your account settings. Cancellation will take effect at the end of the current billing period. No refunds are provided for partial periods, except as required by law or for annual plans within 14 days.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Price Changes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify subscription prices. Price changes will be communicated at least 30 days in advance and will apply to subsequent billing periods.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Intellectual Property */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">6. Intellectual Property</h2>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The OrangeURL service, including its design, features, graphics, and code, is owned by OrangeURL and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of the URLs you shorten and any content you provide. By using our service, you grant us a limited license to store and display your shortened URLs for the purpose of providing the service.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Limitation of Liability */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold">7. Limitation of Liability</h2>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                OrangeURL is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, OrangeURL shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability for any claims arising from your use of the service shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Indemnification */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">8. Indemnification</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless OrangeURL, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service or violation of these Terms.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Dispute Resolution */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">9. Dispute Resolution</h2>
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Any disputes arising from these Terms or your use of OrangeURL shall first be attempted to be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with applicable arbitration rules.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which OrangeURL operates, without regard to conflict of law principles.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Changes to Terms */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-bold mb-6">10. Changes to Terms</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the new Terms.
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
            <h2 className="text-2xl font-bold">Questions About These Terms?</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
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






