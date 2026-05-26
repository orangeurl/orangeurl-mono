'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Link as LinkIcon,
  Zap,
  Shield,
  BarChart3,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  X,
  QrCode,
  Download,
  Brain,
  Lock,
  Copy,
  Crown,
  Instagram,
  Twitter,
  ShoppingBag,
  FileText,
  Youtube,
  XCircle,
  CheckCircle2,
  Info,
  AlertCircle
} from 'lucide-react';
import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIncreasingStats } from '@/hooks/use-increasing-stats';
import { isValidUrl, copyToClipboard } from '@/lib/utils';
import { validateURLProtocol, validateCustomShortURL, sanitizeInput } from '@/lib/security';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import QRCode from 'qrcode';
// qr-code-styling is heavy (~80 KB). Loaded lazily on demand to keep landing page light.
import type QRCodeStylingType from 'qr-code-styling';
import { WaitlistDialog } from '@/components/WaitlistDialog';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

// Component to handle URL prefill from query params
function URLPrefillHandler() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');

  return <HomeContent initialUrl={urlParam ? decodeURIComponent(urlParam) : undefined} />;
}

function HomeContent({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl || '');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [customShort, setCustomShort] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const [includeQRCode, setIncludeQRCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [qrCodeStyle, setQrCodeStyle] = useState<string>('classic');
  const [aiGenerateShort, setAiGenerateShort] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [lockLink, setLockLink] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const { linksCreated, activeUsers } = useIncreasingStats();
  const { t } = useTranslation();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [userTier, setUserTier] = useState<string | null>(null);
  const [tierFeatures, setTierFeatures] = useState<any>(null);
  const [isTierLoading, setIsTierLoading] = useState(true);

  // Scroll to URL shortener section when initialUrl is provided
  useEffect(() => {
    if (initialUrl) {
      setTimeout(() => {
        const heroSection = document.getElementById('url-shortener');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [initialUrl]);

  // Fetch user tier when component mounts or user changes
  useEffect(() => {
    if (user) {
      setIsTierLoading(true);
      fetch('/api/user/tier')
        .then(res => res.json())
        .then(data => {
          setUserTier(data.tier);
          setTierFeatures(data.features);
        })
        .catch(() => setUserTier('free'))
        .finally(() => setIsTierLoading(false));
    } else {
      setUserTier('free');
      setIsTierLoading(false);
    }
  }, [user]);

  const isFreeTier = userTier === 'free';
  const isProTier = userTier === 'pro';
  const isPremiumTier = userTier === 'premium';
  const isPaidTier = isProTier || isPremiumTier;

  // Check availability function
  const checkAvailability = async (customShortValue: string) => {
    if (!customShortValue.trim()) {
      setAvailability(null);
      return;
    }

    console.log('Frontend: Checking availability for:', customShortValue.trim());
    setIsCheckingAvailability(true);
    try {
      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customShort: customShortValue.trim() }),
      });

      const data = await response.json();
      console.log('Frontend: Availability result:', data);
      setAvailability({
        available: data.available,
        message: data.message
      });
    } catch (error) {
      console.error('Availability check failed:', error);
      setAvailability({
        available: true,
        message: 'Unable to check availability'
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // QR Code Style Configurations
  const getQRCodeConfig = (style: string, url: string) => {
    const baseConfig = {
      width: 320,
      height: 320,
      type: "canvas" as const,
      data: url,
      qrOptions: {
        errorCorrectionLevel: "M" as const
      }
    };

    switch (style) {
      case 'classic':
        return {
          ...baseConfig,
          dotsOptions: {
            color: "#ea580c",
            type: "square" as const
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          cornersSquareOptions: {
            color: "#ea580c",
            type: "square" as const
          },
          cornersDotOptions: {
            color: "#ea580c",
            type: "square" as const
          }
        };

      case 'rounded':
        return {
          ...baseConfig,
          dotsOptions: {
            color: "#ea580c",
            type: "rounded" as const
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          cornersSquareOptions: {
            color: "#ea580c",
            type: "extra-rounded" as const
          },
          cornersDotOptions: {
            color: "#ffffff",
            type: "dot" as const
          }
        };

      case 'gradient':
        return {
          ...baseConfig,
          dotsOptions: {
            type: "rounded" as const,
            gradient: {
              type: "linear" as const,
              rotation: 45,
              colorStops: [
                { offset: 0, color: "#f97316" },
                { offset: 1, color: "#ea580c" }
              ]
            }
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          cornersSquareOptions: {
            type: "extra-rounded" as const,
            gradient: {
              type: "linear" as const,
              rotation: 0,
              colorStops: [
                { offset: 0, color: "#f97316" },
                { offset: 1, color: "#dc2626" }
              ]
            }
          },
          cornersDotOptions: {
            color: "#ffffff",
            type: "dot" as const
          }
        };

      case 'minimal':
        return {
          ...baseConfig,
          dotsOptions: {
            color: "#000000",
            type: "square" as const
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          cornersSquareOptions: {
            color: "#000000",
            type: "square" as const
          },
          cornersDotOptions: {
            color: "#000000",
            type: "square" as const
          }
        };

      case 'dots':
        return {
          ...baseConfig,
          dotsOptions: {
            color: "#ea580c",
            type: "dots" as const
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          cornersSquareOptions: {
            color: "#ea580c",
            type: "extra-rounded" as const
          },
          cornersDotOptions: {
            color: "#ea580c",
            type: "dot" as const
          }
        };

      default:
        return {
          ...baseConfig,
          dotsOptions: {
            color: "#ea580c",
            type: "square" as const
          },
          backgroundOptions: {
            color: "#ffffff"
          },
          cornersSquareOptions: {
            color: "#ea580c",
            type: "square" as const
          },
          cornersDotOptions: {
            color: "#ea580c",
            type: "square" as const
          }
        };
    }
  };

  // Generate Modern QR Code function
  const generateQRCode = async (url: string) => {
    try {
      const { default: QRCodeStyling } = await import('qr-code-styling');
      const qrCode = new (QRCodeStyling as typeof QRCodeStylingType)(getQRCodeConfig(qrCodeStyle, url));

      // Generate QR code
      const buffer = await qrCode.getRawData("png");
      if (!buffer) {
        return '';
      }

      // Convert to blob
      let blob: Blob;
      if (buffer instanceof Blob) {
        blob = buffer;
      } else {
        const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : await new Response(buffer as any).arrayBuffer();
        blob = new Blob([arrayBuffer], { type: 'image/png' });
      }
      
      // Convert blob to base64 data URL for proper display
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setQrCodeDataUrl(dataUrl);
          resolve(dataUrl);
        };
        reader.onerror = () => {
          resolve('');
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('QR Code generation failed:', error);
      return '';
    }
  };

  // Debounced availability checking
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (customShort.trim()) {
      debounceTimer.current = setTimeout(() => {
        checkAvailability(customShort);
      }, 500); // Check after 500ms of no typing
    } else {
      setAvailability(null);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [customShort]);

  // Handle waitlist events
  useEffect(() => {
    const handleOpenWaitlist = (event: CustomEvent) => {
      setSelectedPlan(event.detail.plan);
      setWaitlistOpen(true);
    };

    window.addEventListener('openWaitlist', handleOpenWaitlist as EventListener);
    return () => window.removeEventListener('openWaitlist', handleOpenWaitlist as EventListener);
  }, []);

  // Handle AI generation when toggle is turned on
  const handleAIGeneration = async (enabled: boolean) => {
    // Show coming soon message for all users
    toast({
      title: "Coming Soon!",
      description: "AI-powered short URL generation will be available soon. Stay tuned!",
      variant: 'info',
      icon: <Brain className="h-5 w-5 text-blue-600" />,
    });
    // Don't enable the toggle
    setAiGenerateShort(false);
  };

  const handleShorten = async () => {
    // Check if user is logged in - required to prevent phishing abuse
    if (!user) {
      setError('');
      toast({
        title: "Sign in to create links",
        description: "Sign in with a paid plan to shorten URLs and track analytics.",
        variant: 'info',
        icon: <Shield className="h-5 w-5 text-orange-600" />,
      });
      return;
    }

    // Block free tier users - paid plan required
    if (isFreeTier && !isTierLoading) {
      setError('');
      toast({
        title: "Paid plan required",
        description: "Upgrade to Pro or Premium to create short links.",
        variant: 'warning',
        icon: <Crown className="h-5 w-5 text-amber-600" />,
      });
      return;
    }

    if (!url) {
      setError('Please enter a URL');
        toast({
          title: "Error",
          description: "Please enter a URL",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      return;
    }

    // Validate URL protocol (block javascript:, data:, etc.)
    if (!validateURLProtocol(url)) {
      setError('Invalid URL. Only http and https URLs are allowed.');
        toast({
          title: "Security Error",
          description: "Only http and https URLs are allowed for security reasons",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
        toast({
          title: "Error",
          description: "Please enter a valid URL",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      return;
    }

    if (isLoading) {
      return;
    }

    // Validate custom short URL format
    if (customShort.trim() && !validateCustomShortURL(customShort.trim())) {
      setError('Invalid custom short URL. Only letters, numbers, hyphens, and underscores are allowed.');
        toast({
          title: "Invalid Custom Short",
          description: "Only letters, numbers, hyphens, and underscores are allowed (1-50 characters)",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      return;
    }

    // Check if custom short is taken before proceeding
    if (customShort.trim() && availability && !availability.available) {
      setError('Custom short is already taken. Please choose a different one.');
        toast({
          title: "Error",
          description: "Custom short is already taken",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      return;
    }

    // Validate password if lock link is enabled
    if (lockLink && isPremiumTier) {
      if (linkPassword.trim().length < 4) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 4 characters long",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
        return;
      }

      if (linkPassword !== confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure both passwords match",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
        return;
      }
    }

    setIsLoading(true);
    setError('');
    setQrCodeDataUrl(''); // Clear previous QR code

    try {
      const requestBody: any = {
        url,
        ...(customShort.trim() && { short: customShort.trim() })
      };

      // Add password if lock link is enabled and password is provided
      if (lockLink && linkPassword.trim() && isPremiumTier) {
        requestBody.password = linkPassword.trim();
      }

      // Get auth token - required for URL creation
      const authResponse = await fetch('/api/auth/token');
      if (!authResponse.ok) {
        throw new Error('Authentication required');
      }
      const authData = await authResponse.json();
      const token = authData.token;
      
      const response = await fetch('/api/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || `Server error: ${response.status}`;
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
        return;
      }

      if (data.error) {
        setError(data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      } else {
        const shortUrl = data.shortUrl || data.CustomShort || data.short;
        setShortUrl(shortUrl);
        setError('');
        
        // Generate QR code if toggle is enabled
        if (includeQRCode) {
          await generateQRCode(shortUrl);
        }
        
        // Clear custom short, password, and availability state after successful creation
        setCustomShort('');
        setLinkPassword('');
        setConfirmPassword('');
        setLockLink(false);
        setAvailability(null);

        const successMessage = customShort
          ? `Custom short created: ${customShort}${lockLink ? ' (password protected)' : ''}`
          : `URL shortened successfully${lockLink ? ' (password protected)' : ''}`;

        toast({
          title: "Success",
          description: successMessage,
          variant: 'success',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        });
      }
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
        toast({
          title: "Network Error",
          description: errorMessage,
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(async () => {
    if (shortUrl && !copied) {
      try {
        await copyToClipboard(shortUrl);
        setCopied(true);
        toast({
          title: "Link copied",
          description: "Short URL copied to clipboard",
          variant: 'success',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      }
    }
  }, [shortUrl, copied, toast]);

  const handleCopyQRCode = useCallback(async () => {
    if (qrCodeDataUrl) {
      try {
        // Convert base64 data URL to blob
        const base64Data = qrCodeDataUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);

        toast({
          title: "QR Code copied",
          description: "QR code image copied to clipboard",
          variant: 'success',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        });
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Failed to copy QR code to clipboard",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      }
    }
  }, [qrCodeDataUrl, toast]);

  // Add Enter key support for better UX
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && url) {
      e.preventDefault();
      handleShorten();
    }
  };

  return (
    <div className="space-y-24 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="text-center space-y-8 py-12 relative"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 blur-xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 blur-xl"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div variants={fadeInUp} className="space-y-6">
          <motion.div
            variants={fadeInUp}
            className="flex justify-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              {t.home.hero.badge}
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight"
            variants={fadeInUp}
          >
            <span className="block gradient-text-primary animate-gradient">
              {t.home.hero.title}
            </span>
            <span className="block mt-2">
              {t.home.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            {t.home.hero.subtitle}
          </motion.p>
        </motion.div>

        {/* URL Shortener Form */}
        <motion.div
          id="url-shortener"
          variants={fadeInUp}
          className="max-w-2xl mx-auto space-y-6"
        >
          <Card className="card-hover border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      type="url"
                      placeholder={t.home.hero.placeholder}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="text-lg h-12"
                      onKeyPress={handleKeyPress}
                    />
                    <Button 
                      onClick={handleShorten}
                      disabled={isLoading}
                      className="btn-primary h-12 px-8"
                    >
                      {isLoading ? t.home.hero.shortening : t.home.hero.shorten}
                    </Button>
                  </div>

                  {/* Custom Short Input with AI Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="relative flex-1"
                        onClick={isFreeTier && !isTierLoading ? () => {
                          toast({
                            title: "Unlock Custom Short Links",
                            description: "Upgrade to Pro to create custom branded short URLs",
                            variant: 'info',
                            icon: <Info className="h-5 w-5 text-orange-600" />,
                          });
                        } : undefined}
                      >
                        <Input
                          type="text"
                          placeholder="Custom short (optional) - e.g., 'my-link'"
                          value={customShort}
                          onChange={(e) => setCustomShort(e.target.value)}
                          className="h-10 flex-1"
                          disabled={isFreeTier}
                        />
                        {isFreeTier && !isTierLoading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-gray-300/80 dark:from-transparent dark:via-gray-700/60 dark:to-gray-800/80 rounded-md cursor-pointer flex items-center justify-end pr-3 gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Get Pro to unlock</span>
                            <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* AI Toggle Inline */}
                      <div
                        className={`relative flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border whitespace-nowrap ${isFreeTier && !isTierLoading ? 'cursor-pointer' : ''}`}
                        onClick={isFreeTier && !isTierLoading ? () => {
                          toast({
                            title: "Unlock AI Features",
                            description: "Upgrade to Pro to use AI-powered short URL generation",
                            variant: 'info',
                            icon: <Info className="h-5 w-5 text-orange-600" />,
                          });
                        } : undefined}
                      >
                        {isFreeTier && !isTierLoading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-gray-300/80 dark:from-transparent dark:via-gray-700/60 dark:to-gray-800/80 rounded-lg pointer-events-none" />
                        )}
                        <Brain className="w-4 h-4 text-primary relative z-10" />
                        <span className="text-sm font-medium relative z-10">AI</span>
                        {isGeneratingAI ? (
                          <div className="flex items-center gap-2 relative z-10">
                            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Generating...</span>
                          </div>
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer z-10">
                            <input
                              type="checkbox"
                              checked={aiGenerateShort}
                              onChange={(e) => handleAIGeneration(e.target.checked)}
                              className="sr-only peer"
                              disabled={isFreeTier || isGeneratingAI}
                            />
                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        )}
                      </div>
                      
                      {isCheckingAvailability && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                          Checking...
                        </div>
                      )}
                    </div>
                    
                    {/* AI Description */}
                    {aiGenerateShort && (
                      <div className="text-xs text-muted-foreground px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Brain className="w-3 h-3 inline mr-1" />
                        AI will create meaningful custom short URLs based on your content
                      </div>
                    )}
                    
                    {/* Availability Status */}
                    {availability && !isCheckingAvailability && (
                      <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                        availability.available 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                      }`}>
                        {availability.available ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>{availability.message}</span>
                        {availability.available && customShort && (
                          <span className="text-xs opacity-75">
                            → orangeurl.live/{customShort}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Lock Link Toggle - Premium Only */}
                  <div
                    className={`relative flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border ${!isPremiumTier && !isTierLoading ? 'cursor-pointer' : ''}`}
                    onClick={!isPremiumTier && !isTierLoading ? () => {
                      toast({
                        title: "Unlock Password Protection",
                        description: "Upgrade to Premium to protect your links with passwords",
                        variant: 'info',
                        icon: <Info className="h-5 w-5 text-orange-600" />,
                      });
                    } : undefined}
                  >
                    {!isPremiumTier && !isTierLoading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-gray-300/80 dark:from-transparent dark:via-gray-700/60 dark:to-gray-800/80 rounded-lg pointer-events-none" />
                    )}
                    <Lock className="w-5 h-5 text-primary relative z-10" />
                    <div className="flex-1 relative z-10">
                      <div className="font-medium text-sm">Password Protection</div>
                      <div className="text-xs text-muted-foreground">Lock your link with a password</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer z-10">
                      <input
                        type="checkbox"
                        checked={lockLink}
                        onChange={(e) => setLockLink(e.target.checked)}
                        className="sr-only peer"
                        disabled={!isPremiumTier}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Password Input */}
                  {lockLink && isPremiumTier && (
                    <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-border">
                      <label className="font-medium text-sm text-foreground flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Set Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter password (min 4 characters)"
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                        className="h-10"
                      />
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Users will need this password to access the link
                      </p>
                    </div>
                  )}

                   {/* QR Code Toggle */}
                   <div
                     className={`relative flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border ${isFreeTier && !isTierLoading ? 'cursor-pointer' : ''}`}
                     onClick={isFreeTier && !isTierLoading ? () => {
                       toast({
                         title: "Unlock QR Code Features",
                         description: "Upgrade to Pro to generate custom QR codes with branding",
                         variant: 'info',
                         icon: <Info className="h-5 w-5 text-orange-600" />,
                       });
                     } : undefined}
                   >
                     {isFreeTier && !isTierLoading && (
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-gray-300/80 dark:from-transparent dark:via-gray-700/60 dark:to-gray-800/80 rounded-lg pointer-events-none" />
                     )}
                     <QrCode className="w-5 h-5 text-primary relative z-10" />
                     <div className="flex-1 relative z-10">
                      <div className="font-medium text-sm">Generate QR Code</div>
                      <div className="text-xs text-muted-foreground">Include a QR code with OrangeURL branding</div>
                    </div>
                     <label className="relative inline-flex items-center cursor-pointer z-10">
                      <input
                        type="checkbox"
                        checked={includeQRCode}
                        onChange={(e) => setIncludeQRCode(e.target.checked)}
                        className="sr-only peer"
                        disabled={isFreeTier}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* QR Code Style Selector */}
                  {includeQRCode && (
                    <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-border">
                      <div className="font-medium text-sm text-foreground">Choose QR Code Style</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                 {[
                           { id: 'classic', name: 'Classic', desc: 'Clean squares' },
                           { id: 'minimal', name: 'Minimal', desc: 'Black & white' },
                           { id: 'dots', name: 'Dotted', desc: 'Circular dots' }
                         ].map((style) => (
                          <label
                            key={style.id}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                              qrCodeStyle === style.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-background'
                            }`}
                          >
                            <input
                              type="radio"
                              name="qrStyle"
                              value={style.id}
                              checked={qrCodeStyle === style.id}
                              onChange={(e) => setQrCodeStyle(e.target.value)}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className="font-medium text-sm">{style.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{style.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                {shortUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
                  >
                    <Input
                      value={shortUrl}
                      readOnly
                      className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-600"
                    />
                    <Button 
                      onClick={handleCopy} 
                      variant={copied ? "default" : "outline"}
                      className={copied ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                      disabled={copied}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </motion.div>
                )}

                {/* QR Code Display */}
                {qrCodeDataUrl && shortUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-lg">QR Code Generated</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan to visit your shortened link
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code for shortened URL"
                        className="w-64 h-auto"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleCopyQRCode}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy QR Code
                      </Button>
                      <Button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `orangeurl-qr-${Date.now()}.png`;
                          link.href = qrCodeDataUrl;
                          link.click();
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download QR Code
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <SignedOut>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                <Link href="/sign-in" className="text-primary font-medium hover:underline cursor-pointer">
                  Login
                </Link> to save your links and view detailed analytics
              </p>
            </div>
          </SignedOut>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-32"
        >
          {[
            { label: t.home.stats.linksCreated, value: `${linksCreated}+`, icon: <LinkIcon className="w-6 h-6" /> },
            { label: t.home.stats.clicksTracked, value: `${activeUsers}+`, icon: <Users className="w-6 h-6" /> },
            { label: t.home.stats.uptime, value: "99.9%", icon: <Clock className="w-6 h-6" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center text-primary mb-2">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold gradient-text-primary">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="space-y-16 py-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">{t.home.features.title} <span className="gradient-text-primary">{t.home.features.titleHighlight}</span></h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.home.features.subtitle}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-4 px-4"
          variants={staggerContainer}
        >
          {[
            {
              title: "Social Media Ready",
              description: "Perfect for Twitter, Instagram, and all social platforms with trackable links",
              icon: <Users className="w-6 h-6" />,
              gradient: "from-orange-500 to-red-500",
              features: ["Social media sharing", "Team collaboration", "Click tracking"]
            },
            {
              title: "Advanced Analytics",
              description: "Track clicks, geographic data, and user behavior with detailed insights",
              icon: <BarChart3 className="w-6 h-6" />,
              gradient: "from-amber-500 to-orange-500",
              features: ["Real-time tracking", "Geographic data", "Click analytics"]
            },
            {
              title: "Lock Links",
              description: "Secure your links with password protection and expiration dates",
              icon: <Lock className="w-6 h-6" />,
              gradient: "from-red-500 to-pink-500",
              features: ["Password protection", "Link expiration", "Access control"]
            },
            {
              title: "Custom QR Codes",
              description: "Generate branded QR codes with custom colors and your logo",
              icon: <QrCode className="w-6 h-6" />,
              gradient: "from-orange-600 to-amber-600",
              features: ["Custom styling", "Brand colors", "Logo integration"]
            }
          ].map((feature, index) => (
            <motion.div 
              key={index} 
              variants={scaleIn}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full card-hover group relative overflow-hidden border-2 hover:border-primary/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <CardContent className="p-4 space-y-3 relative z-10">
                  <motion.div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl transition-shadow`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.features.map((feat, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-background/50 text-xs rounded-full border border-border/20"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
          <h2 className="text-3xl md:text-4xl font-bold">{t.home.cta.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.home.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-primary text-lg px-10 py-6" asChild>
              <a href="/pricing">{t.home.cta.button}</a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6" asChild>
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Waitlist Dialog */}
      <WaitlistDialog
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        planName={selectedPlan}
      />
    </div>
  );
}

// Default export with Suspense boundary for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
      <URLPrefillHandler />
    </Suspense>
  );
}
