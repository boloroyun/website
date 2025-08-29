import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Define protected routes that require authentication
    const protectedRoutes = ['/account', '/profile', '/orders', '/checkout', '/order'];

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If accessing protected route without authentication, redirect to signin
    if (isProtectedRoute && !token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based access control (if needed in the future)
    // Example: Admin-only routes
    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
    
    if (isAdminRoute && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/account', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        const publicRoutes = [
          '/',
          '/products',
          '/category',
          '/product',
          '/about',
          '/contact',
          '/blog',
          '/auth/signin',
          '/api/auth',
        ];

        const isPublicRoute = publicRoutes.some((route) => 
          pathname.startsWith(route)
        );

        // Allow access to public routes without authentication
        if (isPublicRoute) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
