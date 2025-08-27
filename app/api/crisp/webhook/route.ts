import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendMessage, verifyCrispWebhookSignature } from '@/lib/crisp';

// Zod schema for Crisp webhook payload
const CrispWebhookSchema = z.object({
  website_id: z.string(),
  event: z.string(),
  data: z.object({
    type: z.string().optional(),
    content: z.string().optional(),
    from: z.string().optional(),
    origin: z.string().optional(),
    session_id: z.string().optional(),
    user: z
      .object({
        nickname: z.string().optional(),
        user_id: z.string().optional(),
      })
      .optional(),
  }),
  timestamp: z.number(),
});

// Zod schema for unified quote request data
const UnifiedQuoteRequestSchema = z.object({
  category: z.enum(['countertop', 'cabinet', 'combo']).optional(),

  // Countertop fields
  material: z.string().optional(),
  sqft: z.number().optional(),
  edgeProfile: z.string().optional(),
  sinkCutouts: z.number().optional(),
  backsplashLf: z.number().optional(),

  // Cabinet fields
  baseLf: z.number().optional(),
  wallLf: z.number().optional(),
  tallUnits: z.number().optional(),
  drawerStacks: z.number().optional(),

  // Common fields
  zipcode: z.string().optional(),
});

type UnifiedQuoteRequest = z.infer<typeof UnifiedQuoteRequestSchema>;

/**
 * Detect category from user message
 */
function detectCategory(
  message: string
): 'countertop' | 'cabinet' | 'combo' | null {
  const lowerMessage = message.toLowerCase();

  const countertopKeywords = [
    'countertop',
    'granite',
    'quartz',
    'marble',
    'surface',
    'backsplash',
  ];
  const cabinetKeywords = [
    'cabinet',
    'cupboard',
    'drawer',
    'pantry',
    'storage',
  ];
  const comboKeywords = [
    'both',
    'combo',
    'complete kitchen',
    'everything',
    'full remodel',
  ];

  // Check for combo first
  if (comboKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return 'combo';
  }

  const hasCountertopKeywords = countertopKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );
  const hasCabinetKeywords = cabinetKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  // If both types mentioned, it's a combo
  if (hasCountertopKeywords && hasCabinetKeywords) {
    return 'combo';
  }

  if (hasCountertopKeywords) return 'countertop';
  if (hasCabinetKeywords) return 'cabinet';

  return null;
}

/**
 * Parse user message to extract quote-related information
 * Enhanced for unified quote system
 */
function parseUnifiedQuoteRequest(message: string): UnifiedQuoteRequest {
  const lowerMessage = message.toLowerCase();
  const result: UnifiedQuoteRequest = {};

  // Detect category
  result.category = detectCategory(message);

  // COUNTERTOP PARSING

  // Extract square footage
  const sqftMatch = message.match(
    /(\d+(?:\.\d+)?)\s*(?:sq\s*ft|square\s*feet|sqft|sf)/i
  );
  if (sqftMatch) {
    result.sqft = parseFloat(sqftMatch[1]);
  }

  // Extract material type
  const materials = [
    'granite',
    'quartz',
    'marble',
    'quartzite',
    'limestone',
    'concrete',
    'butcher block',
    'wood',
  ];
  for (const material of materials) {
    if (lowerMessage.includes(material)) {
      result.material = material;
      break;
    }
  }

  // Extract edge profile
  const edgeProfiles = [
    'beveled',
    'bullnose',
    'ogee',
    'straight',
    'waterfall',
    'eased',
    'laminated',
  ];
  for (const edge of edgeProfiles) {
    if (lowerMessage.includes(edge)) {
      result.edgeProfile = edge;
      break;
    }
  }

  // Extract sink cutouts
  const sinkMatch = message.match(/(\d+)\s*sink/i);
  if (sinkMatch) {
    result.sinkCutouts = parseInt(sinkMatch[1]);
  } else if (lowerMessage.includes('sink')) {
    result.sinkCutouts = 1; // Default to 1 if sink mentioned but no number
  }

  // Extract backsplash linear feet
  const backsplashMatch = message.match(
    /(\d+(?:\.\d+)?)\s*(?:lf|linear\s*feet|lin\s*ft)\s*backsplash/i
  );
  if (backsplashMatch) {
    result.backsplashLf = parseFloat(backsplashMatch[1]);
  }

  // CABINET PARSING

  // Extract base cabinet linear feet
  const baseLfMatch = message.match(
    /(\d+(?:\.\d+)?)\s*(?:lf|linear\s*feet|lin\s*ft)?\s*(?:of\s*)?base\s*(?:cabinet|cab)/i
  );
  if (baseLfMatch) {
    result.baseLf = parseFloat(baseLfMatch[1]);
  }

  // Extract wall cabinet linear feet
  const wallLfMatch = message.match(
    /(\d+(?:\.\d+)?)\s*(?:lf|linear\s*feet|lin\s*ft)?\s*(?:of\s*)?wall\s*(?:cabinet|cab)/i
  );
  if (wallLfMatch) {
    result.wallLf = parseFloat(wallLfMatch[1]);
  }

  // Extract tall units
  const tallUnitsMatch = message.match(
    /(\d+)\s*tall\s*(?:unit|cabinet|pantry)/i
  );
  if (tallUnitsMatch) {
    result.tallUnits = parseInt(tallUnitsMatch[1]);
  }

  // Extract drawer stacks
  const drawerStacksMatch = message.match(/(\d+)\s*drawer\s*(?:stack|unit)/i);
  if (drawerStacksMatch) {
    result.drawerStacks = parseInt(drawerStacksMatch[1]);
  }

  // General linear feet parsing (fallback for cabinet measurements)
  if (!result.baseLf && !result.wallLf) {
    const generalLfMatch = message.match(
      /(\d+(?:\.\d+)?)\s*(?:lf|linear\s*feet|lin\s*ft)/i
    );
    if (generalLfMatch && result.category === 'cabinet') {
      // Assume it's base cabinet linear feet if category is cabinet
      result.baseLf = parseFloat(generalLfMatch[1]);
    }
  }

  // Extract ZIP code
  const zipMatch = message.match(/\b(\d{5}(?:-\d{4})?)\b/);
  if (zipMatch) {
    result.zipcode = zipMatch[1];
  }

  return result;
}

/**
 * Check if the message contains quote-related intent
 */
function hasQuoteIntent(message: string): boolean {
  const quoteKeywords = [
    'quote',
    'estimate',
    'price',
    'cost',
    'pricing',
    'how much',
    'countertop',
    'cabinet',
    'installation',
    'material',
    'granite',
    'quartz',
    'marble',
    'kitchen',
    'bathroom',
    'remodel',
  ];

  const lowerMessage = message.toLowerCase();
  return quoteKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Generate follow-up questions for missing required information
 */
function generateUnifiedFollowUpQuestion(
  quoteData: UnifiedQuoteRequest
): string | null {
  // First, check if category is known
  if (!quoteData.category) {
    return 'Are you looking for a quote for **Countertops**, **Cabinets**, or **Both**? This helps me ask the right questions! 🏠';
  }

  // Category-specific follow-up questions
  if (quoteData.category === 'countertop') {
    if (!quoteData.material) {
      return 'What type of countertop material are you interested in? We work with granite, quartz, marble, quartzite, and other premium materials. 🪨';
    }
    if (!quoteData.sqft) {
      return "What's the approximate square footage for your countertops? This helps us provide an accurate estimate. 📏";
    }
  }

  if (quoteData.category === 'cabinet') {
    if (!quoteData.baseLf && !quoteData.wallLf) {
      return 'How many linear feet of cabinets do you need? For example: "12 linear feet of base cabinets and 10 linear feet of wall cabinets". 📐';
    }
  }

  if (quoteData.category === 'combo') {
    // Check countertop requirements
    if (!quoteData.sqft) {
      return "Let's start with countertops - what's the approximate square footage you need? 📏";
    }
    if (!quoteData.material) {
      return 'What type of countertop material are you interested in? We work with granite, quartz, marble, quartzite, and other premium materials. 🪨';
    }
    // Check cabinet requirements
    if (!quoteData.baseLf && !quoteData.wallLf) {
      return 'Now for cabinets - how many linear feet do you need? For example: "12 linear feet of base cabinets and 10 linear feet of wall cabinets". 📐';
    }
  }

  return null; // All required info is present
}

/**
 * Format a quote response message
 */
function formatQuoteResponse(quoteData: any, sessionId: string): string {
  const { quoteId, subtotal, tax, total, lineItems } = quoteData;

  let message = `🎉 Great news! Your estimate is ready!\n\n`;
  message += `**Quote #${quoteId}**\n`;
  message += `**Total: $${total.toFixed(2)}**\n\n`;

  if (lineItems && lineItems.length > 0) {
    message += `**Details:**\n`;
    lineItems.forEach((item: any) => {
      message += `• ${item.description}: $${item.amount.toFixed(2)}\n`;
    });
    message += `\n`;
  }

  message += `View full details: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/quote/${quoteId}?c=${sessionId}\n\n`;
  message += `Questions? Our team is here to help! 💬`;

  return message;
}

export async function POST(request: NextRequest) {
  try {
    // Read the raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature if secret is configured
    if (process.env.CRISP_WEBHOOK_SECRET) {
      const signature = request.headers.get('x-crisp-signature');
      if (!signature) {
        console.error('❌ Missing X-Crisp-Signature header');
        return NextResponse.json(
          { error: 'Missing signature' },
          { status: 401 }
        );
      }

      const isValid = verifyCrispWebhookSignature(
        rawBody,
        signature,
        process.env.CRISP_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse the webhook payload
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
    } catch (error) {
      console.error('❌ Invalid JSON payload:', error);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate payload structure
    const validatedPayload = CrispWebhookSchema.safeParse(webhookData);
    if (!validatedPayload.success) {
      console.error(
        '❌ Invalid webhook payload structure:',
        validatedPayload.error
      );
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    const { website_id, event, data, timestamp } = validatedPayload.data;

    console.log(
      `📥 Received Crisp webhook: ${event} from website ${website_id}`
    );

    // Only process text messages from users
    if (
      event !== 'message:send' ||
      data.type !== 'text' ||
      data.from !== 'user'
    ) {
      console.log(
        `ℹ️ Ignoring event: ${event} (type: ${data.type}, from: ${data.from})`
      );
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    // Check if message has quote intent
    const messageContent = data.content || '';
    if (!hasQuoteIntent(messageContent)) {
      console.log(
        `ℹ️ No quote intent detected in message: "${messageContent}"`
      );
      return NextResponse.json({
        success: true,
        message: 'No quote intent detected',
      });
    }

    const sessionId = data.session_id;
    if (!sessionId) {
      console.error('❌ Missing session_id in webhook data');
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    console.log(
      `🤖 Processing quote request from session ${sessionId}: "${messageContent}"`
    );

    // Parse the message for quote-related information using unified system
    const quoteData = parseUnifiedQuoteRequest(messageContent);
    console.log('📋 Parsed unified quote data:', quoteData);

    // Check if we need more information
    const followUpQuestion = generateUnifiedFollowUpQuestion(quoteData);
    if (followUpQuestion) {
      console.log(
        `❓ Missing required info, sending follow-up: ${followUpQuestion}`
      );

      try {
        await sendMessage(website_id, sessionId, followUpQuestion);
        return NextResponse.json({
          success: true,
          message: 'Follow-up question sent',
          action: 'follow_up_sent',
        });
      } catch (error) {
        console.error('❌ Failed to send follow-up message:', error);
        return NextResponse.json(
          { error: 'Failed to send follow-up' },
          { status: 500 }
        );
      }
    }

    // All required information is present, generate quote
    console.log('💰 Generating quote with complete information...');

    try {
      // Call the unified quote generation endpoint
      const quoteResponse = await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/quotes/build-unified`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN || 'dev-token'}`,
          },
          body: JSON.stringify({
            ...quoteData,
            website_id,
            session_id: sessionId,
          }),
        }
      );

      if (!quoteResponse.ok) {
        throw new Error(`Quote API returned ${quoteResponse.status}`);
      }

      const quoteResult = await quoteResponse.json();
      console.log('✅ Quote generated:', quoteResult);

      // Send the quote back to the user via Crisp
      const responseMessage = formatQuoteResponse(quoteResult, sessionId);
      await sendMessage(website_id, sessionId, responseMessage);

      return NextResponse.json({
        success: true,
        message: 'Quote generated and sent',
        quoteId: quoteResult.quoteId,
        action: 'quote_sent',
      });
    } catch (error) {
      console.error('❌ Failed to generate or send quote:', error);

      // Send an error message to the user
      const errorMessage =
        "I'm having trouble generating your quote right now. Please try again in a moment, or contact our team directly for assistance! 🛠️";

      try {
        await sendMessage(website_id, sessionId, errorMessage);
      } catch (sendError) {
        console.error('❌ Failed to send error message:', sendError);
      }

      return NextResponse.json(
        { error: 'Failed to generate quote' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
