'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle, ExternalLink, Calendar, Globe, Smartphone, Monitor, Filter, Bot } from 'lucide-react';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface URLAnalytics {
  url: {
    short_id: string;
    original_url: string;
    created_at: string;
    is_active: boolean;
  };
  total_clicks: number;
  clicks_by_date: Array<{ date: string; clicks: number }>;
  browser_stats: Array<{ browser: string; clicks: number }>;
  device_stats: Array<{ device_type: string; clicks: number }>;
  referrer_stats: Array<{ source: string; clicks: number }>;
  referrer_clicks_by_date: Array<{ date: string; [source: string]: number | string }>;
  recent_clicks: Array<{
    clicked_at: string;
    device_type: string;
    browser: string;
    os: string;
    country: string;
    city: string;
    referer: string;
    bot: boolean;
  }>;
}

export default function URLAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortId = params.shortId as string;
  
  const [analytics, setAnalytics] = useState<URLAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [botFilter, setBotFilter] = useState<string>('all');
  const [browserFilter, setBrowserFilter] = useState<string>('all');

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
    fetchAnalytics();
  }, [shortId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/dashboard/urls/${shortId}/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="border-2 border-red-200 dark:border-red-800 max-w-2xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Error Loading Analytics</h3>
              <p className="text-sm">{error}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={fetchAnalytics} variant="outline" size="sm">
                  Retry
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* URL Info Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold gradient-text-primary">
                orangeurl.live/{analytics.url.short_id}
              </h1>
              {!analytics.url.is_active && (
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">
                  Inactive
                </span>
              )}
            </div>
            <a
              href={analytics.url.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">{analytics.url.original_url}</span>
            </a>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Created {analytics.url.created_at && !isNaN(new Date(analytics.url.created_at).getTime())
                  ? new Date(analytics.url.created_at).toLocaleDateString()
                  : 'Unknown'}
              </span>
              <span className="font-semibold text-primary">
                {analytics.total_clicks} Total Clicks
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Charts */}
      <AnalyticsCharts
        clicksByDate={analytics.clicks_by_date || []}
        deviceStats={analytics.device_stats || []}
        browserStats={analytics.browser_stats || []}
        referrerStats={analytics.referrer_stats || []}
        referrerClicksByDate={analytics.referrer_clicks_by_date || []}
      />

      {/* Recent Clicks Table */}
      {analytics.recent_clicks && analytics.recent_clicks.length > 0 && (() => {
        // Get unique values for filters
        const uniqueDevices = Array.from(new Set(analytics.recent_clicks.map(c => c.device_type).filter(Boolean)));
        const uniqueBrowsers = Array.from(new Set(analytics.recent_clicks.map(c => c.browser).filter(Boolean)));

        // Apply filters
        const filteredClicks = analytics.recent_clicks.filter(click => {
          const deviceMatch = deviceFilter === 'all' || click.device_type === deviceFilter;
          const botMatch = botFilter === 'all' ||
            (botFilter === 'bot' && click.bot) ||
            (botFilter === 'human' && !click.bot);
          const browserMatch = browserFilter === 'all' || click.browser === browserFilter;

          return deviceMatch && botMatch && browserMatch;
        });

        return (
          <Card className="border-2 border-border/50 bg-gradient-to-br from-card to-secondary/5 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold gradient-text-primary">Recent Clicks</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredClicks.length} of {analytics.recent_clicks.length} clicks
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Smartphone className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      {uniqueDevices.map(device => (
                        <SelectItem key={device} value={device} className="capitalize">
                          {device}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={browserFilter} onValueChange={setBrowserFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Monitor className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Browser" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Browsers</SelectItem>
                      {uniqueBrowsers.map(browser => (
                        <SelectItem key={browser} value={browser}>
                          {browser}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={botFilter} onValueChange={setBotFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Bot className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="human">Human Only</SelectItem>
                      <SelectItem value="bot">Bots Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`overflow-x-auto ${filteredClicks.length > 10 ? 'max-h-[600px] overflow-y-auto' : ''}`}>
                <table className="w-full text-sm">
                  <thead className="border-b sticky top-0 bg-card z-10">
                    <tr className="text-left">
                      <th className="pb-2 pr-4 font-semibold">Date</th>
                      <th className="pb-2 pr-4 font-semibold">Device</th>
                      <th className="pb-2 pr-4 font-semibold">Browser</th>
                      <th className="pb-2 pr-4 font-semibold">OS</th>
                      <th className="pb-2 pr-4 font-semibold">Country</th>
                      <th className="pb-2 pr-4 font-semibold">City</th>
                      <th className="pb-2 pr-4 font-semibold">Referrer</th>
                      <th className="pb-2 font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClicks.map((click, index) => {
                      const dateStr = click.clicked_at ? new Date(click.clicked_at).toLocaleString() : '-';
                      const countryFlag = click.country ? getCountryFlag(click.country) : '';
                      const countryDisplay = click.country ? `${countryFlag} ${click.country}` : '-';

                      // Display exact referrer or "Direct" if not available
                      const referrerDisplay = (click.referer && click.referer !== '-' && click.referer !== '') 
                        ? click.referer 
                        : 'Direct';

                      return (
                        <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 pr-4 whitespace-nowrap">{dateStr}</td>
                          <td className="py-3 pr-4 capitalize">{click.device_type || '-'}</td>
                          <td className="py-3 pr-4">{click.browser || '-'}</td>
                          <td className="py-3 pr-4">{click.os || '-'}</td>
                          <td className="py-3 pr-4 whitespace-nowrap">{countryDisplay}</td>
                          <td className="py-3 pr-4">{click.city || '-'}</td>
                          <td className="py-3 pr-4 max-w-[200px] truncate" title={referrerDisplay}>
                            {referrerDisplay}
                          </td>
                          <td className="py-3">
                            {click.bot ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                <Bot className="w-3 h-3 mr-1" />
                                Bot
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                Human
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredClicks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No clicks match the selected filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}


