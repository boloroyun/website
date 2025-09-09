import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Constant-time string comparison to prevent timing attacks
function secureEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.CRISP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CRISP_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Verify webhook secret
    const providedSecret =
      request.nextUrl.searchParams.get('token') ||
      request.headers.get('X-Webhook-Secret');

    if (!providedSecret || !secureEquals(providedSecret, webhookSecret)) {
      console.warn('Invalid webhook secret provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse webhook payload
    const payload = await request.json();
    console.log('📨 Crisp webhook received:', {
      event: payload.event,
      website_id: payload.website_id,
      timestamp: new Date().toISOString(),
    });

    // Extract relevant data
    const { event, website_id, data: eventData } = payload;

    // Only forward visitor messages and specific events to Admin API
    const forwardableEvents = [
      'message:send',
      'message:received',
      'conversation:created',
      'user:created',
      'profile:updated',
    ];

    if (forwardableEvents.includes(event)) {
      await forwardToAdminAPI({
        event,
        website_id,
        data: eventData,
        timestamp: new Date().toISOString(),
      });
    }

    // Store activity in database (if needed)
    // This would require your existing database setup
    // await storeActivity(event, eventData);

    return NextResponse.json({
      ok: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('❌ Crisp webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function forwardToAdminAPI(webhookData: any) {
  try {
    const adminApiBase = process.env.ADMIN_API_BASE;
    const internalToken = process.env.INTERNAL_API_TOKEN;

    if (!adminApiBase || !internalToken) {
      console.warn('Admin API not configured, skipping forward');
      return;
    }

    const response = await fetch(`${adminApiBase}/crisp/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${internalToken}`,
        'User-Agent': 'Website-Crisp-Webhook/1.0',
      },
      body: JSON.stringify(webhookData),
    });

    if (response.ok) {
      console.log('✅ Successfully forwarded to Admin API');
    } else {
      console.error(
        '❌ Failed to forward to Admin API:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('❌ Error forwarding to Admin API:', error);
  }
}
