import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Code must be 4 digits' },
        { status: 400 }
      );
    }

    // Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Find verification code in database
    const storedData = await prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!storedData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No verification code found. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (new Date() > storedData.expiresAt) {
      // Delete expired code
      await prisma.verificationCode.delete({
        where: { email },
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Verification code has expired. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Check if code matches
    if (storedData.code !== code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid verification code. Please try again.',
        },
        { status: 400 }
      );
    }

    console.log(`✅ Verification successful for ${email}`);

    // Code is valid, now handle user authentication
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user with unique username
      let finalUsername = storedData.username;

      // Check if username is already taken
      const existingUserWithUsername = await prisma.user.findUnique({
        where: { username: storedData.username },
      });

      if (existingUserWithUsername) {
        // Generate a unique username by appending a number
        let counter = 1;
        let isUnique = false;

        while (!isUnique && counter <= 100) {
          const testUsername = `${storedData.username}${counter}`;
          const existingUser = await prisma.user.findUnique({
            where: { username: testUsername },
          });

          if (!existingUser) {
            finalUsername = testUsername;
            isUnique = true;
          } else {
            counter++;
          }
        }

        if (!isUnique) {
          // Fallback to email-based username if all attempts fail
          finalUsername = email.split('@')[0] + Date.now();
        }

        console.log(
          `⚠️ Username '${storedData.username}' was taken, using '${finalUsername}' instead`
        );
      }

      user = await prisma.user.create({
        data: {
          name: finalUsername, // Use username as name for now
          email,
          password: '', // Empty password for verification-based auth
          username: finalUsername,
          role: Role.CLIENT,
        },
      });
      console.log(`👤 New user created: ${user.username} (${user.email})`);
    } else {
      // Update username if different and not taken by another user
      if (user.username !== storedData.username) {
        // Check if the new username is already taken by another user
        const existingUserWithUsername = await prisma.user.findFirst({
          where: {
            username: storedData.username,
            id: { not: user.id },
          },
        });

        if (!existingUserWithUsername) {
          // Username is available, update it
          user = await prisma.user.update({
            where: { id: user.id },
            data: { username: storedData.username },
          });
          console.log(
            `👤 Updated username for ${user.email}: ${user.username}`
          );
        }
      }
      console.log(
        `👤 Existing user logged in: ${user.username} (${user.email})`
      );
    }

    // Clean up verification code
    await prisma.verificationCode.delete({
      where: { email },
    });

    // Set authentication cookies
    const cookieStore = cookies();
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Set user data cookie (7 days)
    cookieStore.set('auth-user', JSON.stringify(userData), {
      httpOnly: false, // Accessible to client-side JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Set auth token cookie (7 days)
    cookieStore.set('auth-token', user.id, {
      httpOnly: true, // More secure, not accessible to client-side JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log(`🍪 Authentication cookies set for user: ${user.username}`);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: userData,
    });
  } catch (error) {
    console.error('Verify code API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
