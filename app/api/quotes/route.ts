import { NextRequest, NextResponse } from 'next/server';
import { storePendingQuote } from '@/lib/quote-fallback';
import { sendQuoteRequestEmails, QuoteRequestData } from '@/lib/mail';
import * as loggerModule from '@/lib/logger';

// Create a basic logger that won't throw errors
const logger = {
  debug: (...args: any[]) => console.log(...args),
  error: (...args: any[]) => console.error(...args),
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
};

/**
 * Helper function to send quote data to the admin API
 */
async function sendToAdminApi(
  adminApiBase: string,
  quoteData: any
): Promise<boolean> {
  logger.debug(
    `📝 Quote API: Sending request to ${adminApiBase}/api/quotes/submit`
  );

  // Add timeout to the fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    // Uncommented original code to properly send quotes to admin API
    clearTimeout(timeoutId);

    // Try the quote-requests endpoint first, then fall back to others
    const endpoints = [
      `${adminApiBase}/api/quote-requests`,
      `${adminApiBase}/api/quotes/submit`,
      `${adminApiBase}/api/quotes`,
    ];

    let response = null;
    let successEndpoint = null;

    // Try each endpoint until one succeeds
    for (const endpoint of endpoints) {
      try {
        logger.debug(`📝 Quote API: Trying endpoint ${endpoint}`);

        // Try different HTTP methods since some servers might expect different methods
        const methods = ['POST', 'PUT'];

        for (const method of methods) {
          try {
            logger.debug(
              `📝 Quote API: Trying ${method} request to ${endpoint}`
            );

            response = await fetch(endpoint, {
              method,
              headers: {
                'Content-Type': 'application/json',
                'X-Source': 'website-quote-request',
                'X-Api-Key': process.env.ADMIN_API_KEY || '',
                Accept: 'application/json',
              },
              body: JSON.stringify(quoteData),
              signal: controller.signal,
            });

            // If we got a successful response, break out of the loop
            if (response && response.ok) {
              successEndpoint = endpoint;
              break;
            }

            logger.debug(
              `📝 Quote API: ${method} request to ${endpoint} failed with status ${response?.status}`
            );
          } catch (methodError: any) {
            logger.debug(
              `📝 Quote API: Error with ${method} request to ${endpoint}: ${
                methodError instanceof Error ? methodError.message : methodError
              }`
            );
          }
        }

        if (successEndpoint) {
          break;
        }
      } catch (endpointError: any) {
        logger.debug(
          `📝 Quote API: Error with endpoint ${endpoint}: ${
            endpointError instanceof Error
              ? endpointError.message
              : endpointError
          }`
        );
      }
    }

    clearTimeout(timeoutId);

    if (!successEndpoint) {
      logger.debug(`📝 Quote API: All endpoints failed`);
      return false;
    }

    logger.debug(
      `📝 Quote API: Successfully submitted quote to ${successEndpoint}`
    );
    return true;
    // End of original code
  } catch (error: any) {
    clearTimeout(timeoutId);
    logger.error('📝 Quote API: Error submitting quote:', error);
    return false;
  }
}

/**
 * Handles quote request submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const requestData = await request.json();

    // Validate the request
    const requiredFields = ['email', 'name'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Record the quote request in our database (always do this first)
    // This ensures we have a copy even if external systems fail
    let savedQuote = null;
    let dbRetryCount = 0;
    const maxDbRetries = 3;

    while (dbRetryCount < maxDbRetries) {
      try {
        logger.debug(
          `📝 Quote API: Storing quote in database (attempt ${dbRetryCount + 1}/${maxDbRetries})`
        );

        const fallbackResponse = await fetch(
          new URL(
            '/api/quotes/fallback-create',
            process.env.NEXTAUTH_URL || 'http://localhost:3000'
          ),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            // Add timeout to the fetch request
            signal: AbortSignal.timeout(8000), // 8 second timeout
          }
        );

        if (fallbackResponse.ok) {
          savedQuote = await fallbackResponse.json();
          logger.debug('📝 Quote API: Successfully stored quote in database');
          break; // Success, exit the retry loop
        } else {
          const errorText = await fallbackResponse
            .text()
            .catch(() => 'No error details');
          logger.error(
            `📝 Quote API: Failed to store quote in database. Status: ${fallbackResponse.status}, Error: ${errorText}`
          );

          // Only retry on server errors (5xx), not client errors (4xx)
          if (fallbackResponse.status < 500) {
            break;
          }
        }
      } catch (dbError) {
        logger.error('📝 Quote API: Error storing quote in database:', dbError);
      }

      // Increment retry count and wait before retrying
      dbRetryCount++;
      if (dbRetryCount < maxDbRetries) {
        const delay = dbRetryCount * 1000; // Increase delay with each retry
        logger.debug(
          `📝 Quote API: Retrying database storage in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!savedQuote) {
      logger.error(
        `📝 Quote API: Failed to store quote in database after ${maxDbRetries} attempts`
      );
    }

    // Try sending to the admin API if configured
    let adminApiSuccess = false;
    if (process.env.NEXT_PUBLIC_ADMIN_API_BASE) {
      logger.debug(
        `📝 Quote API: Sending to admin API at ${process.env.NEXT_PUBLIC_ADMIN_API_BASE}`
      );
      adminApiSuccess = await sendToAdminApi(
        process.env.NEXT_PUBLIC_ADMIN_API_BASE,
        requestData
      );
    } else {
      logger.error('📝 Quote API: NEXT_PUBLIC_ADMIN_API_BASE not configured');
    }

    // Send email notification (for non-spam requests) if configured
    try {
      // Prepare data for email notification
      const emailData: QuoteRequestData = {
        name: requestData.name || 'Unknown',
        email: requestData.email,
        phone: requestData.phone || 'Not provided',
        productId: requestData.productId || 'unknown-product',
        productName: requestData.productName || 'Not specified',
        notes: requestData.notes || 'Not provided',
        timestamp: new Date().toISOString(),
        quoteId: savedQuote?.quoteId || 'Unknown',
      };

      // Send both customer confirmation and company notification emails
      await sendQuoteRequestEmails(emailData, 'info@luxcabistones.com');
      logger.debug('📝 Quote API: Email notification sent successfully');
    } catch (emailError) {
      logger.error(
        '📝 Quote API: Error sending email notification:',
        emailError
      );
    }

    // Return success response with the quote ID
    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      quoteId: savedQuote?.quoteId || null,
      apiStatus: adminApiSuccess ? 'success' : 'fallback',
    });
  } catch (error) {
    logger.error('📝 Quote API: Error processing quote request:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
