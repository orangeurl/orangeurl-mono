/**
 * Routes Constants
 * Centralized route definitions for type safety and maintainability
 */

export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  ABOUT: '/about',
  BLOG: '/blog',
  SUPPORT: '/support',
  COMPARISON: '/comparison',
  
  // Auth routes
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  
  // Feature routes
  FEATURES: {
    SHORT_LINKS: '/features/short-links',
    LOCK_LINKS: '/features/lock-links',
  },
  
  // Bio link
  BIO: '/bio',
  
  // Competitor alternatives
  BITLY_ALTERNATIVE: '/bitly-alternative',
  
  // Legal
  PRIVACY: '/privacy',
  TERMS: '/terms',
  
  // API routes
  API: {
    V1: '/api/v1',
    CHECK_AVAILABILITY: '/api/check-availability',
    WAITLIST: '/api/waitlist',
    USER: {
      CHECK_REGISTRATION: '/api/user/check-registration',
    },
    AUTH: {
      CALLBACK: '/api/auth/callback',
    },
  },
} as const;

/**
 * Get route with params
 */
export function getRoute(path: string, params?: Record<string, string>): string {
  let route = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      route = route.replace(`[${key}]`, value);
    });
  }
  return route;
}

/**
 * Check if route is public (doesn't require authentication)
 */
export function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    ROUTES.HOME,
    ROUTES.PRICING,
    ROUTES.ABOUT,
    ROUTES.BLOG,
    ROUTES.SUPPORT,
    ROUTES.COMPARISON,
    ROUTES.BITLY_ALTERNATIVE,
    ROUTES.PRIVACY,
    ROUTES.TERMS,
    ROUTES.SIGN_IN,
    ROUTES.SIGN_UP,
  ];
  
  return publicRoutes.some(route => path.startsWith(route));
}

/**
 * Check if route is auth-related
 */
export function isAuthRoute(path: string): boolean {
  return path.startsWith(ROUTES.SIGN_IN) || path.startsWith(ROUTES.SIGN_UP);
}

