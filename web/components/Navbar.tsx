'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/nextjs';
import { DarkModeToggle } from './DarkModeToggle';
import { NotificationBell } from './NotificationBell';
import { TierUserButton } from './TierUserButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, Link as LinkIcon, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'premium' | null>(null);
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const { t } = useTranslation();

  // Track when Clerk is loaded
  useEffect(() => {
    if (isLoaded) {
      setIsClerkLoaded(true);
    }
  }, [isLoaded]);

  // Navigation items with translations - memoized to react to language changes
  const navItems = useMemo(() => [
    { href: '/', label: t.navbar.home },
    { href: '/dashboard', label: t.navbar.dashboard },
    { href: '/team', label: t.navbar.team },
    { href: '/pricing', label: t.navbar.pricing },
    { href: '/docs', label: t.navbar.api },
    { href: '/about', label: t.navbar.about },
  ], [t]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user tier when signed in
  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/user/tier')
        .then(res => res.json())
        .then(data => {
          if (data.tier) {
            setUserTier(data.tier.toLowerCase() as 'free' | 'pro' | 'premium');
          }
        })
        .catch(err => {
          console.error('Failed to fetch user tier:', err);
          setUserTier('free');
        });
    } else {
      setUserTier('free');
    }
  }, [isSignedIn]);

  return (
    <motion.nav 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b shadow-lg" 
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <LinkIcon className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold gradient-text-primary">
                OrangeURL
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2 md:-translate-x-[160px]">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-primary group",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-orange-600 rounded-full"
                      layoutId="navbar-underline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <LanguageSwitcher />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <DarkModeToggle />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Show login button when not signed in or while Clerk is loading */}
              {!isSignedIn && (
                <Button variant="outline" className="flex items-center space-x-2" asChild>
                  <Link href="/sign-in">
                    <User className="w-4 h-4" />
                    <span>{t.navbar.signIn}</span>
                  </Link>
                </Button>
              )}
              {isSignedIn && (
                <>
                  <NotificationBell />
                  <TierUserButton tier={userTier || 'free'} />
                </>
              )}
            </motion.div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            {isSignedIn && (
              <>
                <NotificationBell />
                <TierUserButton tier={userTier || 'free'} />
              </>
            )}
            {!isSignedIn && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">
                  <User className="w-4 h-4" />
                </Link>
              </Button>
            )}
            <LanguageSwitcher />
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="pt-3 border-t border-border"
              >
                {!isSignedIn && (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    asChild
                  >
                    <Link href="/sign-in">
                      <User className="w-4 h-4" />
                      <span>{t.navbar.signIn}</span>
                    </Link>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
