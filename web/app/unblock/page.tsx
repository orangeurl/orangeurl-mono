'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Copy,
  Check,
  Mail,
  Building2,
  ListChecks,
  Info,
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } },
};

// Ready-to-send request. The reader edits the [bracketed] fields, then copies
// it into an email to their own IT / network team / C2k Coordinator. Kept
// generic enough for any web filter, with a specific note for the C2k managed
// network that Northern Ireland schools run on.
const TEMPLATE = `Subject: Please allow-list orangeurl.live on our web filter

Hi [IT team / Network Manager / C2k Coordinator],

I use short links from orangeurl.live to share resources with my classes, but they are being blocked by our web filtering — the links will not open on our network.

Could you please allow-list the domain *.orangeurl.live for educational use? This covers the three hostnames the service needs:
  - orangeurl.live
  - app.orangeurl.live
  - api.orangeurl.live

Please allow-list at the domain level rather than a single link, so that new short links keep working too.

For reference, OrangeURL is a link-shortening service (not an open proxy). Its trust & safety page — including an abuse contact and the safety controls it runs — is here: https://orangeurl.live/abuse

If we are on the C2k managed network, this will need to be raised with the C2k Service Desk. I am happy to provide anything else needed.

Thanks very much,
[Your name] — [Subject / Department], [School / College]`;

export default function UnblockPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the textarea below
      // stays selectable so the reader can copy manually.
    }
  };

  return (
    <div className="space-y-24 py-12">
      {/* Hero */}
      <motion.section
        className="text-center space-y-6"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold leading-tight">
          Links blocked at your <span className="gradient-text-primary">school?</span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Many school, college, and workplace web filters block URL shorteners by default.
          The fix is quick: ask whoever manages your network to allow-list OrangeURL. Copy
          the request below and send it to them.
        </motion.p>
      </motion.section>

      {/* The template */}
      <motion.section
        className="space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-bold">Copy this request</h2>
                <Button className="btn-primary" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy request
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Edit the{' '}
                <code className="text-foreground">[bracketed]</code> parts, then send it to
                your IT team, Network Manager, or C2k Coordinator.
              </p>
              <textarea
                readOnly
                value={TEMPLATE}
                onFocus={(e) => e.currentTarget.select()}
                rows={22}
                className="w-full rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm text-foreground leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Allow-list request template"
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Who to send it to + what to ask */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Card className="card-hover h-full border-2">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Who to send it to</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your school or college IT team or Network Manager. On the C2k network used by
                Northern Ireland schools, ask your C2k Coordinator to raise it with the C2k
                Service Desk.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="card-hover h-full border-2">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <ListChecks className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">What to ask for</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A <strong>domain-level</strong> allow-list of{' '}
                <code className="text-foreground">*.orangeurl.live</code> — covering{' '}
                <code className="text-foreground">orangeurl.live</code>,{' '}
                <code className="text-foreground">app.orangeurl.live</code> and{' '}
                <code className="text-foreground">api.orangeurl.live</code> — not just one link.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="card-hover h-full border-2">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Reassure their reviewer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Filter teams check safety first. Point them at our{' '}
                <Link href="/abuse" className="text-primary hover:underline font-medium">
                  trust &amp; safety page
                </Link>
                , which lists our abuse contact and automated safety controls.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Footer note */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
          <Card className="border-2 bg-muted/30">
            <CardContent className="p-6 flex items-start gap-4">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Networks are usually managed centrally, so once your IT team or C2k Service
                Desk approves the request it typically unblocks OrangeURL for everyone on that
                network — not just your device. If they have questions, they can reach us at{' '}
                <a
                  href="mailto:abuse@orangeurl.live"
                  className="text-primary hover:underline font-medium"
                >
                  abuse@orangeurl.live
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
}
