import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import { cookies } from 'next/headers';

// Initialize Razorpay payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', orderData } = body;

    // Get current user from cookies
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userData = JSON.parse(authToken.value);
    if (!userData.id) {
      return NextResponse.json(
        { success: false, error: 'User ID not found' },
        { status: 400 }
      );
    }

    // TODO: Initialize Razorpay order here
    // const razorpayOrder = await razorpayInstance.orders.create({
    //   amount: amount * 100, // Razorpay expects amount in paise
    //   currency,
    //   receipt: `order_${Date.now()}`,
    //   payment_capture: 1
    // });

    // For now, return a mock response
    const mockRazorpayOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency,
      status: 'created',
    };

    return NextResponse.json({
      success: true,
      orderId: mockRazorpayOrder.id,
      amount: mockRazorpayOrder.amount,
      currency: mockRazorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // Add this to your .env
      message: 'Razorpay order initialized successfully',
    });
  } catch (error) {
    console.error('Error initializing Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
