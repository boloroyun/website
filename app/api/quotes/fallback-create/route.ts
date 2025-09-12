import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as loggerModule from '@/lib/logger';

// Create a basic logger that won't throw errors
const logger = {
  debug: (...args: any[]) => loggerModule.dlog(...args),
  error: (...args: any[]) => loggerModule.error(...args),
  info: (...args: any[]) => loggerModule.log(...args),
  warn: (...args: any[]) => loggerModule.warn(...args),
};

// Lazy Prisma initialization
let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

/**
 * Creates a fallback quote request entry when the main API fails
 * but we still want to store the request and generate a confirmation link
 */
export async function POST(request: NextRequest) {
  try {
    logger.debug('📝 Fallback Quote API: Received new fallback request');

    // Parse the incoming request body
    const requestData = await request.json();

    // Basic validation
    if (!requestData.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Create the quote request in the database
    const quoteRequest = await getPrisma().quoteRequest.create({
      data: {
        email: requestData.email,
        customerName: requestData.name || null,
        phone: requestData.phone || null,
        zip: requestData.zipCode || null,
        productName: requestData.productName || null,
        productId: requestData.productId || null,
        sku: requestData.sku || null,
        material: requestData.material || null,
        dimensions: requestData.dimensions || null,
        notes: requestData.notes || null,
        status: 'NEW',
      },
    });

    logger.debug(
      `📝 Fallback Quote API: Created fallback quote with ID: ${quoteRequest.id}`
    );

    // If there are images, create them as related records
    if (
      requestData.images &&
      Array.isArray(requestData.images) &&
      requestData.images.length > 0
    ) {
      logger.debug(
        `📝 Fallback Quote API: Processing ${requestData.images.length} images`
      );

      const imageCreatePromises = requestData.images.map((image: any) =>
        getPrisma().quoteRequestImage.create({
          data: {
            quoteRequestId: quoteRequest.id,
            publicId: image.publicId,
            secureUrl: image.secureUrl,
            width: image.width || null,
            height: image.height || null,
            bytes: image.bytes || null,
            format: image.format || null,
            originalName: image.originalName || null,
          },
        })
      );

      await Promise.all(imageCreatePromises);
      logger.debug(
        '📝 Fallback Quote API: Successfully saved all image records'
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Fallback quote request created successfully',
      quoteId: quoteRequest.id,
      publicToken: quoteRequest.publicToken,
    });
  } catch (error) {
    logger.error('Error processing fallback quote request:', error);

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
