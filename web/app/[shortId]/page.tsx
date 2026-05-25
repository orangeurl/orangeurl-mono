'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { PasswordAPI } from '@/lib/api-client';
import { isSecureRedirectURL } from '@/lib/security';

export default function UnlockPage() {
  const params = useParams();
  const router = useRouter();
  const shortId = params.shortId as string;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await PasswordAPI.unlockURL(shortId, password);

      // Validate redirect URL to prevent open redirect attacks
      if (!isSecureRedirectURL(response.redirect_url)) {
        setError('Invalid redirect URL. Please contact the link owner.');
        setLoading(false);
        return;
      }

      setIsUnlocked(true);
      setRedirectUrl(response.redirect_url);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = response.redirect_url;
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Incorrect password. Please try again.');
      setAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isUnlocked ? (
            <Card className="border-2 border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Lock Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="inline-block"
                  >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <div>
                    <h1 className="text-2xl font-bold mb-2">This Link is Protected</h1>
                    <p className="text-muted-foreground">
                      Please enter the password to access this content
                    </p>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        onKeyPress={handleKeyPress}
                        className="text-center text-lg h-14 pr-12"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-3 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                      </motion.div>
                    )}

                    <Button
                      onClick={handleUnlock}
                      disabled={loading || !password}
                      className="btn-primary w-full h-12 text-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-5 h-5 mr-2" />
                          Unlock Link
                        </>
                      )}
                    </Button>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-left">
                        This link has been secured by the owner. Contact them if you need
                        access.
                      </p>
                    </div>

                    {attempts > 2 && (
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        Failed attempts: {attempts}. Too many failed attempts may result in
                        temporary lockout.
                      </div>
                    )}
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
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    <div>
                      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                        Access Granted!
                      </h2>
                      <p className="text-muted-foreground">
                        You've successfully unlocked this protected link
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <p className="text-sm text-muted-foreground mb-2">
                        Redirecting to:
                      </p>
                      <p className="text-sm font-mono text-green-700 dark:text-green-300 break-all">
                        {redirectUrl}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting in a moment...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Branding */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">Secured with</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded" />
            <span className="font-bold text-lg">OrangeURL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
