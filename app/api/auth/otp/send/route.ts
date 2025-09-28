import { NextRequest, NextResponse } from 'next/server';
import { createLoginOTP } from '@/lib/otp';
import { sendMail, getLoginOTPEmailHtml } from '@/lib/mail';
import { PrismaClient } from '@prisma/client';

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
    const { email, username, isNewUser } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // If it's a new user, validate username
    if (isNewUser) {
      if (!username || username.trim().length < 2) {
        return NextResponse.json(
          { error: 'Username must be at least 2 characters long' },
          { status: 400 }
        );
      }

      // Check if username is already taken in website accounts
      const existingUsername = await prismaInstance.websiteAccount.findFirst({
        where: { username: username.trim() },
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username is already taken. Please choose another.' },
          { status: 400 }
        );
      }
    }

    // Check if website account exists
    const account = await prismaInstance.websiteAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    // For existing users, account must exist
    if (!isNewUser && !account) {
      return NextResponse.json(
        { error: 'No website account found with this email address.' },
        { status: 404 }
      );
    }

    // For new users, account must not exist
    if (isNewUser && account) {
      return NextResponse.json(
        { error: 'A website account with this email already exists.' },
        { status: 400 }
      );
    }

    try {
      // Create OTP
      const { otp, expires } = await createLoginOTP(email);

      // Send email
      const emailHtml = getLoginOTPEmailHtml(otp, 5);
      await sendMail(
        email,
        'Your Login Code - LUX Cabinets & Stones',
        emailHtml
      );

      console.log(`✅ Login OTP sent to ${email}`);

      return NextResponse.json(
        {
          success: true,
          message: 'Login code sent to your email address.',
          expiresAt: expires.toISOString(),
        },
        { status: 200 }
      );
    } catch (otpError: any) {
      console.error('❌ Failed to create/send OTP:', otpError);

      if (otpError.message.includes('Too many OTP requests')) {
        return NextResponse.json(
          {
            error:
              'Too many requests. Please wait before requesting a new code.',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to send login code. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Send OTP API error:', error);
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
