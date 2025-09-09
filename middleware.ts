import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require CLIENT role
  const protectedRoutes = ['/account', '/orders', '/quotes'];
  
  // Define excluded paths (always allow access)
  const excludedPaths = [
    '/api/auth',
    '/auth',
    '/_next',
    '/favicon.ico',
    '/public',
  ];

  // Check if current path should be excluded from protection
  const isExcludedPath = excludedPaths.some((path) => pathname.startsWith(path));
  
  if (isExcludedPath) {
    return NextResponse.next();
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );

  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get the JWT token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token (not logged in), redirect to signin
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      
      console.log(`🔒 Unauthorized access attempt to ${pathname} - redirecting to signin`);
      return NextResponse.redirect(signInUrl);
    }

    // If user doesn't have CLIENT role, redirect to unauthorized
    if (token.role !== 'CLIENT') {
      const unauthorizedUrl = new URL('/auth/unauthorized', request.url);
      
      console.log(`🚫 Access denied to ${pathname} - user role: ${token.role} (requires CLIENT)`);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // User is authenticated and has CLIENT role - allow access
    console.log(`✅ Access granted to ${pathname} - user: ${token.email} (role: ${token.role})`);
    return NextResponse.next();

  } catch (error) {
    console.error('❌ Middleware error:', error);
    
    // On error, redirect to signin for safety
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    signInUrl.searchParams.set('error', 'middleware_error');
    
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - auth (authentication pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};