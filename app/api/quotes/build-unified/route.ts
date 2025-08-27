import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';

// Input validation schema
const UnifiedQuoteSchema = z.object({
  category: z.enum(['countertop', 'cabinet', 'combo']),

  // Optional products from CMS
  products: z
    .array(
      z.object({
        id: z.string(),
        qty: z.number().optional(),
      })
    )
    .optional(),

  // Countertop measurements
  sqft: z.number().min(0).optional(),
  edgeProfile: z.string().optional(),
  sinkCutouts: z.number().min(0).optional(),
  backsplashLf: z.number().min(0).optional(),

  // Cabinet measurements
  baseLf: z.number().min(0).optional(),
  wallLf: z.number().min(0).optional(),
  tallUnits: z.number().min(0).optional(),
  drawerStacks: z.number().min(0).optional(),

  // Common fields
  zipcode: z.string().optional(),
  website_id: z.string().optional(),
  session_id: z.string().optional(),
});

type UnifiedQuoteRequest = z.infer<typeof UnifiedQuoteSchema>;

interface PricingProfile {
  // Countertop pricing
  pricePerSqft?: number;
  edgeAdderLf?: number;
  sinkCutoutFee?: number;
  backsplashPerLf?: number;
  laborInstallBase?: number;

  // Cabinet pricing
  basePricePerLf?: number;
  wallPricePerLf?: number;
  tallUnitPrice?: number;
  drawerStackAdder?: number;
  crownPerLf?: number;
  toeKickPerLf?: number;
  assemblyPerUnit?: number;
  installPerLf?: number;
  deliveryFlat?: number;

  // Combo pricing
  comboDiscountPct?: number;
}

interface LineItem {
  label: string;
  qty: number;
  unitPrice: number;
  total: number;
  category?: string;
}

/**
 * Fetch pricing profile from admin API
 */
async function fetchPricingProfile(category: string): Promise<PricingProfile> {
  const adminApiBase = process.env.ADMIN_API_BASE;
  if (!adminApiBase) {
    console.warn('⚠️ ADMIN_API_BASE not configured, using fallback pricing');
    return getFallbackPricing(category);
  }

  try {
    const endpoint = `${adminApiBase}/api/pricing/${category}`;
    console.log(`📡 Fetching pricing profile: ${endpoint}`);

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN || 'dev-token'}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(
        `⚠️ Failed to fetch pricing profile (${response.status}), using fallback`
      );
      return getFallbackPricing(category);
    }

    const profileData = await response.json();
    console.log(`✅ Pricing profile fetched for ${category}:`, profileData);

    return profileData.profile || profileData;
  } catch (error) {
    console.error(`❌ Error fetching pricing profile for ${category}:`, error);
    return getFallbackPricing(category);
  }
}

/**
 * Fallback pricing when admin API is not available
 */
function getFallbackPricing(category: string): PricingProfile {
  const fallbackPricing: Record<string, PricingProfile> = {
    countertop: {
      pricePerSqft: 65,
      edgeAdderLf: 12,
      sinkCutoutFee: 150,
      backsplashPerLf: 45,
      laborInstallBase: 800,
    },
    cabinet: {
      basePricePerLf: 180,
      wallPricePerLf: 160,
      tallUnitPrice: 450,
      drawerStackAdder: 120,
      crownPerLf: 25,
      toeKickPerLf: 15,
      assemblyPerUnit: 75,
      installPerLf: 85,
      deliveryFlat: 200,
    },
    combo: {
      comboDiscountPct: 10,
    },
  };

  return fallbackPricing[category] || {};
}

/**
 * Build countertop line items
 */
function buildCountertopItems(
  request: UnifiedQuoteRequest,
  profile: PricingProfile
): LineItem[] {
  const items: LineItem[] = [];
  const {
    sqft = 0,
    edgeProfile = 'straight',
    sinkCutouts = 0,
    backsplashLf = 0,
  } = request;

  if (sqft > 0) {
    // Material cost
    const materialCost = sqft * (profile.pricePerSqft || 65);
    items.push({
      label: `Countertop Material (${sqft} sq ft)`,
      qty: sqft,
      unitPrice: profile.pricePerSqft || 65,
      total: materialCost,
      category: 'countertop',
    });

    // Edge profile (estimate linear feet based on square footage)
    if (edgeProfile && edgeProfile !== 'straight') {
      const estLf = Math.ceil(sqft / 1.5); // Rough estimate of perimeter
      const edgeCost = estLf * (profile.edgeAdderLf || 12);
      items.push({
        label: `${edgeProfile} Edge Profile (${estLf} linear ft)`,
        qty: estLf,
        unitPrice: profile.edgeAdderLf || 12,
        total: edgeCost,
        category: 'countertop',
      });
    }
  }

  // Sink cutouts
  if (sinkCutouts > 0) {
    const sinkCost = sinkCutouts * (profile.sinkCutoutFee || 150);
    items.push({
      label: `Sink Cutout${sinkCutouts > 1 ? 's' : ''} (${sinkCutouts})`,
      qty: sinkCutouts,
      unitPrice: profile.sinkCutoutFee || 150,
      total: sinkCost,
      category: 'countertop',
    });
  }

  // Backsplash
  if (backsplashLf > 0) {
    const backsplashCost = backsplashLf * (profile.backsplashPerLf || 45);
    items.push({
      label: `Backsplash (${backsplashLf} linear ft)`,
      qty: backsplashLf,
      unitPrice: profile.backsplashPerLf || 45,
      total: backsplashCost,
      category: 'countertop',
    });
  }

  // Labor installation
  if (sqft > 0) {
    const laborCost = profile.laborInstallBase || 800;
    items.push({
      label: 'Countertop Installation',
      qty: 1,
      unitPrice: laborCost,
      total: laborCost,
      category: 'countertop',
    });
  }

  return items;
}

/**
 * Build cabinet line items
 */
function buildCabinetItems(
  request: UnifiedQuoteRequest,
  profile: PricingProfile
): LineItem[] {
  const items: LineItem[] = [];
  const { baseLf = 0, wallLf = 0, tallUnits = 0, drawerStacks = 0 } = request;

  // Base cabinets
  if (baseLf > 0) {
    const baseCost = baseLf * (profile.basePricePerLf || 180);
    items.push({
      label: `Base Cabinets (${baseLf} linear ft)`,
      qty: baseLf,
      unitPrice: profile.basePricePerLf || 180,
      total: baseCost,
      category: 'cabinet',
    });
  }

  // Wall cabinets
  if (wallLf > 0) {
    const wallCost = wallLf * (profile.wallPricePerLf || 160);
    items.push({
      label: `Wall Cabinets (${wallLf} linear ft)`,
      qty: wallLf,
      unitPrice: profile.wallPricePerLf || 160,
      total: wallCost,
      category: 'cabinet',
    });
  }

  // Tall units
  if (tallUnits > 0) {
    const tallCost = tallUnits * (profile.tallUnitPrice || 450);
    items.push({
      label: `Tall Units (${tallUnits})`,
      qty: tallUnits,
      unitPrice: profile.tallUnitPrice || 450,
      total: tallCost,
      category: 'cabinet',
    });
  }

  // Drawer stacks
  if (drawerStacks > 0) {
    const drawerCost = drawerStacks * (profile.drawerStackAdder || 120);
    items.push({
      label: `Drawer Stack Upgrade (${drawerStacks})`,
      qty: drawerStacks,
      unitPrice: profile.drawerStackAdder || 120,
      total: drawerCost,
      category: 'cabinet',
    });
  }

  // Crown molding
  const totalCabinetLf = baseLf + wallLf;
  if (totalCabinetLf > 0) {
    const crownCost = totalCabinetLf * (profile.crownPerLf || 25);
    items.push({
      label: `Crown Molding (${totalCabinetLf} linear ft)`,
      qty: totalCabinetLf,
      unitPrice: profile.crownPerLf || 25,
      total: crownCost,
      category: 'cabinet',
    });
  }

  // Toe kick
  if (baseLf > 0) {
    const toeKickCost = baseLf * (profile.toeKickPerLf || 15);
    items.push({
      label: `Toe Kick (${baseLf} linear ft)`,
      qty: baseLf,
      unitPrice: profile.toeKickPerLf || 15,
      total: toeKickCost,
      category: 'cabinet',
    });
  }

  // Assembly
  const totalUnits = tallUnits + drawerStacks;
  if (totalUnits > 0) {
    const assemblyCost = totalUnits * (profile.assemblyPerUnit || 75);
    items.push({
      label: `Assembly (${totalUnits} units)`,
      qty: totalUnits,
      unitPrice: profile.assemblyPerUnit || 75,
      total: assemblyCost,
      category: 'cabinet',
    });
  }

  // Installation
  if (totalCabinetLf > 0) {
    const installCost = totalCabinetLf * (profile.installPerLf || 85);
    items.push({
      label: `Cabinet Installation (${totalCabinetLf} linear ft)`,
      qty: totalCabinetLf,
      unitPrice: profile.installPerLf || 85,
      total: installCost,
      category: 'cabinet',
    });
  }

  // Delivery
  if (baseLf > 0 || wallLf > 0 || tallUnits > 0) {
    const deliveryCost = profile.deliveryFlat || 200;
    items.push({
      label: 'Delivery & Handling',
      qty: 1,
      unitPrice: deliveryCost,
      total: deliveryCost,
      category: 'cabinet',
    });
  }

  return items;
}

/**
 * Submit line items to admin API for quote creation
 */
async function submitQuoteToAdmin(
  lineItems: LineItem[],
  request: UnifiedQuoteRequest
): Promise<any> {
  const adminApiBase = process.env.ADMIN_API_BASE;
  if (!adminApiBase) {
    // Fallback: create quote locally (similar to existing AI quotes endpoint)
    return createFallbackQuote(lineItems, request);
  }

  try {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);

    const payload = {
      lineItems,
      category: request.category,
      measurements: {
        sqft: request.sqft,
        baseLf: request.baseLf,
        wallLf: request.wallLf,
        tallUnits: request.tallUnits,
        drawerStacks: request.drawerStacks,
        sinkCutouts: request.sinkCutouts,
        backsplashLf: request.backsplashLf,
      },
      products: request.products,
      zipcode: request.zipcode,
      website_id: request.website_id,
      session_id: request.session_id,
      subtotal,
    };

    console.log(
      `📡 Submitting quote to admin API: ${adminApiBase}/api/quotes/from-items`
    );

    const response = await fetch(`${adminApiBase}/api/quotes/from-items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN || 'dev-token'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Admin API error (${response.status}):`, errorText);
      return createFallbackQuote(lineItems, request);
    }

    const result = await response.json();
    console.log('✅ Quote created via admin API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error submitting to admin API:', error);
    return createFallbackQuote(lineItems, request);
  }
}

/**
 * Create quote locally when admin API is not available
 */
function createFallbackQuote(
  lineItems: LineItem[],
  request: UnifiedQuoteRequest
) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.085; // 8.5% default tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const quoteId = `UQ${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  console.log('📋 Created fallback quote:', { quoteId, subtotal, tax, total });

  return {
    quoteId,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    lineItems,
    category: request.category,
    taxRate,
    estimatedCompletion:
      request.category === 'combo' ? '4-6 weeks' : '2-3 weeks',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal API token
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN || 'dev-token';

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      console.error('❌ Unauthorized API call to quotes/build-unified');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = UnifiedQuoteSchema.safeParse(body);

    if (!validatedRequest.success) {
      console.error(
        '❌ Invalid unified quote request:',
        validatedRequest.error
      );
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedRequest.error.issues,
        },
        { status: 400 }
      );
    }

    const quoteRequest = validatedRequest.data;
    console.log('💰 Processing unified quote request:', quoteRequest);

    let allLineItems: LineItem[] = [];
    let comboProfile: PricingProfile = {};

    // Fetch pricing profiles and build line items based on category
    if (quoteRequest.category === 'countertop') {
      const profile = await fetchPricingProfile('countertop');
      allLineItems = buildCountertopItems(quoteRequest, profile);
    } else if (quoteRequest.category === 'cabinet') {
      const profile = await fetchPricingProfile('cabinet');
      allLineItems = buildCabinetItems(quoteRequest, profile);
    } else if (quoteRequest.category === 'combo') {
      // Fetch both profiles
      const [countertopProfile, cabinetProfile, comboSettings] =
        await Promise.all([
          fetchPricingProfile('countertop'),
          fetchPricingProfile('cabinet'),
          fetchPricingProfile('combo'),
        ]);

      // Build both sets of line items
      const countertopItems = buildCountertopItems(
        quoteRequest,
        countertopProfile
      );
      const cabinetItems = buildCabinetItems(quoteRequest, cabinetProfile);
      allLineItems = [...countertopItems, ...cabinetItems];
      comboProfile = comboSettings;
    }

    // Apply combo discount if applicable
    if (
      quoteRequest.category === 'combo' &&
      comboProfile.comboDiscountPct &&
      comboProfile.comboDiscountPct > 0
    ) {
      const subtotal = allLineItems.reduce((sum, item) => sum + item.total, 0);
      const discountAmount =
        Math.round(subtotal * (comboProfile.comboDiscountPct / 100) * 100) /
        100;

      allLineItems.push({
        label: `Combo Discount (${comboProfile.comboDiscountPct}%)`,
        qty: 1,
        unitPrice: -discountAmount,
        total: -discountAmount,
        category: 'discount',
      });
    }

    console.log('📊 Generated line items:', allLineItems);

    // Submit to admin API for final quote creation
    const quoteResult = await submitQuoteToAdmin(allLineItems, quoteRequest);

    console.log('✅ Unified quote generated successfully:', {
      quoteId: quoteResult.quoteId,
      category: quoteRequest.category,
      total: quoteResult.total,
    });

    return NextResponse.json(quoteResult);
  } catch (error) {
    console.error('❌ Error generating unified quote:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate unified quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
