import { NextRequest, NextResponse } from 'next/server';
import {
  getUserShippingAddress,
  updateShippingAddress,
} from '@/actions/profile.actions';

export async function GET(request: NextRequest) {
  try {
    const result = await getUserShippingAddress();

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error - Get shipping address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipping address' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const addressData = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'address1',
      'city',
      'state',
      'zipCode',
      'country',
    ];
    for (const field of requiredFields) {
      if (!addressData[field]?.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
          },
          { status: 400 }
        );
      }
    }

    const result = await updateShippingAddress(addressData);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error - Update shipping address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update shipping address' },
      { status: 500 }
    );
  }
}
