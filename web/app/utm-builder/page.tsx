'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Link as LinkIcon,
  Copy,
  Tag,
  Sparkles,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CampaignTemplate {
  name: string;
  description: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

const campaignTemplates: CampaignTemplate[] = [
  {
    name: 'Email Newsletter',
    description: 'Track clicks from email newsletters',
    source: 'newsletter',
    medium: 'email',
    campaign: 'weekly_newsletter',
  },
  {
    name: 'Social Media - Facebook',
    description: 'Facebook posts and ads',
    source: 'facebook',
    medium: 'social',
    campaign: 'facebook_campaign',
  },
  {
    name: 'Social Media - Twitter',
    description: 'Twitter/X posts and promotions',
    source: 'twitter',
    medium: 'social',
    campaign: 'twitter_campaign',
  },
  {
    name: 'Google Ads',
    description: 'Google advertising campaigns',
    source: 'google',
    medium: 'cpc',
    campaign: 'google_ads',
    term: 'keyword',
  },
  {
    name: 'LinkedIn Sponsored',
    description: 'LinkedIn sponsored content',
    source: 'linkedin',
    medium: 'cpc',
    campaign: 'linkedin_sponsored',
  },
  {
    name: 'Affiliate Program',
    description: 'Affiliate marketing links',
    source: 'affiliate',
    medium: 'referral',
    campaign: 'affiliate_program',
    content: 'partner_name',
  },
  {
    name: 'Blog Post',
    description: 'Links in blog articles',
    source: 'blog',
    medium: 'content',
    campaign: 'blog_promotion',
  },
];

export default function UTMBuilderPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');

  // Generated URL
  const [generatedUrl, setGeneratedUrl] = useState('');

  // Build the URL with UTM parameters
  useEffect(() => {
    if (!websiteUrl) {
      setGeneratedUrl('');
      return;
    }

    try {
      const url = new URL(websiteUrl);
      const params = new URLSearchParams(url.search);

      if (utmSource) params.set('utm_source', utmSource);
      if (utmMedium) params.set('utm_medium', utmMedium);
      if (utmCampaign) params.set('utm_campaign', utmCampaign);
      if (utmTerm) params.set('utm_term', utmTerm);
      if (utmContent) params.set('utm_content', utmContent);

      url.search = params.toString();
      setGeneratedUrl(url.toString());
    } catch (error) {
      // Invalid URL, don't update
      setGeneratedUrl('');
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  function applyTemplate(template: CampaignTemplate) {
    setUtmSource(template.source);
    setUtmMedium(template.medium);
    setUtmCampaign(template.campaign);
    setUtmTerm(template.term || '');
    setUtmContent(template.content || '');

    toast({
      title: 'Template Applied',
      description: `"${template.name}" template has been applied`,
    });
  }

  function resetForm() {
    setWebsiteUrl('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setGeneratedUrl('');
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'URL copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  }

  function handleCreateShortLink() {
    if (!generatedUrl) {
      toast({
        title: 'Error',
        description: 'Please generate a URL first',
        variant: 'destructive',
      });
      return;
    }

    // Redirect to homepage with URL pre-filled
    router.push(`/?url=${encodeURIComponent(generatedUrl)}`);
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold">UTM Builder</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create trackable campaign URLs with UTM parameters. Perfect for measuring
            marketing campaign performance across different channels.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Website URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-orange-500" />
                    Website URL
                  </CardTitle>
                  <CardDescription>
                    Enter the URL you want to add tracking parameters to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="website-url">Destination URL *</Label>
                    <Input
                      id="website-url"
                      type="url"
                      placeholder="https://example.com/landing-page"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground">
                      The full website URL (including https://)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* UTM Parameters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Campaign Parameters
                  </CardTitle>
                  <CardDescription>
                    Add UTM parameters to track your campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* UTM Source */}
                  <div className="space-y-2">
                    <Label htmlFor="utm-source">Campaign Source *</Label>
                    <Input
                      id="utm-source"
                      placeholder="google, newsletter, facebook"
                      value={utmSource}
                      onChange={(e) => setUtmSource(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The referrer (e.g., google, newsletter, billboard)
                    </p>
                  </div>

                  {/* UTM Medium */}
                  <div className="space-y-2">
                    <Label htmlFor="utm-medium">Campaign Medium *</Label>
                    <Input
                      id="utm-medium"
                      placeholder="cpc, email, social"
                      value={utmMedium}
                      onChange={(e) => setUtmMedium(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Marketing medium (e.g., cpc, email, social)
                    </p>
                  </div>

                  {/* UTM Campaign */}
                  <div className="space-y-2">
                    <Label htmlFor="utm-campaign">Campaign Name *</Label>
                    <Input
                      id="utm-campaign"
                      placeholder="spring_sale, product_launch"
                      value={utmCampaign}
                      onChange={(e) => setUtmCampaign(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Campaign identifier (e.g., spring_sale, product_launch)
                    </p>
                  </div>

                  {/* UTM Term (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="utm-term">Campaign Term (Optional)</Label>
                    <Input
                      id="utm-term"
                      placeholder="running+shoes, blue+widgets"
                      value={utmTerm}
                      onChange={(e) => setUtmTerm(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paid search keywords
                    </p>
                  </div>

                  {/* UTM Content (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="utm-content">Campaign Content (Optional)</Label>
                    <Input
                      id="utm-content"
                      placeholder="logo_link, text_link, hero_button"
                      value={utmContent}
                      onChange={(e) => setUtmContent(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Differentiate similar content or links (e.g., A/B testing)
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Form
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generated URL */}
            {generatedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Generated Campaign URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full URL with UTM Parameters</Label>
                      <Textarea
                        value={generatedUrl}
                        readOnly
                        rows={4}
                        className="font-mono text-sm bg-white dark:bg-gray-900"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(generatedUrl)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </Button>
                        <Button
                          onClick={() => window.open(generatedUrl, '_blank')}
                          variant="outline"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={handleCreateShortLink}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-base py-6"
                        size="lg"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Shorten with Custom Options
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Continue to add custom short ID, password protection, QR code, and more
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Templates Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Templates</CardTitle>
                  <CardDescription>
                    Quick start with pre-configured templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {campaignTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => applyTemplate(template)}
                    >
                      <div>
                        <p className="font-semibold text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    UTM Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Be Consistent</p>
                    <p>Use lowercase and underscores for consistency across campaigns</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Be Specific</p>
                    <p>Use descriptive names that clearly identify the campaign</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Required Fields</p>
                    <p>Source, Medium, and Campaign are required for tracking</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Track Everything</p>
                    <p>Use UTM parameters for all marketing channels to measure ROI</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
