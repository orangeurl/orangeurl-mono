'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { CreateAPIKeyDialog } from '@/components/dashboard/CreateAPIKeyDialog';
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

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  permissions: string[];
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export default function APIKeysPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{
    fullKey: string;
    name: string;
  } | null>(null);
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'premium' | null>(null);

  useEffect(() => {
    checkUserTier();
    fetchAPIKeys();
  }, []);

  async function checkUserTier() {
    try {
      const response = await fetch('/api/user/tier');
      const data = await response.json();
      setUserTier(data.tier || 'free');
    } catch (error) {
      console.error('Error fetching user tier:', error);
      setUserTier('free');
    }
  }

  async function fetchAPIKeys() {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/api-keys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch API keys');

      const data = await response.json();
      setApiKeys(data.api_keys || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAPIKey(name: string, permissions: string[], expiresIn?: number) {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/api-keys`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          permissions,
          expires_in: expiresIn,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create API key');
      }

      const data = await response.json();

      // Show the full key only once
      setNewlyCreatedKey({
        fullKey: data.api_key,
        name: data.name,
      });

      // Refresh the list
      await fetchAPIKeys();

      toast({
        title: 'Success',
        description: 'API key created successfully',
      });

      setShowCreateDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create API key',
        variant: 'destructive',
      });
    }
  }

  async function handleDeleteAPIKey(keyId: string) {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete API key');

      await fetchAPIKeys();

      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      });

      setDeleteKeyId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Check if user has access to API keys
  const hasAccess = userTier === 'pro' || userTier === 'premium';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Key className="w-10 h-10 text-orange-500" />
                API Keys
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your API keys for programmatic access to OrangeURL
              </p>
            </div>
            {hasAccess && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            )}
          </div>
        </motion.div>

        {/* Tier Restriction Notice */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      Upgrade to Access API Keys
                    </h3>
                    <p className="mb-4">
                      API Keys are available for Pro and Premium subscribers. Upgrade your plan to unlock programmatic access to OrangeURL's powerful features.
                    </p>
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <a href="/pricing">
                        View Plans
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Documentation Banner */}
        {hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">API Documentation</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Use API keys to authenticate requests to the OrangeURL API. View our interactive documentation to get started.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href="/docs">
                          View Documentation
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/docs`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        API Reference
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Newly Created Key Alert */}
        {hasAccess && newlyCreatedKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      API Key Created: {newlyCreatedKey.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      ⚠️ Copy this key now! For security reasons, it won't be shown again.
                    </p>
                    <div className="bg-muted p-4 rounded-lg border mb-4">
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-sm font-mono break-all">
                          {newlyCreatedKey.fullKey}
                        </code>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(newlyCreatedKey.fullKey)}
                          className="bg-green-500 hover:bg-green-600 flex-shrink-0"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewlyCreatedKey(null)}
                    >
                      I've saved my key
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* API Keys List */}
        {hasAccess && (loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : apiKeys.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Key className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No API Keys</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first API key to start using the OrangeURL API
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First API Key
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key, index) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Key className="w-5 h-5 text-orange-500" />
                          <h3 className="text-lg font-semibold">{key.name}</h3>
                          {key.is_active ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="bg-muted p-3 rounded-lg mb-4">
                          <code className="text-sm font-mono text-muted-foreground">
                            {key.prefix}••••••••••••••••
                          </code>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {formatDate(key.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Last used: {formatDate(key.last_used_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                              Expires: {key.expires_at ? formatDate(key.expires_at) : 'Never'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {key.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 rounded"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteKeyId(key.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Create API Key Dialog */}
      <CreateAPIKeyDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onConfirm={handleCreateAPIKey}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteKeyId !== null} onOpenChange={(open) => !open && setDeleteKeyId(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <AlertDialogTitle className="text-lg">Delete API Key?</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="pt-4 text-base">
              Are you sure you want to delete this API key? This action cannot be undone and any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteKeyId && handleDeleteAPIKey(deleteKeyId)}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
