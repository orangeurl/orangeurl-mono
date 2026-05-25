'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 max-w-md z-50"
        >
          <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 px-4 py-3 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center">
                  <Cookie className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-sm">Cookie Notice</h3>
              </div>
              <button
                onClick={handleReject}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use essential cookies to provide authentication and core functionality. By clicking "Accept", you agree to our use of cookies.{' '}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Learn more
                </Link>
              </p>

              {/* Buttons */}
              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  onClick={handleAccept}
                  className="flex-1 btn-primary text-sm"
                  size="sm"
                >
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="flex-1 text-sm"
                  size="sm"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
