import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Lazy Prisma initialization
let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Zod schema for quote request
const QuoteRequestSchema = z.object({
  material: z.string().optional(),
  sqft: z.number().min(1).optional(),
  edgeProfile: z.string().optional(),
  sinkCutouts: z.number().min(0).optional(),
  backsplashLf: z.number().min(0).optional(),
  zipcode: z.string().optional(),
  website_id: z.string(),
  session_id: z.string(),
});

type QuoteRequest = z.infer<typeof QuoteRequestSchema>;

/**
 * Calculate quote pricing based on inputs
 * This is a simplified pricing model - can be enhanced with real business logic
 */
function calculateQuote(request: QuoteRequest) {
  const { material, sqft, edgeProfile, sinkCutouts, backsplashLf } = request;

  // Base pricing per square foot by material
  const materialPricing: Record<string, number> = {
    granite: 45,
    quartz: 65,
    marble: 70,
    quartzite: 60,
    limestone: 55,
    concrete: 35,
    'butcher block': 25,
    wood: 30,
  };

  const basePricePerSqft =
    materialPricing[material?.toLowerCase() || 'quartz'] || 65;
  const squareFootage = sqft || 25; // Default to 25 sq ft if not specified

  // Calculate base cost
  let subtotal = basePricePerSqft * squareFootage;

  const lineItems = [
    {
      description: `${material || 'Quartz'} Countertop (${squareFootage} sq ft)`,
      quantity: squareFootage,
      unitPrice: basePricePerSqft,
      amount: subtotal,
    },
  ];

  // Add edge profile cost
  if (edgeProfile && edgeProfile !== 'straight') {
    const edgeCosts: Record<string, number> = {
      beveled: 8,
      bullnose: 12,
      ogee: 15,
      waterfall: 25,
      eased: 6,
      laminated: 10,
    };

    const edgeCost =
      (edgeCosts[edgeProfile.toLowerCase()] || 10) *
      Math.sqrt(squareFootage) *
      4; // Approximate perimeter
    subtotal += edgeCost;

    lineItems.push({
      description: `${edgeProfile} Edge Profile`,
      quantity: 1,
      unitPrice: edgeCost,
      amount: edgeCost,
    });
  }

  // Add sink cutout costs
  if (sinkCutouts && sinkCutouts > 0) {
    const sinkCost = sinkCutouts * 150; // $150 per cutout
    subtotal += sinkCost;

    lineItems.push({
      description: `Sink Cutout${sinkCutouts > 1 ? 's' : ''} (${sinkCutouts})`,
      quantity: sinkCutouts,
      unitPrice: 150,
      amount: sinkCost,
    });
  }

  // Add backsplash cost
  if (backsplashLf && backsplashLf > 0) {
    const backsplashPricePerLf = basePricePerSqft * 0.7; // Slightly less than countertop
    const backsplashCost = backsplashLf * backsplashPricePerLf;
    subtotal += backsplashCost;

    lineItems.push({
      description: `${material || 'Quartz'} Backsplash (${backsplashLf} linear ft)`,
      quantity: backsplashLf,
      unitPrice: backsplashPricePerLf,
      amount: backsplashCost,
    });
  }

  // Add installation cost (typically 20-30% of material cost)
  const installationRate = 0.25;
  const installationCost = subtotal * installationRate;
  subtotal += installationCost;

  lineItems.push({
    description: 'Professional Installation',
    quantity: 1,
    unitPrice: installationCost,
    amount: installationCost,
  });

  // Calculate tax (example: 8.5% - should be based on zipcode in real implementation)
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    lineItems,
    taxRate,
  };
}

/**
 * Store quote in database for future reference
 */
async function storeQuote(request: QuoteRequest, calculatedQuote: any) {
  try {
    // For now, we'll create a simple quote record
    // In a real implementation, you'd have a proper Quote model in Prisma schema

    const quoteData = {
      id: `Q${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      sessionId: request.session_id,
      websiteId: request.website_id,
      material: request.material || 'Unknown',
      sqft: request.sqft || 0,
      edgeProfile: request.edgeProfile,
      sinkCutouts: request.sinkCutouts || 0,
      backsplashLf: request.backsplashLf || 0,
      zipcode: request.zipcode,
      subtotal: calculatedQuote.subtotal,
      tax: calculatedQuote.tax,
      total: calculatedQuote.total,
      lineItems: calculatedQuote.lineItems,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };

    // Store in a simple way for now (you might want to add a Quote model to Prisma)
    console.log('📄 Quote stored:', quoteData);

    return quoteData.id;
  } catch (error) {
    console.error('❌ Failed to store quote:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal API token
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN || 'dev-token';

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      console.error('❌ Unauthorized API call to quotes/ai');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = QuoteRequestSchema.safeParse(body);

    if (!validatedRequest.success) {
      console.error('❌ Invalid quote request:', validatedRequest.error);
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedRequest.error.issues,
        },
        { status: 400 }
      );
    }

    const quoteRequest = validatedRequest.data;
    console.log('💰 Processing AI quote request:', quoteRequest);

    // Calculate quote
    const calculatedQuote = calculateQuote(quoteRequest);
    console.log('📊 Quote calculated:', calculatedQuote);

    // Store quote for future reference
    const quoteId = await storeQuote(quoteRequest, calculatedQuote);

    // Return the quote response
    const response = {
      quoteId,
      subtotal: calculatedQuote.subtotal,
      tax: calculatedQuote.tax,
      total: calculatedQuote.total,
      lineItems: calculatedQuote.lineItems,
      material: quoteRequest.material || 'Quartz',
      sqft: quoteRequest.sqft || 25,
      taxRate: calculatedQuote.taxRate,
      estimatedCompletion: '2-3 weeks',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    console.log('✅ Quote generated successfully:', {
      quoteId,
      total: response.total,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error generating AI quote:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
