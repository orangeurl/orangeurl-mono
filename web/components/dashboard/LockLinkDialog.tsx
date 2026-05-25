'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Unlock, Eye, EyeOff, Shield, CheckCircle2, XCircle, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/nextjs';
import { PasswordAPI } from '@/lib/api-client';

interface LockLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  urlId: string;
  shortId: string;
  isLocked: boolean;
  onSuccess?: () => void;
  isPremium: boolean;
}

export function LockLinkDialog({
  open,
  onOpenChange,
  urlId,
  shortId,
  isLocked,
  onSuccess,
  isPremium,
}: LockLinkDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleSetPassword = async () => {
    if (!isPremium) {
      toast({
        title: 'Premium Feature',
        description: 'Link locking is only available for Premium users. Upgrade to unlock this feature!',
        variant: 'error',
        icon: <Crown className="h-5 w-5 text-yellow-600" />,
      });
      return;
    }

    if (password.length < 4) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 4 characters long',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords Don\'t Match',
        description: 'Please make sure both passwords match',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      await PasswordAPI.setPassword(urlId, password, token);

      toast({
        title: 'Link Locked',
        description: 'Your link is now password protected',
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      setPassword('');
      setConfirmPassword('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Failed to Lock Link',
        description: error.message || 'An error occurred',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePassword = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      await PasswordAPI.removePassword(urlId, token);

      toast({
        title: 'Link Unlocked',
        description: 'Password protection has been removed',
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Failed to Unlock Link',
        description: error.message || 'An error occurred',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLocked ? (
              <>
                <Lock className="w-5 h-5 text-primary" />
                Manage Link Protection
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 text-primary" />
                Lock Your Link
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLocked
              ? 'This link is currently password protected. You can update or remove the password.'
              : 'Add password protection to secure your link. Only users with the password can access it.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isPremium && (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-2 border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                    Premium Feature
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Link locking is available exclusively for Premium subscribers. Upgrade to protect your links with passwords!
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLocked ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">This link is currently locked</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Short ID: <code className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">{shortId}</code>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Update Password</h4>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!isPremium}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={!isPremium}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isPremium}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSetPassword}
                  disabled={loading || !password || !confirmPassword || !isPremium}
                  className="flex-1"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button
                  onClick={handleRemovePassword}
                  disabled={loading || !isPremium}
                  variant="outline"
                  className="flex-1"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Remove Lock
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (min 4 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isPremium}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={!isPremium}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isPremium}
                />
              </div>

              <Button
                onClick={handleSetPassword}
                disabled={loading || !password || !confirmPassword || !isPremium}
                className="w-full btn-primary"
              >
                <Lock className="w-4 h-4 mr-2" />
                {loading ? 'Locking...' : 'Lock Link'}
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Anyone visiting your short link will be prompted for the password</li>
              <li>After successful unlock, they can access the link for 1 hour</li>
              <li>Failed attempts are tracked and rate-limited for security</li>
              <li>You can change or remove the password anytime</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
