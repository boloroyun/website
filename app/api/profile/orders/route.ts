import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders } from '@/actions/profile.actions';

export async function GET(request: NextRequest) {
  try {
    const result = await getUserOrders();

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error - Get user orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
