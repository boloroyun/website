import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/actions/auth.actions';

// Force dynamic rendering to prevent static analysis issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

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

    const result = await verifyCode(email, code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        user: result.user,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
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
