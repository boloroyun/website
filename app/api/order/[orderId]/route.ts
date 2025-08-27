import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/actions/orders.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const result = await getOrderById(orderId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        order: result.order,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === 'Not authenticated' ? 401 : 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
