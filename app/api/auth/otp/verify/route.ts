import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginOTP, cleanupExpiredOTPs } from '@/lib/otp';
import { PrismaClient, Role } from '@prisma/client';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function POST(request: NextRequest) {
  const prismaInstance = getPrisma();

  try {
    const body = await request.json();
    const { email, otp, username, isNewUser } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // If it's a new user, username is required
    if (isNewUser && (!username || username.trim().length < 2)) {
      return NextResponse.json(
        { error: 'Username is required for new users' },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit code' },
        { status: 400 }
      );
    }

    // Clean up expired OTPs periodically
    try {
      await cleanupExpiredOTPs();
    } catch (cleanupError) {
      console.warn('⚠️ Failed to cleanup expired OTPs:', cleanupError);
    }

    // Verify OTP
    const verification = await verifyLoginOTP(email, otp);

    if (!verification.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 }
      );
    }

    let account;

    if (isNewUser) {
      // Create new website account
      try {
        account = await prismaInstance.websiteAccount.create({
          data: {
            email: email.toLowerCase(),
            username: username.trim(),
            role: Role.CLIENT, // Default role for new website users
          },
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            role: true,
            image: true,
          },
        });
        console.log(
          `✅ New website account created: ${account.email} (${account.username})`
        );
      } catch (createError: any) {
        console.error('❌ Failed to create new website account:', createError);
        return NextResponse.json(
          { error: 'Failed to create website account' },
          { status: 500 }
        );
      }
    } else {
      // Get existing website account details
      account = await prismaInstance.websiteAccount.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          image: true,
        },
      });

      if (!account) {
        return NextResponse.json(
          { error: 'Website account not found' },
          { status: 404 }
        );
      }
    }

    // Create session cookies
    const cookieStore = cookies();
    const sessionData = {
      id: account.id,
      email: account.email,
      username: account.username || account.name || account.email.split('@')[0],
      role: account.role,
      image: account.image,
    };

    // Set authentication cookies
    cookieStore.set('auth-token', account.id, {
      httpOnly: false, // Accessible by client-side JS for auth checks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    cookieStore.set('auth-user', JSON.stringify(sessionData), {
      httpOnly: false, // Accessible by client-side JS for UI updates
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    console.log(
      `✅ Website account ${account.email} successfully authenticated via OTP`
    );
    console.log(`🔍 Session data:`, sessionData);
    console.log(`🍪 Setting cookies:`, {
      'auth-token': account.id,
      'auth-user': JSON.stringify(sessionData),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: sessionData,
        redirectTo: '/', // Redirect to homepage after successful login
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Verify OTP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prismaInstance.$disconnect();
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
