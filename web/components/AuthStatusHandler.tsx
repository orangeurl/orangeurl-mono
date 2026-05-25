'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, LogOut } from 'lucide-react';

export function AuthStatusHandler() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  useEffect(() => {
    // Show login toast when user successfully signs in
    if (isLoaded && user && !hasShownWelcome) {
      toast({
        title: "Logged in",
        variant: 'success',
        duration: 2500,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });

      setHasShownWelcome(true);
      setPreviousUserId(user.id);
    }

    // Detect sign out
    if (isLoaded && !user && previousUserId) {
      toast({
        title: "Signed out",
        variant: 'default',
        duration: 2500,
        icon: <LogOut className="h-5 w-5 text-slate-600" />,
      });

      setHasShownWelcome(false);
      setPreviousUserId(null);
    }
  }, [isLoaded, user, toast, hasShownWelcome, previousUserId]);

  return null;
}
