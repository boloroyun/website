import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Only accessible in development mode for security
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    // Get just cookie names and if they exist, no values for security
    const cookieNames = allCookies.map((cookie) => ({
      name: cookie.name,
      exists: true,
    }));

    // Attempt to get user data from auth-user cookie
    let authUserData = null;
    const authUserCookie = cookieStore.get('auth-user');
    if (authUserCookie) {
      try {
        const parsed = JSON.parse(authUserCookie.value);
        authUserData = {
          id: parsed.id ? 'exists' : 'missing',
          email: parsed.email ? 'exists' : 'missing',
          username: parsed.username || 'missing',
          role: parsed.role || 'missing',
        };
      } catch (e) {
        authUserData = 'Invalid JSON in auth-user cookie';
      }
    }

    // Check auth-token cookie
    const authTokenCookie = cookieStore.get('auth-token');
    const authTokenExists = !!authTokenCookie;

    return NextResponse.json({
      success: true,
      message: 'Authentication debug info',
      cookies: cookieNames,
      authUserData: authUserData,
      authTokenExists: authTokenExists,
    });
  } catch (error) {
    console.error('Auth debug API error:', error);
    return NextResponse.json(
      { error: 'Failed to debug auth state' },
      { status: 500 }
    );
  }
}
