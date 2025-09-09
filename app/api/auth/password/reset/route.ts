import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  verifyPasswordResetToken,
  markTokenUsed,
  validatePassword,
} from '@/lib/password-reset';
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
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const tokenData = await verifyPasswordResetToken(token);

    if (!tokenData) {
      return NextResponse.json(
        {
          error: 'Invalid or expired reset token',
          code: 'TOKEN_INVALID',
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismaInstance.user.update({
      where: { id: tokenData.userId },
      data: { password: hashedPassword },
    });

    if (!user) {
      console.error('❌ User not found for password reset:', tokenData.userId);
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 404 }
      );
    }

    // Mark the token as used
    try {
      await markTokenUsed(token);
    } catch (tokenError) {
      console.error(
        '❌ Failed to mark token as used (password was still updated):',
        tokenError
      );
      // Don't fail the request if token marking fails - password was already updated
    }

    console.log(`✅ Password successfully reset for user: ${user.email}`);
    return NextResponse.json(
      { success: true, message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    // Handle specific errors from verifyPasswordResetToken
    if (error.message?.includes('Token not found')) {
      return NextResponse.json(
        {
          error: 'Reset token has already been used or is invalid',
          code: 'TOKEN_USED',
        },
        { status: 400 }
      );
    } else if (
      error.message?.includes('Failed to verify password reset token')
    ) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token', code: 'TOKEN_INVALID' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
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
