import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Stripe payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', orderData } = body;

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

    // TODO: Initialize Stripe payment intent here
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Stripe expects amount in cents
    //   currency,
    //   metadata: {
    //     userId: userData.id,
    //     orderId: `temp_${Date.now()}`,
    //   },
    // });

    // For now, return a mock response
    const mockPaymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret_mock`,
      amount: Math.round(amount * 100),
      currency,
      status: 'requires_payment_method',
    };

    return NextResponse.json({
      success: true,
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id,
      amount: mockPaymentIntent.amount,
      currency: mockPaymentIntent.currency,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY, // Add this to your .env
      message: 'Stripe payment intent created successfully',
    });
  } catch (error) {
    console.error('Error initializing Stripe payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
