// Build-safe NextAuth configuration for Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Import logger
import { dlog, error as logError } from '@/lib/logger';

// Create a completely isolated handler function
async function createHandler() {
  try {
    // Dynamic imports to prevent build-time execution
    const { default: NextAuth } = await import('next-auth');

    // Import auth options dynamically to avoid build-time Prisma initialization
    const { authOptions } = await import('@/lib/auth');

    // Create a wrapper handler that fixes the NextAuth query parameter issue
    return async function handler(request: Request) {
      try {
        // Extract the nextauth segment from the URL path
        const url = new URL(request.url);
        const segments = url.pathname.split('/');

        // Get the last segment of the path (after /api/auth/...)
        const nextauthSegment = segments[segments.length - 1];

        // Create a mock query object with nextauth parameter
        // This simulates the structure that NextAuth expects
        const mockQuery = { nextauth: [nextauthSegment] };

        // Add this to the authOptions for this request
        const enhancedAuthOptions = {
          ...authOptions,
          // Temporary debug property to help identify the issue
          debug: process.env.NODE_ENV === 'development',
          // Add the request context with our mock query
          req: {
            query: mockQuery,
            cookies: request.headers.get('cookie') || '',
            body: await request
              .clone()
              .text()
              .catch(() => ''),
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
          },
        };

        // Call NextAuth with the enhanced options
        return NextAuth(enhancedAuthOptions)(request);
      } catch (e) {
        logError('Error in NextAuth handler wrapper:', e);
        throw e;
      }
    };
  } catch (error) {
    logError('Failed to create NextAuth handler:', error);

    // Return a fallback handler that always returns an error
    return () =>
      new Response(
        JSON.stringify({
          error: 'Authentication service unavailable',
          message: 'Please try again later',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
  }
}

// Simple handlers that only load NextAuth at runtime
import { fallbackSession } from '../session-fallback';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const isSessionRequest = url.pathname.endsWith('/session');

    // Create the handler
    const handler = await createHandler();

    try {
      // Try to use the normal handler
      return await handler(request);
    } catch (error) {
      // If this is a session request and failed, provide a fallback empty session
      // This prevents client-side errors when session check fails
      if (isSessionRequest) {
        logError('Using fallback session due to error:', error);
        return fallbackSession();
      }

      // For other auth endpoints, return error response
      logError('NextAuth GET error:', error);
      return new Response(
        JSON.stringify({
          error: 'Authentication service temporarily unavailable',
          message: 'Please try again later',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    // If we can't even create the handler, return fallback for session requests
    const url = new URL(request.url);
    if (url.pathname.endsWith('/session')) {
      return fallbackSession();
    }

    // Otherwise return error
    logError('NextAuth handler creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Authentication service unavailable',
        message: 'Please try again later',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if this is a session-related request that should use fallback
    const url = new URL(request.url);
    const isSessionRelated =
      url.pathname.endsWith('/session') || url.pathname.endsWith('/_log');

    // Create the handler
    const handler = await createHandler();

    try {
      // Try to use the normal handler
      return await handler(request);
    } catch (error) {
      // If this is a session-related request and failed, provide empty 200 response
      if (isSessionRelated) {
        logError(
          'Using empty response for session-related POST due to error:',
          error
        );
        return new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // For other auth endpoints, return error response
      logError('NextAuth POST error:', error);
      return new Response(
        JSON.stringify({
          error: 'Authentication service temporarily unavailable',
          message: 'Please try again later',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    // For any unhandled error, return a graceful error response
    logError('NextAuth POST handler creation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Authentication service unavailable',
        message: 'Please try again later',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
