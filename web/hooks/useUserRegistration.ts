import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface RegistrationStatus {
  isRegistered: boolean | null; // null = loading
  error: string | null;
  checkRegistration: () => Promise<void>;
}

export function useUserRegistration(): RegistrationStatus {
  const { getToken, isSignedIn } = useAuth();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkRegistration = async () => {
    if (!isSignedIn) {
      setIsRegistered(false);
      return;
    }

    try {
      setError(null);
      const token = await getToken();
      
      if (!token) {
        setIsRegistered(false);
        return;
      }

      // Make a test API call to check if user is registered
      const response = await fetch('/api/user/check-registration', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        // User is signed in to Clerk but not registered in our database
        const data = await response.json();
        if (data.code === 'USER_NOT_REGISTERED') {
          setIsRegistered(false);
          setError(data.message);
          return;
        }
      }

      if (response.ok) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
        setError('Failed to check registration status');
      }
    } catch (err) {
      console.error('Registration check failed:', err);
      setIsRegistered(false);
      setError('Network error checking registration');
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      checkRegistration();
    } else {
      setIsRegistered(false);
      setError(null);
    }
  }, [isSignedIn]);

  return {
    isRegistered,
    error,
    checkRegistration,
  };
}






