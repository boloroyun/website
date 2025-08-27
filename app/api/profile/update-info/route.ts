import { NextRequest, NextResponse } from 'next/server';
import { updateUserInfo } from '@/actions/profile.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    console.log('📝 Update info API called with:', { username });

    if (!username || typeof username !== 'string') {
      console.log('❌ Invalid username provided:', username);
      return NextResponse.json(
        { success: false, error: 'Username is required and must be a string' },
        { status: 400 }
      );
    }

    if (username.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username must be at least 2 characters long',
        },
        { status: 400 }
      );
    }

    const result = await updateUserInfo(username.trim());

    console.log('📝 Update result:', result);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error - Update user info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user information' },
      { status: 500 }
    );
  }
}
