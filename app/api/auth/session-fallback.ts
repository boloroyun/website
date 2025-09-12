/**
 * Fallback session handler to prevent 500 errors
 * Use this as a fallback when NextAuth's session API fails
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Returns an empty but valid session response
 * This prevents errors in the UI when the real session endpoint fails
 */
export function fallbackSession() {
  return NextResponse.json(
    {
      user: null,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      },
    }
  );
}
