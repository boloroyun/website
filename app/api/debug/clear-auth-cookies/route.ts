import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const cookieStore = cookies();

    // Clear auth cookies
    cookieStore.delete('auth-token');
    cookieStore.delete('auth-user');

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Authentication cookies cleared successfully',
        redirect: '/',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear authentication cookies' },
      { status: 500 }
    );
  }
}
