import { NextResponse } from 'next/server';
import { getBestSellers } from '@/actions';

export async function GET() {
  try {
    const result = await getBestSellers(4);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recommended products',
      },
      { status: 500 }
    );
  }
}
