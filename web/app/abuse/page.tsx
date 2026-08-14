'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  Mail,
  Send,
  Clock,
  Flag,
  Fingerprint,
  Ban,
  Gauge,
  Lock,
  ListChecks,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Truthful, code-backed safety controls. Each maps to a real mechanism in the
// service (creation-time filtering, abuse takedown, flagged-link interstitial,
// rate limiting, login-required creation). This section doubles as the summary
// we cite to school-network filters (e.g. C2k) and filter vendors.
const SAFETY_CONTROLS = [
  {
    icon: Fingerprint,
    title: 'Creation-time filtering',
    body: 'Links pointing at known phishing domains and high-abuse TLDs are rejected automatically and never created.',
  },
  {
    icon: Ban,
    title: 'Rapid takedown',
    body: 'Reported links are blocked promptly and resolve to a block page instead of forwarding to the destination.',
  },
  {
    icon: Flag,
    title: 'Safety interstitial',
    body: 'Links flagged as suspicious show a warning page to the visitor before any redirect, rather than forwarding silently.',
  },
  {
    icon: Gauge,
    title: 'Rate limiting',
    body: 'Per-client limits prevent automated bulk creation of links, a common abuse pattern.',
  },
  {
    icon: Lock,
    title: 'Accountable creation',
    body: 'Link creation requires a signed-in account, so links are tied to an owner rather than created anonymously.',
  },
];

const WHAT_TO_REPORT = [
  'Phishing or credential-harvesting pages',
  'Malware, drive-by downloads, or exploit links',
  'Spam, scams, or deceptive redirects',
  'Illegal content or content that endangers minors',
  'Harassment, threats, or impersonation',
];

export default function AbusePage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </motion.div>
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold leading-tight">
          Report <span className="gradient-text-primary">Abuse</span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          OrangeURL is a shortening service, not an open proxy. If a short link is being
          used for phishing, malware, spam, or anything harmful, tell us and we&apos;ll
          investigate and take action.
        </motion.p>
      </motion.section>

      {/* How to report */}
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
              <div className="w-14 h-14 bg-gradient-to-r from-primary to-orange-600 rounded-xl flex items-center justify-center text-white">
                <Mail className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Email our abuse team</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The fastest route. Include the full short link, what&apos;s wrong with it,
                  and any screenshots you can share.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>We aim to respond within 24 hours</span>
                </div>
              </div>
              <Button className="btn-primary w-full" asChild>
                <a href="mailto:abuse@orangeurl.live?subject=Abuse%20report">
                  <Send className="w-4 h-4 mr-2" />
                  abuse@orangeurl.live
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="card-hover h-full border-2 hover:border-primary/30">
            <CardContent className="p-8 space-y-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
                <Flag className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Report a specific link</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Found a single broken or suspicious short link? Use the link reporter to
                  flag it directly.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ListChecks className="w-4 h-4" />
                  <span>Best for one-off links</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/broken-link">
                  <Flag className="w-4 h-4 mr-2" />
                  Open the link reporter
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* What to report */}
      <motion.section
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">What you can report</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Anything that violates our acceptable use policy. Common examples:
          </p>
        </motion.div>
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHAT_TO_REPORT.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-6">
                See our{' '}
                <Link href="/terms" className="text-primary hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                for the full acceptable use policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Safety controls */}
      <motion.section
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">How we keep links safe</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Abuse controls run automatically on every link, not just after a report.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SAFETY_CONTROLS.map(({ icon: Icon, title, body }) => (
            <motion.div key={title} variants={fadeInUp}>
              <Card className="card-hover h-full border-2 hover:border-primary/30">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Note for network administrators / schools */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-muted/30">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-xl flex items-center justify-center text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">For network &amp; filter administrators</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you manage web filtering for a school, college, or managed network and
                you&apos;re reviewing whether to allow OrangeURL, here&apos;s what you need:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Abuse and safeguarding contact:{' '}
                    <a
                      href="mailto:abuse@orangeurl.live"
                      className="text-primary hover:underline font-medium"
                    >
                      abuse@orangeurl.live
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    OrangeURL only forwards to destination URLs — it is not an anonymiser or
                    open proxy, and it applies the automated controls listed above.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Gauge className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Domains to allow (domain-level): <code className="text-foreground">orangeurl.live</code>,{' '}
                    <code className="text-foreground">app.orangeurl.live</code>,{' '}
                    <code className="text-foreground">api.orangeurl.live</code>.
                  </span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Reviewing a categorisation or allow-list request? Email us and we&apos;ll
                respond promptly with anything your process requires.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
}
