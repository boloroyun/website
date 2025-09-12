import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendQuoteRequestNotification } from '@/lib/mail';

// Lazy Prisma initialization
let prisma: PrismaClient;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Quote Request API: Received new quote request');

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
        customerName: requestData.customerName || null,
        phone: requestData.phone || null,
        zip: requestData.zip || null,
        productName: requestData.productName || null,
        productId: requestData.productId || null,
        sku: requestData.sku || null,
        material: requestData.material || null,
        dimensions: requestData.dimensions || null,
        notes: requestData.notes || null,
        status: 'NEW',
      },
    });

    console.log(
      `📝 Quote Request API: Created quote request with ID: ${quoteRequest.id}`
    );

    // If there are images, create them as related records
    if (
      requestData.images &&
      Array.isArray(requestData.images) &&
      requestData.images.length > 0
    ) {
      console.log(
        `📝 Quote Request API: Processing ${requestData.images.length} images`
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
      console.log('📝 Quote Request API: Successfully saved all image records');
    }

    // Attempt to send an email notification
    try {
      if (requestData.email) {
        const emailData = {
          name: requestData.customerName || 'Customer',
          email: requestData.email,
          phone: requestData.phone || 'Not provided',
          zipCode: requestData.zip || 'Not provided',
          notes: requestData.notes || 'No notes provided',
          productId: requestData.productId || 'N/A',
          productName: requestData.productName || 'N/A',
          sku: requestData.sku || 'N/A',
          timestamp: new Date().toISOString(),
          quoteId: quoteRequest.id,
          publicToken: quoteRequest.publicToken,
        };

        // Send confirmation email to customer
        await sendQuoteRequestNotification(emailData);
        console.log(
          '📝 Quote Request API: Email notification sent successfully'
        );
      }
    } catch (emailError) {
      console.error(
        '📝 Quote Request API: Failed to send email notification:',
        emailError
      );
      // Don't fail the entire request if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Quote request created successfully',
      quoteId: quoteRequest.id,
      publicToken: quoteRequest.publicToken,
    });
  } catch (error) {
    console.error('Error processing quote request:', error);

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
