import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is a special API route that sets authentication cookies
// Only available in development mode for security reasons
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

    // Set the auth-token cookie (HttpOnly for security)
    cookieStore.set('auth-token', '68a13ec0703ecaee644cefc3', {
      httpOnly: true,
      secure: false, // Set to false in development for simplicity
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Set the auth-user cookie (not HttpOnly so JavaScript can access it)
    const userData = {
      id: '68a13ec0703ecaee644cefc3',
      email: 'boogii333888@gmail.com',
      username: 'vip',
      role: 'CLIENT',
    };

    cookieStore.set('auth-user', JSON.stringify(userData), {
      httpOnly: false,
      secure: false, // Set to false in development for simplicity
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Return success response with redirect
    return NextResponse.json(
      {
        success: true,
        message: 'Authentication cookies set successfully',
        redirect: '/profile',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error setting auth cookies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set authentication cookies' },
      { status: 500 }
    );
  }
}
