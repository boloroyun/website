import { NextRequest, NextResponse } from 'next/server';
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

    // Check if user exists with this email
    const existingAccount = await prismaInstance.websiteAccount.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, username: true },
    });

    console.log(
      `🔍 Email check for ${email}: ${existingAccount ? 'EXISTS' : 'NEW USER'}`
    );

    return NextResponse.json(
      {
        exists: !!existingAccount,
        email: email.toLowerCase(),
        ...(existingAccount && { username: existingAccount.username }),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Check email API error:', error);
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
