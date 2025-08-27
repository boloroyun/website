import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletterSubscription.findUnique(
      {
        where: { email: email.toLowerCase() },
      }
    );

    if (existingSubscription) {
      return NextResponse.json(
        { message: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email: email.toLowerCase(),
        subscribedAt: new Date(),
        isActive: true,
        source: 'footer',
      },
    });

    return NextResponse.json(
      {
        message: 'Successfully subscribed to newsletter',
        subscriptionId: subscription.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
