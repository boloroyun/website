import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/actions/orders.actions';

// Verify Razorpay payment and create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderData,
    } = body;

    // TODO: Verify Razorpay payment signature
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(razorpay_order_id + '|' + razorpay_payment_id)
    //   .digest('hex');

    // if (expectedSignature !== razorpay_signature) {
    //   return NextResponse.json(
    //     { success: false, error: 'Payment verification failed' },
    //     { status: 400 }
    //   );
    // }

    // Payment verified, create order
    const result = await createOrder({
      ...orderData,
      paymentMethod: 'razorpay',
    });

    if (result.success) {
      // TODO: Update order with Razorpay payment details
      // await updateOrderPaymentDetails(result.orderId, {
      //   razorpay_payment_id,
      //   razorpay_order_id,
      //   isPaid: true,
      //   paidAt: new Date(),
      // });

      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        message: 'Payment verified and order created successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
