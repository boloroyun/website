import { NextResponse } from 'next/server';
import { getPopularColors } from '@/actions/products.actions';

export async function GET() {
  try {
    const result = await getPopularColors();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch popular colors',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in popular colors API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
