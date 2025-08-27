import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/actions/orders.actions';

// Verify Stripe payment and create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_intent, orderData } = body;

    // For development: simulate successful payment verification
    // In production, replace with actual Stripe verification
    if (!payment_intent || !payment_intent.startsWith('pi_')) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment intent' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual Stripe verification
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    // if (paymentIntent.status !== 'succeeded') {
    //   return NextResponse.json(
    //     { success: false, error: 'Payment not completed' },
    //     { status: 400 }
    //   );
    // }

    // Payment verified, create order
    const result = await createOrder({
      ...orderData,
      paymentMethod: 'stripe',
    });

    if (result.success) {
      // TODO: Update order with Stripe payment details
      // await updateOrderPaymentDetails(result.orderId, {
      //   stripe_payment_intent_id: payment_intent,
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
    console.error('Error verifying Stripe payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
