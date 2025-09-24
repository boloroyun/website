import { NextRequest, NextResponse } from 'next/server';
import * as loggerModule from '@/lib/logger';

// Create a basic logger that won't throw errors
const logger = {
  debug: (...args: any[]) => loggerModule.dlog(...args),
  error: (...args: any[]) => loggerModule.error(...args),
  info: (...args: any[]) => loggerModule.log(...args),
  warn: (...args: any[]) => loggerModule.warn(...args),
};

// Use the centralized MongoDB connection with retry capability
import { connectWithRetry, getPrismaClient } from '@/lib/mongodb';

async function getPrisma() {
  try {
    return await connectWithRetry();
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
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
    const prisma = await getPrisma();

    // Handle productId - MongoDB ObjectIDs must be 12 bytes (24 hex chars)
    // If it's not a valid ObjectId format, store it as a string reference instead
    const isValidObjectId = (id: string): boolean =>
      /^[0-9a-fA-F]{24}$/.test(id);

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        email: requestData.email,
        customerName: requestData.name || null,
        phone: requestData.phone || null,
        zip: requestData.zipCode || null,
        productName: requestData.productName || null,
        // Only use productId if it's a valid ObjectId, otherwise store as productReference
        ...(requestData.productId && isValidObjectId(requestData.productId)
          ? { productId: requestData.productId }
          : { productReference: requestData.productId || null }),
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
        prisma.quoteRequestImage.create({
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
