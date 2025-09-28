import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Your user data from the database
    const userData = {
      id: '68a924b5f7da632de99e7c2c',
      email: 'boloroyun888@gmail.com',
      username: 'boloroyun',
      role: 'ADMIN',
      image: null,
    };

    const cookieStore = cookies();

    // Set authentication cookies
    cookieStore.set('auth-token', userData.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    cookieStore.set('auth-user', JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log('✅ Force login successful for:', userData.email);

    return NextResponse.json({
      success: true,
      message: 'Authentication cookies set successfully',
      user: userData,
    });
  } catch (error: any) {
    console.error('❌ Force login error:', error);
    return NextResponse.json(
      { error: 'Failed to set authentication cookies' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to force login' });
}
