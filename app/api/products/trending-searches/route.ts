import { NextResponse } from 'next/server';
import { getTrendingSearches } from '@/actions/products.actions';

export async function GET() {
  try {
    const result = await getTrendingSearches();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch trending searches',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in trending searches API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
