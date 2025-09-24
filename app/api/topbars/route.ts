import { NextResponse } from 'next/server';
import { getActiveTopBars } from '@/actions/topbar.actions';

export async function GET() {
  try {
    const result = await getActiveTopBars();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching topbars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topbars' },
      { status: 500 }
    );
  }
}
