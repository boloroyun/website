import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserOrders } from '@/actions/profile.actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('📊 Orders API: Request received');
  try {
    // Log request headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📊 Orders API: Request headers:', {
      cookie: headers.cookie ? 'exists' : 'missing',
      referer: headers.referer,
      'user-agent': headers['user-agent'],
    });

    // Check cookies directly
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token');
    const authUser = cookieStore.get('auth-user');

    console.log('📊 Orders API: Auth cookies:', {
      'auth-token': authToken ? 'exists' : 'missing',
      'auth-user': authUser ? 'exists' : 'missing',
    });

    if (authUser) {
      try {
        const userData = JSON.parse(authUser.value);
        console.log('📊 Orders API: Auth user data:', {
          hasId: !!userData.id,
          hasEmail: !!userData.email,
          hasUsername: !!userData.username,
          role: userData.role || 'not set',
        });
      } catch (e) {
        console.error('📊 Orders API: Failed to parse auth-user cookie:', e);
      }
    }

    console.log('📊 Orders API: Calling getUserOrders()');
    const result = await getUserOrders();
    console.log(
      '📊 Orders API: getUserOrders result:',
      result.success ? 'Success' : 'Failed',
      result.success
        ? `Found ${result.orders?.length || 0} orders`
        : `Error: ${result.error}`
    );

    if (result.success) {
      return NextResponse.json(result);
    } else {
      console.error('📊 Orders API: Authentication error:', result.error);
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('📊 Orders API Error:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('📊 Error name:', error.name);
      console.error('📊 Error message:', error.message);
      console.error('📊 Error stack:', error.stack);
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
