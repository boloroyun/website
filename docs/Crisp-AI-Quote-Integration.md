# Crisp AI Quote Maker Integration

This document describes the AI Quote Maker integration with Crisp chat for LUX Cabinets & Stones.

## Overview

The integration allows customers to request quotes directly through the Crisp chat widget. When users mention keywords related to quotes or countertops, the system automatically:

1. **Parses the request** for material type, square footage, and other specifications
2. **Asks follow-up questions** if required information is missing
3. **Generates a quote** with itemized pricing
4. **Sends the quote back** through the chat with a link to view full details

## Architecture

### Components

- **Webhook Handler**: `/app/api/crisp/webhook/route.ts` - Processes incoming Crisp messages
- **Unified Quote Engine**: `/app/api/quotes/build-unified/route.ts` - Generates pricing estimates for countertops, cabinets, or combo projects
- **Legacy Quote Engine**: `/app/api/quotes/ai/route.ts` - Original countertop-only pricing estimates
- **Quote Display**: `/app/quote/[id]/page.tsx` - Shows detailed quote information
- **Crisp Helper**: `/lib/crisp.ts` - Handles Crisp API communication
- **Health Check**: `/app/api/health/route.ts` - System status monitoring

### Workflow

1. **Message Reception**: Crisp sends webhook when user sends a message
2. **Intent Detection**: System checks if message contains quote-related keywords
3. **Category Detection**: Determines if request is for countertops, cabinets, or both
4. **Information Extraction**: Parses message for measurements, materials, and specifications
5. **Validation**: Checks if required information is present for the detected category
6. **Follow-up or Quote**: Either asks category-specific questions or generates unified quote
7. **Response**: Sends formatted response back through Crisp chat with quote details

## Configuration

### Environment Variables

Add these to your `.env.local`:

```bash
# Crisp Integration
CRISP_IDENTIFIER=your_crisp_plugin_identifier
CRISP_KEY=your_crisp_plugin_key
CRISP_WEBSITE_ID=your_crisp_website_id
CRISP_WEBHOOK_SECRET=your_webhook_secret_optional

# Admin API Integration
ADMIN_API_BASE=https://your-admin-api-domain.com
INTERNAL_API_TOKEN=your_internal_token_for_api_calls
```

### Crisp Setup

1. **Create Plugin**: In Crisp dashboard, go to Plugins → Create Plugin
2. **Get Credentials**: Note down the plugin identifier and API key
3. **Configure Webhook**:
   - URL: `https://yourdomain.com/api/crisp/webhook`
   - Events: `message:send`
   - Secret: Set if you want signature verification

## Supported Features

### Material Detection

- Granite, Quartz, Marble, Quartzite
- Limestone, Concrete, Butcher Block, Wood

### Specifications

- **Square Footage**: Automatically detects "30 sq ft", "45 sqft", etc.
- **Edge Profiles**: Bullnose, Ogee, Beveled, Waterfall, etc.
- **Sink Cutouts**: Detects "1 sink", "2 sinks", etc.
- **Backsplash**: Linear feet measurements
- **ZIP Code**: For location-based pricing

### Quote Generation

- **Base Pricing**: Material cost per square foot
- **Edge Profile**: Additional cost based on complexity
- **Installation**: Professional installation cost (25% of materials)
- **Tax Calculation**: Location-based tax rates
- **Line Items**: Detailed breakdown of all costs

## Example Interactions

### Complete Request

**User**: "I need a quote for granite countertops 45 sq ft with bullnose edge and 1 sink cutout in 20151"

**System Response**:

```
🎉 Great news! Your estimate is ready!

**Quote #Q1629384756ABC**
**Total: $3,878.88**

**Details:**
• Granite Countertop (45 sq ft): $2,925.00
• Bullnose Edge Profile: $240.00
• Sink Cutout (1): $150.00
• Professional Installation: $965.25

View full details: https://yourdomain.com/quote/Q1629384756ABC?c=session-456

Questions? Our team is here to help! 💬
```

### Incomplete Request

**User**: "I need a quote for my kitchen"

**System Response**: "What type of material are you interested in? We work with granite, quartz, marble, quartzite, and other premium materials. 🪨"

## API Endpoints

### Health Check

```
GET /api/health
```

Returns system status and configuration state.

### Webhook Processor

```
POST /api/crisp/webhook
```

Processes incoming Crisp webhook events.

### AI Quote Generator

```
POST /api/quotes/ai
Authorization: Bearer {INTERNAL_API_TOKEN}
```

Generates quotes based on parsed requirements.

### Quote Display

```
GET /quote/{quoteId}
```

Shows detailed quote information with pricing breakdown.

## Testing

The integration includes comprehensive error handling and testing:

- **Intent Detection**: Ignores non-quote messages
- **Validation**: Checks for required information
- **Error Handling**: Graceful fallbacks for API failures
- **Security**: HMAC signature verification (optional)
- **Logging**: Detailed console logging for debugging

## Security

- **Webhook Signatures**: Optional HMAC verification
- **Internal API**: Bearer token authentication
- **Rate Limiting**: Built-in Next.js protection
- **Input Validation**: Zod schema validation
- **CORS**: Properly configured for Crisp domain

## Monitoring

- **Health Endpoint**: Monitor system status
- **Logging**: Comprehensive request/response logging
- **Error Tracking**: Detailed error messages and stack traces
- **Quote Storage**: All quotes stored for reference and analytics

## Next Steps

1. **Configure Crisp Credentials**: Set up plugin and webhook
2. **Test Integration**: Use real Crisp conversations
3. **Customize Pricing**: Adjust pricing logic for your business
4. **Add Analytics**: Track quote conversion rates
5. **Enhance NLP**: Improve message parsing with advanced models
