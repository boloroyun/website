import { NextResponse } from 'next/server';
import { getActiveTopBars } from '@/actions/topbar.actions';

export async function GET() {
  try {
    const result = await getActiveTopBars();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to fetch topbars',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in topbars API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
