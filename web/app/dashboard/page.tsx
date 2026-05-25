'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { QRCodeDialog } from '@/components/dashboard/QRCodeDialog';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { LockLinkDialog } from '@/components/dashboard/LockLinkDialog';
import QRCodeStyling from 'qr-code-styling';
import {
  Link as LinkIcon,
  BarChart3,
  Eye,
  Calendar,
  Globe,
  Copy,
  Trash2,
  Plus,
  TrendingUp,
  Users,
  Clock,
  Lock,
  Loader2,
  AlertCircle,
  QrCode,
  Download,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { DashboardStats } from '@/lib/api-client';

// QR Code Style Configurations
const getQRCodeConfig = (style: string, url: string, size: number = 300) => {
  const baseConfig = {
    width: size,
    height: size,
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

type URLWithStats = {
  id: string;
  short_id: string;
  original_url: string;
  clicks: number;
  created_at: string;
  is_active: boolean;
  is_locked?: boolean;
  team_id?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [personalURLs, setPersonalURLs] = useState<URLWithStats[]>([]);
  const [teamURLs, setTeamURLs] = useState<URLWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrDialogData, setQrDialogData] = useState<{ url: string; shortId: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState<{ urlId: string; shortId: string } | null>(null);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [lockDialogData, setLockDialogData] = useState<{ urlId: string; shortId: string; isLocked: boolean } | null>(null);
  const [isTeamOwner, setIsTeamOwner] = useState(false);
  const { toast } = useToast();
  const { isSignedIn, getToken } = useAuth();

  // Country code to flag emoji mapping
  const getCountryFlag = (countryCode: string): string => {
    if (!countryCode || countryCode === '-') return '';

    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char: string) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats');
      if (!statsResponse.ok) {
        if (statsResponse.status === 401) {
          setStats(null);
          return;
        }
        throw new Error('Failed to fetch dashboard stats');
      }
      const statsData = await statsResponse.json();

      // Fetch subscription info for billing details
      try {
        const subscriptionResponse = await fetch('/api/subscription/info');
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          // Merge subscription info into stats
          // Backend returns current_period_end, map to next_billing_date
          statsData.next_billing_date = subscriptionData.current_period_end;
          statsData.billing_interval = subscriptionData.billing_interval;
          statsData.subscription_status = subscriptionData.status;
          // Backend returns url_usage_reset_at, map to url_reset_date
          statsData.url_reset_date = subscriptionData.url_usage_reset_at;
        }
      } catch (subErr) {
        console.log('Could not fetch subscription info:', subErr);
      }

      setStats(statsData);

      // Fetch personal URLs
      const personalResponse = await fetch('/api/dashboard/urls/personal');
      if (personalResponse.ok) {
        const personalData = await personalResponse.json();
        setPersonalURLs(personalData.urls || []);
      }

      // Fetch team URLs
      const teamResponse = await fetch('/api/dashboard/urls/team');
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamURLs(teamData.urls || []);
      }

      // Check if user is team owner
      const teamInfoResponse = await fetch('/api/teams/my-team');
      if (teamInfoResponse.ok) {
        const teamInfo = await teamInfoResponse.json();
        setIsTeamOwner(teamInfo.team?.is_owner || false);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Short URL copied to clipboard",
      variant: 'success',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    });
  };

  const handleDeleteURL = (urlId: string, shortId: string) => {
    setDeleteDialogData({ urlId, shortId });
    setDeleteDialogOpen(true);
  };

  const handleLockLink = (urlId: string, shortId: string, isLocked: boolean) => {
    setLockDialogData({ urlId, shortId, isLocked });
    setLockDialogOpen(true);
  };

  const handleShareWithTeam = async (urlId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/urls/${urlId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to share URL with team');
      }

      toast({
        title: "Shared with Team",
        description: "URL has been shared with your team successfully",
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to share URL",
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };

  const handleUnshareFromTeam = async (urlId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/urls/${urlId}/unassign`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unshare URL from team');
      }

      toast({
        title: "Removed from Team",
        description: "URL has been removed from team successfully",
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unshare URL",
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialogData) return;

    try {
      const response = await fetch(`/api/urls/${deleteDialogData.urlId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      toast({
        title: "Deleted",
        description: "URL has been deleted successfully",
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      // Close dialog and refresh dashboard data
      setDeleteDialogOpen(false);
      setDeleteDialogData(null);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete URL",
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };

  const handleDownloadQR = async (url: string, shortId: string) => {
    setQrDialogData({ url: `https://orangeurl.live/${shortId}`, shortId });
    setQrDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown';
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderURLCard = (link: URLWithStats, showTeamActions: boolean = false) => (
    <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <LinkIcon className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="font-medium text-primary truncate">
            orangeurl.live/{link.short_id}
          </p>
          {!link.is_active && (
            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
              Inactive
            </span>
          )}
          {link.is_locked && (
            <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{link.original_url}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {link.clicks} clicks
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(link.created_at)}
          </span>
          {link.clicks > 0 && (
            <button
              onClick={() => router.push(`/dashboard/analytics/${link.short_id}`)}
              className="flex items-center text-primary hover:underline"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              View Details
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(`https://orangeurl.live/${link.short_id}`)}
          title="Copy link"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const isPaidTier = stats?.plan_name?.toLowerCase() === 'pro' || stats?.plan_name?.toLowerCase() === 'premium';
            if (!isPaidTier) {
              toast({
                title: "Unlock QR Code Features",
                description: "Upgrade to Pro or Premium to generate custom QR codes",
                variant: 'info',
                icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
              });
              return;
            }
            handleDownloadQR(link.original_url, link.short_id);
          }}
          title="Download QR code"
          className={!(stats?.plan_name?.toLowerCase() === 'pro' || stats?.plan_name?.toLowerCase() === 'premium') ? 'opacity-60' : ''}
        >
          <QrCode className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleLockLink(link.id, link.short_id, link.is_locked || false)}
          title={link.is_locked ? "Manage lock" : "Lock link"}
          className={link.is_locked ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30" : ""}
        >
          <Lock className="w-4 h-4" />
        </Button>
        {showTeamActions && isTeamOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUnshareFromTeam(link.id)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            title="Remove from team"
          >
            <Users className="w-4 h-4" />
          </Button>
        )}
        {!showTeamActions && isTeamOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShareWithTeam(link.id)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
            title="Share with team"
          >
            <Users className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteURL(link.id, link.short_id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          title="Delete link"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 py-8">
      <SignedOut>
        {/* Header */}
        <motion.section
          className="text-center space-y-4"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold">
              Your <span className="gradient-text-primary">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Login to save your short links and view detailed analytics
            </p>
          </motion.div>
        </motion.section>

        {/* Login Prompt */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="card-hover border-2 border-primary/20 bg-gradient-to-br from-orange-50/50 via-card to-secondary/10 dark:from-orange-950/20 dark:via-card dark:to-secondary/5 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-bold gradient-text-primary">Login Required</h2>
              <p className="text-muted-foreground leading-relaxed">
                Please login to access your dashboard and manage your short links with advanced analytics
              </p>

              <div className="space-y-4">
                <Link href="/sign-in">
                  <Button className="btn-primary px-8 py-3 text-lg w-full sm:w-auto">
                    Login to Dashboard
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?
                  <Link href="/sign-up" className="text-primary font-medium cursor-pointer hover:underline ml-1 transition-colors">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Features Preview */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Save Links",
              description: "Save your shortened URLs for easy access",
              icon: <LinkIcon className="w-8 h-8" />,
              color: "from-orange-500 to-red-500"
            },
            {
              title: "View Analytics",
              description: "Track clicks, locations, and user behavior",
              icon: <BarChart3 className="w-8 h-8" />,
              color: "from-green-500 to-emerald-500"
            },
            {
              title: "Manage Links",
              description: "Edit, delete, and organize your links",
              icon: <Globe className="w-8 h-8" />,
              color: "from-blue-500 to-cyan-500"
            }
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-hover border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 gradient-text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      </SignedOut>

      <SignedIn>
        {/* Header */}
        <motion.section
          className="text-center space-y-4"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold">
              Your <span className="gradient-text-primary">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your short links, track analytics, and grow your online presence
            </p>
          </motion.div>
        </motion.section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Error Loading Dashboard</h3>
                  <p className="text-sm">{error}</p>
                  <Button
                    onClick={fetchDashboardData}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Content */}
        {stats && !loading && (
          <>
            {/* Plan Info Badge with Billing Info */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center gap-2"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">{stats.plan_name} Plan</span>
                <span className="text-sm text-muted-foreground">
                  {stats.urls_remaining} / {stats.url_limit} links remaining
                </span>
              </div>

              {/* Next Billing Date - Only for paid plans */}
              {stats.plan_name.toLowerCase() !== 'free' && stats.next_billing_date && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-muted/50 border border-muted-foreground/20 rounded-full text-sm">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {stats.subscription_status === 'cancelled' ? (
                      <>Access until {new Date(stats.next_billing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                    ) : (
                      <>Renews {new Date(stats.next_billing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                    )}
                  </span>
                  {stats.billing_interval && (
                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                      {stats.billing_interval === 'annual' ? 'Annual' : 'Monthly'}
                    </span>
                  )}
                </div>
              )}

              {/* URL Reset Notice */}
              {stats.url_reset_date && stats.urls_remaining < stats.url_limit * 0.2 && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-sm">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-700 dark:text-amber-400">
                    URL limit resets {new Date(stats.url_reset_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Stats Grid */}
            <motion.section
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  title: "Total Links",
                  value: stats.total_urls.toString(),
                  change: `${stats.urls_remaining} remaining`,
                  icon: <LinkIcon className="w-6 h-6" />,
                  color: "from-orange-500 to-red-500"
                },
                {
                  title: "Total Clicks",
                  value: stats.total_clicks.toLocaleString(),
                  change: `${stats.clicks_this_month} this month`,
                  icon: <Eye className="w-6 h-6" />,
                  color: "from-green-500 to-emerald-500"
                },
                {
                  title: "This Month",
                  value: stats.urls_this_month.toString(),
                  change: "URLs created",
                  icon: <Calendar className="w-6 h-6" />,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Countries",
                  value: stats.top_countries.length.toString(),
                  change: "Total locations",
                  icon: <Globe className="w-6 h-6" />,
                  color: "from-purple-500 to-pink-500"
                }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="card-hover border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/5 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold gradient-text-primary">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.section>

            {/* Tools Section - Compact grid for all users */}
            <motion.section
              className="space-y-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Tools</h2>
                <p className="text-muted-foreground">Powerful features to enhance your links</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* UTM Builder - All users */}
                <motion.div variants={fadeInUp}>
                  <Link href="/utm-builder">
                    <Card className="card-hover border border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/5 hover:shadow-lg transition-all cursor-pointer group h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base gradient-text-primary">UTM Builder</h3>
                            <p className="text-xs text-muted-foreground truncate">Create trackable campaign URLs</p>
                          </div>
                          <div className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                            →
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>

                {/* API Keys - Pro & Premium */}
                {(stats.plan_name.toLowerCase() === 'pro' || stats.plan_name.toLowerCase() === 'premium') && (
                  <motion.div variants={fadeInUp}>
                    <Link href="/api-keys">
                      <Card className="card-hover border border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/5 hover:shadow-lg transition-all cursor-pointer group h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                              <LinkIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base gradient-text-primary">API Keys</h3>
                              <p className="text-xs text-muted-foreground truncate">Manage your API access</p>
                            </div>
                            <div className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                              →
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )}

                {/* Team - Premium Only */}
                {stats.plan_name.toLowerCase() === 'premium' && (
                  <motion.div variants={fadeInUp}>
                    <Link href="/team">
                      <Card className="card-hover border border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/5 hover:shadow-lg transition-all cursor-pointer group h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                              <Users className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base gradient-text-primary">Team</h3>
                              <p className="text-xs text-muted-foreground truncate">Collaborate with your team</p>
                            </div>
                            <div className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                              →
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* My Links Section */}
            <motion.section
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="border-2 border-border/50 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold gradient-text-primary">My Links</h2>
                    <Button className="btn-primary" size="sm" onClick={() => router.push('/')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {personalURLs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No personal links yet. Create your first short link!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 scrollbar-track-transparent">
                      {personalURLs.map((link) => renderURLCard(link, false))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.section>

            {/* Team Links Section - Only show if user has team URLs */}
            {teamURLs.length > 0 && (
              <motion.section
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="border-2 border-border/50 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <h2 className="text-xl font-bold gradient-text-primary">Team Links</h2>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {teamURLs.length} shared {teamURLs.length === 1 ? 'link' : 'links'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300/40 hover:scrollbar-thumb-purple-500/60 scrollbar-track-transparent">
                      {teamURLs.map((link) => renderURLCard(link, true))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {/* Analytics Grid */}
            <motion.section
              className="grid grid-cols-1 lg:grid-cols-1 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Analytics Overview */}
              <motion.div variants={fadeInUp}>
                <Card className="border-2 border-border/50 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
                  <CardHeader>
                    <h2 className="text-xl font-bold gradient-text-primary">Analytics Overview</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Device Stats */}
                      {stats.device_stats.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-3">Device Distribution</h3>
                          <div className="space-y-2">
                            {stats.device_stats.map((device, index) => {
                              const total = stats.device_stats.reduce((sum, d) => sum + d.clicks, 0);
                              const percentage = total > 0 ? Math.round((device.clicks / total) * 100) : 0;
                              return (
                                <div key={index}>
                                  <div className="flex items-center justify-between mb-1 text-sm">
                                    <span className="capitalize">{device.device_type}</span>
                                    <span className="text-muted-foreground">{percentage}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                      style={{width: `${percentage}%`}}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Top Locations */}
                      {stats.top_countries.length > 0 && (
                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-3">Top Locations</h3>
                          <div className="space-y-2">
                            {stats.top_countries.slice(0, 5).map((location, index) => {
                              const countryFlag = location.country ? getCountryFlag(location.country) : '';
                              const countryDisplay = location.country ? `${countryFlag} ${location.country}` : 'Unknown';
                              return (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span>{countryDisplay}</span>
                                  <span className="text-muted-foreground">{location.clicks} clicks</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {stats.top_countries.length === 0 && stats.device_stats.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No analytics data yet. Share your links to get started!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.section>

            {/* Analytics Charts */}
            {(stats.clicks_by_date?.length > 0 || stats.device_stats?.length > 0 || stats.browser_stats?.length > 0) && (
              <motion.section variants={fadeInUp}>
                <AnalyticsCharts
                  clicksByDate={stats.clicks_by_date || []}
                  deviceStats={stats.device_stats || []}
                  browserStats={stats.browser_stats || []}
                  countryStats={stats.top_countries || []}
                />
              </motion.section>
            )}

            {/* Features Info */}
            {stats.features && (
              <motion.section variants={fadeInUp}>
                <Card className="border-2 border-border/50 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
                  <CardHeader>
                    <h2 className="text-xl font-bold gradient-text-primary">Your Plan Features</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: "Custom Links", value: stats.features.custom_links || 0 },
                        { label: "Custom QR Codes", value: stats.features.custom_qr_codes || 0 },
                        { label: "Data Retention", value: stats.features.data_retention_days === -1 ? "Unlimited" : `${stats.features.data_retention_days} days` },
                      ].map((feature, index) => (
                        <div key={index} className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">{feature.label}</p>
                          <p className="text-lg font-bold gradient-text-primary">{feature.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}
          </>
        )}
      </SignedIn>

      {/* QR Code Dialog */}
      {qrDialogData && (
        <QRCodeDialog
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
          url={qrDialogData.url}
          shortId={qrDialogData.shortId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogData && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          shortId={deleteDialogData.shortId}
        />
      )}

      {/* Lock Link Dialog */}
      {lockDialogData && (
        <LockLinkDialog
          open={lockDialogOpen}
          onOpenChange={setLockDialogOpen}
          urlId={lockDialogData.urlId}
          shortId={lockDialogData.shortId}
          isLocked={lockDialogData.isLocked}
          onSuccess={() => fetchDashboardData()}
          isPremium={stats?.plan_name?.toLowerCase() === 'premium' || stats?.features?.link_locking === true}
        />
      )}
    </div>
  );
}
