import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware to handle authentication and route protection
 */
export async function middleware(req: NextRequest) {
  // We've removed the aggressive console overriding as it was breaking functionality
  // Logging is now handled more safely through the logger.ts utility

  // Continue with normal middleware processing
  // Cast req to any to avoid type conflicts between Next.js and NextAuth
  const token = await getToken({ req: req as any });
  const isAuthenticated = !!token;

  // Protected routes
  const protectedPaths = ['/profile', '/order', '/payment'];
  const path = req.nextUrl.pathname;

  const isApiAuthRoute = path.startsWith('/api/auth');
  const isProtectedRoute = protectedPaths.some((prefix) =>
    path.startsWith(prefix)
  );

  // Allow API authentication routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Protect profile routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated and trying to access login
  if (isAuthenticated && path.startsWith('/auth/signin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // Match all request paths except for those starting with:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
