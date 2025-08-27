import { NextResponse } from 'next/server';
import { handleLogout } from '@/actions/logout.actions';

export async function POST() {
  try {
    const result = await handleLogout();

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
