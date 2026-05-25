import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes require authentication (API routes only)
const isProtectedRoute = createRouteMatcher([
  '/api/dashboard(.*)',
  '/api/analytics(.*)',
  '/api/auth/token', // Token endpoint needs auth
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect API routes that need authentication
  // Dashboard page itself is accessible to everyone (shows different content based on auth state)
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

