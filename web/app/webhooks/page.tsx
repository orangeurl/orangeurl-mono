'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Webhook,
  Plus,
  Trash2,
  Power,
  PowerOff,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Zap,
  MoreVertical,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WebhookType {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const eventOptions = [
  { value: 'url.created', label: 'URL Created', description: 'Triggers when a new short URL is created', tier: 'pro' },
  { value: 'url.clicked', label: 'URL Clicked', description: 'Triggers when a URL is clicked', tier: 'pro' },
  { value: 'url.deleted', label: 'URL Deleted', description: 'Triggers when a URL is deleted', tier: 'premium' },
  { value: 'url.expired', label: 'URL Expired', description: 'Triggers when a URL expires', tier: 'premium' },
];

export default function WebhooksPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null);
  const [webhookSecret, setWebhookSecret] = useState<string | null>(null);

  // Form state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['url.created', 'url.clicked']);
  const [userTier, setUserTier] = useState<string>('free');

  useEffect(() => {
    fetchWebhooks();
    fetchUserTier();
  }, []);

  async function fetchUserTier() {
    try {
      const response = await fetch('/api/user/tier');
      const data = await response.json();
      setUserTier(data.tier?.toLowerCase() || 'free');
    } catch (error) {
      console.error('Failed to fetch user tier:', error);
    }
  }

  async function fetchWebhooks() {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/webhooks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.webhooks || []);
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load webhooks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function createWebhook() {
    if (!webhookUrl || selectedEvents.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a webhook URL and select at least one event',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/webhooks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: selectedEvents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create webhook');
      }

      setWebhookSecret(data.secret);
      setWebhookUrl('');
      setSelectedEvents(['url.created', 'url.clicked']);
      fetchWebhooks();

      toast({
        title: 'Success',
        description: 'Webhook created successfully',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  async function toggleWebhook(id: string, currentStatus: boolean) {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/${id}/toggle`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        fetchWebhooks();
        toast({
          title: 'Success',
          description: `Webhook ${!currentStatus ? 'enabled' : 'disabled'}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle webhook',
        variant: 'destructive',
      });
    }
  }

  async function deleteWebhook(id: string) {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchWebhooks();
        toast({
          title: 'Success',
          description: 'Webhook deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete webhook',
        variant: 'destructive',
      });
    } finally {
      setDeleteWebhookId(null);
    }
  }

  function toggleEvent(event: string) {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  }

  const canAccessEvent = (eventTier: string) => {
    if (eventTier === 'pro') return userTier === 'pro' || userTier === 'premium';
    if (eventTier === 'premium') return userTier === 'premium';
    return true;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Webhook className="w-10 h-10 text-orange-500" />
              <div>
                <h1 className="text-4xl font-bold">Webhooks</h1>
                <p className="text-muted-foreground">Connect OrangeURL to other apps and services</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Webhook
            </Button>
          </div>
        </motion.div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Zapier Integration
                </CardTitle>
                <CardDescription>Connect to 5000+ apps</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use webhooks to trigger Zapier workflows when URLs are created or clicked.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <a href="https://zapier.com/apps/orangeurl" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Zapier
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 12l-7.5 7.5L4.5 12 12 4.5z"/>
                  </svg>
                  Make.com Integration
                </CardTitle>
                <CardDescription>Visual automation platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Build powerful automation scenarios with Make.com's visual workflow builder.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <a href="https://www.make.com/en/integrations/orangeurl" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Make.com
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Webhooks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Webhooks</CardTitle>
              <CardDescription>
                {webhooks.length} / {userTier === 'free' ? 1 : userTier === 'pro' ? 3 : 10} webhooks configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading webhooks...</p>
                </div>
              ) : webhooks.length === 0 ? (
                <div className="text-center py-12">
                  <Webhook className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No webhooks yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first webhook to connect OrangeURL with other apps</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Webhook
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((webhook, index) => (
                    <motion.div
                      key={webhook.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {webhook.is_active ? (
                              <Power className="w-4 h-4 text-green-500" />
                            ) : (
                              <PowerOff className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="font-mono text-sm break-all">{webhook.url}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {webhook.events.map(event => (
                              <span key={event} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                                {event}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Created {new Date(webhook.created_at).toLocaleDateString()}
                            </span>
                            <span className={`flex items-center gap-1 ${webhook.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                              {webhook.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleWebhook(webhook.id, webhook.is_active)}>
                              {webhook.is_active ? (
                                <>
                                  <PowerOff className="w-4 h-4 mr-2" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <Power className="w-4 h-4 mr-2" />
                                  Enable
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteWebhookId(webhook.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Webhook Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1">HMAC Signature Verification</p>
                <p className="text-muted-foreground">
                  All webhook requests include an <code className="bg-muted px-1 py-0.5 rounded">X-OrangeURL-Signature</code> header with an HMAC-SHA256 signature for verification.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Retry Logic</p>
                <p className="text-muted-foreground">
                  Failed webhook deliveries are automatically retried 3 times with exponential backoff (0s, 5s, 30s).
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Delivery Tracking</p>
                <p className="text-muted-foreground">
                  All webhook deliveries are logged with status codes and response data for debugging.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Webhook Dialog */}
        <Dialog open={showCreateDialog || webhookSecret !== null} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setWebhookSecret(null);
          }
        }}>
          <DialogContent className="sm:max-w-[600px]">
            {webhookSecret ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Webhook Created Successfully
                  </DialogTitle>
                  <DialogDescription>
                    Save this webhook secret - you won't be able to see it again!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Webhook Secret</Label>
                    <div className="flex gap-2 mt-2">
                      <Input value={webhookSecret} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(webhookSecret);
                          toast({ title: 'Copied!', description: 'Secret copied to clipboard' });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Use this secret to verify webhook requests using HMAC-SHA256 signature validation.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => { setWebhookSecret(null); setShowCreateDialog(false); }}>
                    I've saved the secret
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create New Webhook</DialogTitle>
                  <DialogDescription>
                    Connect OrangeURL to external services via webhooks
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL *</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-app.com/webhooks/orangeurl"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The endpoint where webhook events will be sent
                    </p>
                  </div>
                  <div>
                    <Label>Events *</Label>
                    <div className="space-y-2 mt-2">
                      {eventOptions.map(event => {
                        const canAccess = canAccessEvent(event.tier);
                        return (
                          <div
                            key={event.value}
                            className={`flex items-start gap-3 p-3 border rounded-lg ${
                              canAccess ? 'cursor-pointer hover:bg-muted/50' : 'opacity-50 cursor-not-allowed'
                            } ${selectedEvents.includes(event.value) && canAccess ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' : ''}`}
                            onClick={() => canAccess && toggleEvent(event.value)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.value)}
                              onChange={() => {}}
                              disabled={!canAccess}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{event.label}</p>
                                {!canAccess && (
                                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                                    {event.tier.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createWebhook} className="bg-orange-500 hover:bg-orange-600">
                    Create Webhook
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteWebhookId !== null} onOpenChange={() => setDeleteWebhookId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this webhook? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteWebhookId && deleteWebhook(deleteWebhookId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
