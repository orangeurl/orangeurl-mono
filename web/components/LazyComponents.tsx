/**
 * Lazy-loaded Components
 * Improves initial page load performance
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components
export const LazyParticleBackground = dynamic(
  () => import('./ParticleBackground').then((mod) => ({ default: mod.ParticleBackground })),
  {
    ssr: false,
    loading: () => null,
  }
);

export const LazyWaitlistDialog = dynamic(
  () => import('./WaitlistDialog').then((mod) => ({ default: mod.WaitlistDialog })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted rounded-lg h-64 w-full" />,
  }
);

// Wrapper component for suspense
export function SuspenseWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-muted rounded-lg h-32 w-full" />}>
      {children}
    </Suspense>
  );
}

