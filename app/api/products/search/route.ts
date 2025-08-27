import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search keyword is required',
        },
        { status: 400 }
      );
    }

    const result = await searchProducts(keyword, limit);

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
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
      },
      { status: 500 }
    );
  }
}
