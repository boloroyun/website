import { Crisp } from 'crisp-api';

// Initialize Crisp client
let crispClient: Crisp | null = null;

function initializeCrispClient(): Crisp {
  if (!crispClient) {
    if (!process.env.CRISP_IDENTIFIER || !process.env.CRISP_KEY) {
      throw new Error(
        'CRISP_IDENTIFIER and CRISP_KEY must be set in environment variables'
      );
    }

    crispClient = new Crisp();

    // Authenticate with Crisp API using plugin credentials
    crispClient.authenticateTier(
      'plugin',
      process.env.CRISP_IDENTIFIER,
      process.env.CRISP_KEY
    );

    console.log('✅ Crisp client initialized');
  }

  return crispClient;
}

/**
 * Send a text message to a Crisp conversation
 * @param websiteId - The Crisp website ID
 * @param sessionId - The conversation session ID
 * @param content - The message content to send
 * @returns Promise resolving to the API response
 */
export async function sendMessage(
  websiteId: string,
  sessionId: string,
  content: string
): Promise<any> {
  try {
    const client = initializeCrispClient();

    console.log(
      `📤 Sending message to Crisp conversation ${sessionId}:`,
      content
    );

    const response = await client.website.sendMessageInConversation(
      websiteId,
      sessionId,
      {
        type: 'text',
        from: 'operator',
        origin: 'chat',
        content: content,
      }
    );

    console.log('✅ Message sent successfully via Crisp');
    return response;
  } catch (error) {
    console.error('❌ Failed to send message via Crisp:', error);
    throw error;
  }
}

/**
 * Verify Crisp webhook signature (if webhook secret is configured)
 * @param payload - The raw webhook payload
 * @param signature - The X-Crisp-Signature header value
 * @param secret - The webhook secret
 * @returns boolean indicating if signature is valid
 */
export function verifyCrispWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Crisp sends signature in format: sha256=<hash>
    const formattedExpected = `sha256=${expectedSignature}`;

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(formattedExpected)
    );
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Check if Crisp credentials are properly configured
 * @returns boolean indicating if credentials are set
 */
export function isCrispConfigured(): boolean {
  return !!(
    process.env.CRISP_IDENTIFIER &&
    process.env.CRISP_KEY &&
    process.env.CRISP_WEBSITE_ID
  );
}

/**
 * Get the configured Crisp website ID
 * @returns string website ID or throws error if not configured
 */
export function getCrispWebsiteId(): string {
  if (!process.env.CRISP_WEBSITE_ID) {
    throw new Error('CRISP_WEBSITE_ID must be set in environment variables');
  }
  return process.env.CRISP_WEBSITE_ID;
}
