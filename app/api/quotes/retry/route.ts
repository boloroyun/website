import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Quote Retry API: Received retry request');

    // Parse the incoming request body
    const quoteData = await request.json();
    console.log(
      '📝 Quote Retry API: Retry data:',
      JSON.stringify(quoteData, null, 2)
    );

    // Get admin API base URL from environment variables
    const adminApiBase = process.env.NEXT_PUBLIC_ADMIN_API_BASE;
    console.log(
      `📝 Quote Retry API: Using admin API base URL: ${adminApiBase}`
    );

    if (!adminApiBase) {
      console.error(
        '📝 Quote Retry API: NEXT_PUBLIC_ADMIN_API_BASE environment variable is not set'
      );
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Forward the request to admin API with timeout and error handling
    let response;
    try {
      console.log(
        `📝 Quote Retry API: Sending request to ${adminApiBase}/api/quotes/submit`
      );

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      response = await fetch(`${adminApiBase}/api/quotes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'website-quote-retry',
          'X-Api-Key': process.env.ADMIN_API_KEY || '', // Add API key if available
        },
        body: JSON.stringify(quoteData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📝 Quote Retry API: Response status: ${response.status}`);
      console.log(`📝 Quote Retry API: Response OK: ${response.ok}`);
    } catch (fetchError) {
      console.error(
        '📝 Quote Retry API: Network error while sending quote request:',
        fetchError
      );
      return NextResponse.json(
        { success: false, error: 'Network error' },
        { status: 500 }
      );
    }

    // Check if the forwarded request was successful
    if (!response.ok) {
      console.error(
        '📝 Quote Retry API: Error from admin API:',
        response.status
      );
      return NextResponse.json(
        { success: false, error: 'Failed to process quote request' },
        { status: response.status }
      );
    }

    // Return success response
    console.log(
      '📝 Quote Retry API: Quote request successfully submitted to admin API'
    );
    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
    });
  } catch (error) {
    console.error('📝 Quote Retry API: Error processing quote request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
