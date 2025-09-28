import { NextRequest, NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/password-reset';
import { sendMail, getPasswordResetEmailHtml } from '@/lib/mail';
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
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await prismaInstance.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // IMPORTANT: Always respond with success for security reasons,
    // to prevent email enumeration attacks.
    if (user) {
      try {
        const { token, expires } = await createPasswordResetToken(user.id);
        const appBaseUrl =
          process.env.APP_BASE_URL ||
          process.env.NEXT_PUBLIC_APP_URL ||
          'http://localhost:3000';
        const resetLink = `${appBaseUrl}/auth/reset-password?token=${token}`;
        const emailHtml = getPasswordResetEmailHtml(resetLink);

        await sendMail(user.email, 'Password Reset Request', emailHtml);
        console.log(`✅ Password reset email sent to ${user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send password reset email:', emailError);
        // Log the error but still return success to the client for security
      }
    } else {
      console.log(
        `ℹ️ Password reset requested for non-existent email: ${email}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If that email exists, we sent a reset link.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ API Password Request Error:', error);
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
