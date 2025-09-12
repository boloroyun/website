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
    const allCookies = cookieStore.getAll();

    // Get auth cookies
    const authToken = cookieStore.get('auth-token');
    const authUser = cookieStore.get('auth-user');

    // Parse auth-user if it exists
    let userData = null;
    if (authUser) {
      try {
        userData = JSON.parse(authUser.value);
      } catch (e) {
        userData = { error: 'Failed to parse auth-user cookie' };
      }
    }

    return NextResponse.json({
      authenticated: !!(authToken && authUser),
      cookies: {
        'auth-token': authToken
          ? {
              exists: true,
              value: authToken.value.substring(0, 4) + '...', // Show only first few chars for security
            }
          : { exists: false },
        'auth-user': authUser
          ? {
              exists: true,
              parsed: userData,
            }
          : { exists: false },
      },
      allCookieNames: allCookies.map((cookie) => cookie.name),
    });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}
