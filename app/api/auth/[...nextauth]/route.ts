// NextAuth configuration for App Router
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
