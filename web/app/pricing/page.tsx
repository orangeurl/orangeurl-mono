'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WaitlistDialog } from '@/components/WaitlistDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  Check,
  X,
  Zap,
  Globe,
  BarChart3,
  Shield,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

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

const pricingPlans = [
  {
    name: "Pro",
    price: "$10",
    period: "per month",
    description: "Ideal for professionals and profiles",
    features: [
      { name: "100 links per month", included: true },
      { name: "Advanced analytics", included: true },
      { name: "1 year Analytics data retention", included: true },
      { name: "5 Custom links per month", included: true },
      { name: "5 Custom QR Codes per month", included: true },
      { name: "Priority support", included: true },
      { name: "AI shortener feature", included: true },
      { name: "API Access", included: true },
      { name: "Webhooks", included: true },
      { name: "Custom link expiry", included: false },
      { name: "Lock Links", included: false },
      { name: "Teams", included: false }
      
    ],
    buttonText: "Get Pro",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "$20",
    period: "per month",
    description: "For power users and businesses",
    features: [
      { name: "500 links per month", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Unlimited Analytics data retention", included: true },
      { name: "15 Custom links per month", included: true },
      { name: "15 Custom QR Codes per month", included: true },
      { name: "Priority support", included: true },
      { name: "AI shortener feature", included: true },
      { name: "API Access", included: true },
      { name: "Webhooks", included: true },
      { name: "Custom link expiry", included: true },
      { name: "Lock Links", included: true },
      { name: "Teams", included: true }
    ],
    buttonText: "Get Premium",
    buttonVariant: "default" as const,
    popular: true
  }
];

export default function PricingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  // Refresh session when returning from external payment page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    // If we have a payment status, user is returning from DodoPayments
    if (paymentStatus && !authLoaded) {
      setIsRefreshing(true);
    } else if (authLoaded) {
      setIsRefreshing(false);
    }
  }, [authLoaded]);

  // Check for return from DodoPayments
  useEffect(() => {
    // Wait for auth to be loaded before showing toasts
    if (!authLoaded || isRefreshing) return;

    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const status = params.get('status'); // Check for status parameter too

    // If status param is 'failed', override payment param
    if (status === 'failed') {
      toast({
        title: 'Payment Failed',
        description: 'Your payment could not be processed. Please check your payment details and try again, or contact support if the issue persists.',
        variant: 'error',
        duration: 6000,
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });

      // Clean up URL after showing message
      setTimeout(() => {
        window.history.replaceState({}, '', '/pricing');
      }, 2000);
      return;
    }

    if (paymentStatus === 'completed' && status !== 'failed') {
      // Payment successful
      toast({
        title: 'Payment successful',
        description: 'Your subscription is being activated.',
        variant: 'success',
        duration: 4000,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      // Clean up URL after showing message
      setTimeout(() => {
        window.history.replaceState({}, '', '/pricing');
      }, 2000);
    } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
      // Payment failed or cancelled
      toast({
        title: paymentStatus === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed',
        description: paymentStatus === 'cancelled'
          ? 'You cancelled the payment. Feel free to try again whenever you\'re ready.'
          : 'Your payment could not be processed. Please check your payment details and try again, or contact support if the issue persists.',
        variant: 'error',
        duration: 6000,
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });

      // Clean up URL after showing message
      setTimeout(() => {
        window.history.replaceState({}, '', '/pricing');
      }, 2000);
    }
  }, [authLoaded, isRefreshing, toast]);

  const handlePlanClick = async (planName: string) => {
    // For paid plans (Pro, Premium), redirect to checkout
    try {
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planName,
          billingInterval: billingCycle
        }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMsg = err?.error || 'Checkout failed';
        
        // Handle authentication required error
        if (res.status === 401 || errorMsg.includes('Authentication required')) {
          toast({
            title: 'Authentication required',
            description: 'Please log in to continue.',
            variant: 'warning',
            icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
          });
          setTimeout(() => {
            window.location.href = '/sign-in';
          }, 2000);
          return;
        }

        // Handle specific configuration errors
        if (errorMsg.includes('Authentication failed') || errorMsg.includes('configuration error')) {
          toast({
            title: 'Configuration error',
            description: 'Payment system unavailable. Please contact support.',
            variant: 'error',
            icon: <XCircle className="h-5 w-5 text-red-600" />,
          });
          return;
        }
        
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      if (data?.link) {
        window.location.href = data.link;
      } else {
        throw new Error('No checkout link returned');
      }
    } catch (e) {
      console.error('Failed to start checkout:', e);
      toast({
        title: 'Payment unavailable',
        description: 'Please try again later.',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };


  const getPrice = (plan: string) => {
    if (billingCycle === 'annual') {
      if (plan === 'Pro') return { price: '$100', period: 'per year', monthly: '$8.33/month' };
      if (plan === 'Premium') return { price: '$200', period: 'per year', monthly: '$16.67/month' };
    }
    if (plan === 'Pro') return { price: '$10', period: 'per month', monthly: null };
    return { price: '$20', period: 'per month', monthly: null };
  };

  // Show loading overlay while refreshing session
  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Refreshing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 py-12">
      {/* Header */}
      <motion.section 
        className="text-center space-y-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            Choose Your <span className="gradient-text-primary">Perfect Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scale as you grow. All plans include our core features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="relative inline-flex items-center bg-orange-50/50 dark:bg-orange-950/20 rounded-full p-1 border border-orange-200/50 dark:border-orange-800/50">
              <motion.div
                className="absolute top-1 bottom-1 bg-gradient-to-r from-orange-500/90 to-red-500/90 rounded-full shadow-lg"
                initial={false}
                animate={{
                  x: billingCycle === 'monthly' ? 0 : '100%',
                  width: billingCycle === 'monthly' ? '50%' : '50%',
                }}
                transition={{
                  type: 'tween',
                  ease: [0.4, 0, 0.2, 1],
                  duration: 0.3,
                }}
                style={{
                  left: '4px',
                  right: '4px',
                }}
              />
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-8 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pay monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`relative z-10 px-8 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'annual'
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pay annually
              </button>
            </div>
          </div>
          {billingCycle === 'annual' && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-primary font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Save up to 17% with annual billing
            </motion.p>
          )}
        </motion.div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            variants={fadeInUp}
            className="relative"
          >

            <Card className={`h-full card-hover relative overflow-hidden ${
              plan.popular
                ? 'border-2 border-primary shadow-2xl shadow-primary/20 scale-105 bg-gradient-to-br from-card via-card to-primary/5'
                : 'border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/5'
            }`}>
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
              )}

              <CardHeader className="text-center pb-4 pt-6 relative z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-3">{plan.name}</h3>
                <motion.div
                  className="space-y-2"
                  key={billingCycle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl md:text-4xl font-bold gradient-text-primary">
                      {getPrice(plan.name).price}
                    </span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      /{getPrice(plan.name).period}
                    </span>
                  </div>
                  {getPrice(plan.name).monthly && (
                    <motion.p
                      className="text-xs text-primary font-medium"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {getPrice(plan.name).monthly}
                    </motion.p>
                  )}
                  <p className="text-muted-foreground text-xs md:text-sm">{plan.description}</p>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-4 px-5 pb-6 relative z-10">
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  size="default"
                  className={`w-full ${plan.popular ? 'btn-primary' : ''}`}
                  onClick={() => handlePlanClick(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Features Comparison */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-5 md:space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/50 rounded-full text-sm font-semibold shadow-sm">
            <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Why OrangeURL
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold px-4">
            Why Choose <span className="gradient-text-primary">OrangeURL?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built for performance, designed for growth, trusted by professionals worldwide
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={staggerContainer}
        >
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              description: "Sub-second response times with global CDN delivery"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Enterprise Security",
              description: "Bank-grade security with SSL encryption and fraud protection"
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Detailed Analytics",
              description: "Track clicks, geographic data, and user behavior patterns"
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Custom QR Codes",
              description: "Generate branded QR codes with custom colors and your logo"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/10 border border-border/30 hover:border-primary/30 transition-all"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-5 md:space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-800/50 rounded-full text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold px-4">
            Frequently Asked <span className="gradient-text-primary">Questions</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
        >
          {[
            {
              question: "Can I upgrade or downgrade my plan?",
              answer: "Yes, you can change your plan at any time. Changes take effect immediately and we'll prorate the billing accordingly."
            },
            {
              question: "What happens to my links if I downgrade?",
              answer: "Your existing links will continue to work. However, you may hit usage limits for new links based on your plan."
            },
            {
              question: "Do you offer refunds?",
              answer: "Yes, we offer refunds until you haven't used any of the extra features that are supported with your plan after purchasing."
            },
            {
              question: "How do QR codes work with my links?",
              answer: "Every shortened link automatically gets a QR code. Pro and Premium plans allow custom QR code generation with your branding and colors."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/10 border border-border/30 hover:border-primary/20 transition-all"
            >
              <h3 className="text-base md:text-lg font-bold text-foreground">{faq.question}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Custom Plan CTA */}
      <motion.section 
        className="text-center py-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Card className="max-w-2xl mx-auto border-2 border-primary/20">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-2xl font-bold">Need a Custom Plan?</h3>
            <p className="text-muted-foreground">
              Looking for enterprise features, higher limits, or custom integrations? 
              We'll create a plan tailored to your needs.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:support@orangeurl.live" className="inline-flex items-center gap-2">
                Contact Us for Custom Pricing
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      <WaitlistDialog 
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        planName={selectedPlan}
      />
    </div>
  );
} 