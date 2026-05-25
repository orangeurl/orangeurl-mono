'use client';

import { useUserRegistration } from '@/hooks/useUserRegistration';
import { useAuth } from '@clerk/nextjs';
import { AlertCircle, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RegistrationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RegistrationGuard({ children, fallback }: RegistrationGuardProps) {
  const { isSignedIn } = useAuth();
  const { isRegistered, error, checkRegistration } = useUserRegistration();

  // Not signed in - show children (they can handle sign-in)
  if (!isSignedIn) {
    return <>{children}</>;
  }

  // Loading registration status
  if (isRegistered === null) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking registration status...</span>
        </div>
      </div>
    );
  }

  // User is registered - show protected content
  if (isRegistered) {
    return <>{children}</>;
  }

  // User is not registered - show registration required message
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-xl">Registration Required</CardTitle>
          <CardDescription>
            You need to complete registration to access this service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.href = '/sign-up'} 
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up Now
            </Button>
            
            <Button 
              variant="outline" 
              onClick={checkRegistration}
              className="w-full"
            >
              Check Again
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Already signed up? Try refreshing the page or check again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}






