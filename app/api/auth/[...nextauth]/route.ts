// Build-safe NextAuth configuration for Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Create a completely isolated handler function
async function createHandler() {
  try {
    // Dynamic imports to prevent build-time execution
    const NextAuth = (await import('next-auth')).default;

    // Import auth options dynamically to avoid build-time Prisma initialization
    const authModule = await import('@/lib/auth');

    return NextAuth(authModule.authOptions);
  } catch (error) {
    console.error('Failed to create NextAuth handler:', error);

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
export async function GET(request: Request) {
  try {
    const handler = await createHandler();
    return handler(request);
  } catch (error) {
    console.error('NextAuth GET error:', error);
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
}

export async function POST(request: Request) {
  try {
    const handler = await createHandler();
    return handler(request);
  } catch (error) {
    console.error('NextAuth POST error:', error);
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
}
