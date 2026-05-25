'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Lock,
  Unlock,
  Shield,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  ArrowRight,
  AlertCircle
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
      staggerChildren: 0.15
    }
  }
};

export default function LockLinksPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    if (password === 'demo') {
      setIsUnlocked(true);
    }
  };

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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium">
            <Lock className="w-4 h-4 mr-2" />
            Secure Your Links
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="gradient-text-primary">Lock Your Links</span>
            <br />With Password Protection
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Add an extra layer of security to your shortened URLs. Protect sensitive content with password-protected links that only authorized users can access.
          </p>
        </motion.div>
      </motion.section>

      {/* Live Demo */}
      <motion.section 
        className="max-w-2xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Demo</h2>
          <p className="text-muted-foreground">
            Try entering the password: <code className="px-2 py-1 bg-primary/10 rounded text-primary font-mono text-sm">demo</code>
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          {!isUnlocked ? (
            <Card className="border-2 border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Lock Icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="inline-block"
                  >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">This Link is Protected</h3>
                    <p className="text-muted-foreground">
                      Please enter the password to access this content
                    </p>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                        className="text-center text-lg h-14 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <Button 
                      onClick={handleUnlock}
                      className="btn-primary w-full h-12 text-lg"
                    >
                      <Unlock className="w-5 h-5 mr-2" />
                      Unlock Link
                    </Button>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-left">
                        This link has been secured by the owner. Contact them if you need access.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-green-500/50 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                        Access Granted!
                      </h3>
                      <p className="text-muted-foreground">
                        You've successfully unlocked this protected link
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <p className="text-lg font-semibold mb-2">Protected Content</p>
                      <p className="text-muted-foreground">
                        This is where your secured content or redirect would appear. The user can now access the protected resource.
                      </p>
                    </div>

                    <Button 
                      onClick={() => {
                        setIsUnlocked(false);
                        setPassword('');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
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
          <h2 className="text-3xl md:text-4xl font-bold">Why Lock Your Links?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Perfect for sharing sensitive content securely
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {[
            {
              title: "Secure Sharing",
              description: "Share confidential documents, private galleries, or exclusive content with password protection.",
              icon: <Shield className="w-8 h-8" />,
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              title: "Access Control",
              description: "Control who can access your links. Change or remove passwords anytime you want.",
              icon: <Key className="w-8 h-8" />,
              gradient: "from-purple-500 to-pink-500"
            },
            {
              title: "Track Access",
              description: "Monitor who attempts to access your locked links with detailed analytics and logs.",
              icon: <Eye className="w-8 h-8" />,
              gradient: "from-orange-500 to-red-500"
            }
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-hover h-full border-2 hover:border-primary/20">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {feature.icon}
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
        className="space-y-12 bg-muted/30 rounded-3xl p-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Perfect For</h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={staggerContainer}
        >
          {[
            { title: "Business Documents", icon: "📄", desc: "Proposals, contracts, and confidential reports" },
            { title: "Private Events", icon: "🎉", desc: "Wedding photos, party invites, exclusive gatherings" },
            { title: "Client Portals", icon: "💼", desc: "Secure client resources and project files" },
            { title: "Educational Content", icon: "📚", desc: "Course materials, assignments, and resources" }
          ].map((useCase, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-hover border-2">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="text-4xl">{useCase.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                  </div>
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
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Secure Your Links?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join OrangeURL waitlist and get early access to Lock Links and all premium features.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="btn-primary text-lg px-10 py-6"
              onClick={() => {
                const event = new CustomEvent('openWaitlist', { detail: { plan: 'Lock Links' } });
                window.dispatchEvent(event);
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Join Waitlist
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






