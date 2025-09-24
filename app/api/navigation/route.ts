import { NextResponse } from 'next/server';
import { getNavigationData } from '@/actions/navigation.actions';

export async function GET() {
  try {
    const result = await getNavigationData();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navigation data' },
      { status: 500 }
    );
  }
}
