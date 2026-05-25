'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X, Mail, Sparkles, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
}

export function WaitlistDialog({ isOpen, onClose, planName }: WaitlistDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Welcome to the waitlist",
          description: "We'll notify you when we launch. Thank you for your interest!",
          variant: 'success',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        });
        setEmail('');
        onClose();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to join waitlist",
          variant: 'error',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again",
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dialogContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20">
        <CardHeader className="relative text-center pb-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold">Join the Waitlist</h2>
          <p className="text-muted-foreground">
            {planName ? `Get notified when the ${planName} plan is available!` : 'Be the first to know when we launch!'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Waitlist'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              We'll only email you about the launch. No spam, ever.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
