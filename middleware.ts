import { withAuth } from 'next-auth/middleware';

export default withAuth(
  {
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    // Only protect these specific routes
    '/account/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/order/:path*'
  ],
};
