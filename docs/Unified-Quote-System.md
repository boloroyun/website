# Unified Quote System Documentation

This document describes the unified quote builder system that supports countertop, cabinet, and combo projects for LUX Cabinets & Stones.

## Overview

The unified quote system provides a single API endpoint that can generate quotes for:

- **Countertops**: Material, square footage, edge profiles, cutouts, backsplash
- **Cabinets**: Base/wall linear feet, tall units, drawer stacks, accessories
- **Combo**: Both countertops and cabinets with automatic discount pricing

## API Endpoint

### POST `/api/quotes/build-unified`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {INTERNAL_API_TOKEN}
```

**Request Body:**

```typescript
{
  category: "countertop" | "cabinet" | "combo",

  // Optional products from CMS
  products?: Array<{ id: string, qty?: number }>,

  // Countertop measurements
  sqft?: number,
  edgeProfile?: string,
  sinkCutouts?: number,
  backsplashLf?: number,

  // Cabinet measurements
  baseLf?: number,
  wallLf?: number,
  tallUnits?: number,
  drawerStacks?: number,

  // Common fields
  zipcode?: string,
  website_id?: string,  // Crisp integration
  session_id?: string   // Crisp integration
}
```

**Response:**

```typescript
{
  quoteId: string,
  subtotal: number,
  tax: number,
  total: number,
  lineItems: Array<{
    label: string,
    qty: number,
    unitPrice: number,
    total: number,
    category: string
  }>,
  category: string,
  taxRate: number,
  estimatedCompletion: string,
  validUntil: string
}
```

## Pricing Logic

### Countertop Pricing

- **Material Cost**: `sqft × pricePerSqft`
- **Edge Profile**: `estimatedLinearFeet × edgeAdderLf`
- **Sink Cutouts**: `sinkCutouts × sinkCutoutFee`
- **Backsplash**: `backsplashLf × backsplashPerLf`
- **Installation**: `laborInstallBase` (flat fee)

### Cabinet Pricing

- **Base Cabinets**: `baseLf × basePricePerLf`
- **Wall Cabinets**: `wallLf × wallPricePerLf`
- **Tall Units**: `tallUnits × tallUnitPrice`
- **Drawer Stacks**: `drawerStacks × drawerStackAdder`
- **Crown Molding**: `(baseLf + wallLf) × crownPerLf`
- **Toe Kick**: `baseLf × toeKickPerLf`
- **Assembly**: `(tallUnits + drawerStacks) × assemblyPerUnit`
- **Installation**: `(baseLf + wallLf) × installPerLf`
- **Delivery**: `deliveryFlat` (flat fee)

### Combo Pricing

- Includes all countertop and cabinet line items
- Applies percentage discount: `subtotal × (comboDiscountPct / 100)`
- Discount appears as negative line item

## Admin API Integration

The system can fetch pricing profiles from an admin API:

### Pricing Profile Endpoints

- `GET /api/pricing/countertop` - Countertop pricing configuration
- `GET /api/pricing/cabinet` - Cabinet pricing configuration
- `GET /api/pricing/combo` - Combo discount configuration

### Quote Submission

- `POST /api/quotes/from-items` - Submit line items for final quote creation

If admin API is not available, the system uses fallback pricing.

## UI Components

### QuoteRequestModal

A comprehensive modal component that supports all three categories:

```typescript
import QuoteRequestModal from '@/components/QuoteRequestModal';

<QuoteRequestModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  initialCategory="countertop" // or "cabinet" or "combo"
  productIds={["product-1", "product-2"]} // optional
/>
```

### QuoteRequestButton

A simple button that opens the quote request modal:

```typescript
import QuoteRequestButton from '@/components/QuoteRequestButton';

<QuoteRequestButton
  category="combo"
  productIds={selectedProducts}
  variant="default"
  size="lg"
>
  Get Complete Quote
</QuoteRequestButton>
```

### useQuoteRequest Hook

For programmatic quote generation:

```typescript
import { useQuoteRequest } from '@/hooks/useQuoteRequest';

const { submitQuoteRequest, isLoading, error } = useQuoteRequest();

const quoteId = await submitQuoteRequest({
  category: 'countertop',
  sqft: 35,
  material: 'quartz',
  edgeProfile: 'bullnose',
  sinkCutouts: 1,
  zipcode: '20151',
});
```

## Crisp Integration

The enhanced Crisp webhook now supports category detection and unified quotes:

### Category Detection

- **Countertop Keywords**: countertop, granite, quartz, marble, surface, backsplash
- **Cabinet Keywords**: cabinet, cupboard, drawer, pantry, storage
- **Combo Keywords**: both, combo, complete kitchen, everything, full remodel

### Enhanced Parsing

- Detects cabinet measurements: "12 linear feet of base cabinets"
- Handles multiple categories in one message
- Provides category-specific follow-up questions

### Example Interactions

**Countertop Request:**

```
User: "I need a quote for granite countertops 35 sq ft with bullnose edge"
Bot: Generates complete countertop quote with installation
```

**Cabinet Request:**

```
User: "I want cabinets - 12 linear feet base and 10 linear feet wall"
Bot: Generates cabinet quote with all accessories and installation
```

**Combo Request:**

```
User: "I need both countertops and cabinets for my kitchen remodel"
Bot: "Let's start with countertops - what's the approximate square footage?"
User: "45 sq ft quartz"
Bot: "Now for cabinets - how many linear feet do you need?"
User: "15 lf base and 12 lf wall"
Bot: Generates combo quote with discount
```

**Ambiguous Request:**

```
User: "I need a quote for my kitchen"
Bot: "Are you looking for a quote for Countertops, Cabinets, or Both?"
```

## Example Quotes

### Countertop Quote

```json
{
  "category": "countertop",
  "sqft": 35,
  "material": "quartz",
  "edgeProfile": "bullnose",
  "sinkCutouts": 1
}
```

**Result:** $3,811.61 (Material: $2,275, Edge: $280, Cutout: $150, Installation: $800)

### Cabinet Quote

```json
{
  "category": "cabinet",
  "baseLf": 12,
  "wallLf": 10,
  "tallUnits": 1,
  "drawerStacks": 2
}
```

**Result:** $6,918.25 (Base: $2,160, Wall: $1,600, Tall: $450, Drawer: $240, + accessories & installation)

### Combo Quote

```json
{
  "category": "combo",
  "sqft": 30,
  "material": "granite",
  "baseLf": 10,
  "wallLf": 8,
  "tallUnits": 1
}
```

**Result:** $8,627.38 (Countertop + Cabinet items with 10% combo discount)

## Configuration

### Environment Variables

```bash
# Admin API Integration
ADMIN_API_BASE=https://your-admin-api-domain.com
INTERNAL_API_TOKEN=your_internal_token_for_api_calls

# Crisp Integration (for webhook)
CRISP_IDENTIFIER=your_crisp_plugin_identifier
CRISP_KEY=your_crisp_plugin_key
CRISP_WEBSITE_ID=your_crisp_website_id
```

### Fallback Pricing

If admin API is not configured, the system uses these default rates:

**Countertop:**

- Price per sq ft: $65
- Edge adder: $12/lf
- Sink cutout: $150 each
- Backsplash: $45/lf
- Installation: $800 flat

**Cabinet:**

- Base cabinets: $180/lf
- Wall cabinets: $160/lf
- Tall units: $450 each
- Drawer stacks: $120 each
- Installation: $85/lf
- Delivery: $200 flat

**Combo:**

- Discount: 10% of subtotal

## Testing

Run comprehensive tests with:

```bash
# Test all quote categories
curl -X POST http://localhost:3000/api/quotes/build-unified \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-token" \
  -d '{"category": "combo", "sqft": 30, "material": "quartz", "baseLf": 10}'
```

## Security

- API requires `Authorization: Bearer {token}` header
- Input validation using Zod schemas
- Sanitized user inputs in Crisp webhook
- Rate limiting through Next.js built-in protection
