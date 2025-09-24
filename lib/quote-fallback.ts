/**
 * Enhanced fallback mechanism for storing quote requests when the API is unavailable
 * with automatic retry functionality
 */

type QuoteData = {
  name: string;
  email: string;
  phone?: string;
  zipCode?: string;
  notes?: string;
  productId: string;
  productName: string;
  sku: string;
  timestamp: string;
  retryCount?: number;
  lastRetry?: string;
  images?: Array<{
    publicId: string;
    secureUrl: string;
    width?: number;
    height?: number;
  }>;
};

type QuoteSaveResult = {
  success: boolean;
  quoteId?: string;
  publicToken?: string;
};

const STORAGE_KEY = 'lux_pending_quotes';
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 60000; // 1 minute

/**
 * Store a quote request in local storage as a fallback
 * @returns {Promise<QuoteSaveResult>} Result with quoteId and publicToken if available
 */
export const storePendingQuote = async (
  quoteData: QuoteData
): Promise<QuoteSaveResult> => {
  try {
    if (typeof window === 'undefined') return { success: false };

    // Try to create a fallback request in the database first
    console.log('📤 Attempting to create fallback quote in database...');
    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      console.log('📤 Sending request to /api/quotes/fallback-create...');
      console.log('📤 Quote data:', {
        name: quoteData.name,
        email: quoteData.email,
        productId: quoteData.productId,
        productName: quoteData.productName,
      });

      const response = await fetch('/api/quotes/fallback-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('✅ Received response from fallback-create:', {
        status: response.status,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📄 Fallback API response:', result);

        if (result.success && result.quoteId && result.publicToken) {
          console.log(
            '✅ Created fallback quote request in database, ID:',
            result.quoteId
          );
          return {
            success: true,
            quoteId: result.quoteId,
            publicToken: result.publicToken,
          };
        } else {
          console.warn(
            '⚠️ Fallback API response missing expected data:',
            result
          );
        }
      } else {
        const errorText = await response.text().catch(() => 'No error details');
        console.error('❌ Fallback API error:', {
          status: response.status,
          error: errorText,
        });
      }
    } catch (dbError) {
      console.error('❌ Failed to create fallback quote in database:', dbError);
      // Continue with local storage fallback
    }

    console.log('🔄 Falling back to local storage...');

    // If database fallback failed, store locally
    // Generate a client-side uuid for tracking
    const clientId = crypto.randomUUID();

    // Get existing pending quotes
    const existingQuotesJSON = localStorage.getItem(STORAGE_KEY) || '[]';
    const existingQuotes = JSON.parse(existingQuotesJSON) as QuoteData[];

    // Add new quote with unique ID and retry information
    const newQuote = {
      ...quoteData,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      lastRetry: undefined, // Changed from null to undefined to match the type
      clientId,
    };

    existingQuotes.push(newQuote);

    // Store updated list
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingQuotes));

    console.log('Quote request stored locally as fallback');

    // Schedule a retry attempt
    scheduleRetry();

    return {
      success: true,
      // No actual quoteId or publicToken since this is just in localStorage
    };
  } catch (error) {
    console.error('Failed to store quote in local storage:', error);
    return { success: false };
  }
};

/**
 * Get all pending quotes from local storage
 */
export const getPendingQuotes = (): QuoteData[] => {
  try {
    if (typeof window === 'undefined') return [];

    const quotesJSON = localStorage.getItem(STORAGE_KEY) || '[]';
    return JSON.parse(quotesJSON) as QuoteData[];
  } catch (error) {
    console.error('Failed to retrieve quotes from local storage:', error);
    return [];
  }
};

/**
 * Remove a pending quote from local storage
 */
export const removePendingQuote = (timestamp: string): void => {
  try {
    if (typeof window === 'undefined') return;

    const quotes = getPendingQuotes();
    const updatedQuotes = quotes.filter(
      (quote) => quote.timestamp !== timestamp
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
    console.log(`Quote with timestamp ${timestamp} removed from local storage`);
  } catch (error) {
    console.error('Failed to remove quote from local storage:', error);
  }
};

/**
 * Update a pending quote in local storage
 */
export const updatePendingQuote = (
  timestamp: string,
  updates: Partial<QuoteData>
): void => {
  try {
    if (typeof window === 'undefined') return;

    const quotes = getPendingQuotes();
    const updatedQuotes = quotes.map((quote) => {
      if (quote.timestamp === timestamp) {
        return { ...quote, ...updates };
      }
      return quote;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
  } catch (error) {
    console.error('Failed to update quote in local storage:', error);
  }
};

/**
 * Schedule retry for pending quotes
 */
export const scheduleRetry = (): void => {
  if (typeof window === 'undefined') return;

  // Check if we already have a retry scheduled
  const hasRetryScheduled =
    localStorage.getItem('quote_retry_scheduled') === 'true';
  if (hasRetryScheduled) return;

  // Schedule retry
  localStorage.setItem('quote_retry_scheduled', 'true');

  // Set timeout to retry sending pending quotes
  setTimeout(() => {
    retryPendingQuotes();
    localStorage.removeItem('quote_retry_scheduled');
  }, RETRY_DELAY_MS);

  console.log(
    `Scheduled retry for pending quotes in ${RETRY_DELAY_MS / 1000} seconds`
  );
};

/**
 * Retry sending pending quotes to the admin API
 */
export const retryPendingQuotes = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  const pendingQuotes = getPendingQuotes();
  if (pendingQuotes.length === 0) return;

  console.log(`Attempting to retry ${pendingQuotes.length} pending quotes`);

  for (const quote of pendingQuotes) {
    // Skip quotes that have exceeded max retry count
    if ((quote.retryCount || 0) >= MAX_RETRIES) {
      console.log(
        `Quote ${quote.timestamp} has exceeded max retries (${MAX_RETRIES})`
      );
      continue;
    }

    try {
      // Prepare the retry
      const updatedQuote = {
        ...quote,
        retryCount: (quote.retryCount || 0) + 1,
        lastRetry: new Date().toISOString(),
      };

      // Update the quote in local storage
      updatePendingQuote(quote.timestamp, updatedQuote);

      // Attempt to send the quote
      const response = await fetch('/api/quotes/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(`Successfully retried quote ${quote.timestamp}`);
          removePendingQuote(quote.timestamp);
        }
      }
    } catch (error) {
      console.error(`Failed to retry quote ${quote.timestamp}:`, error);
    }
  }

  // Schedule another retry if there are still pending quotes
  const remainingQuotes = getPendingQuotes();
  if (remainingQuotes.length > 0) {
    scheduleRetry();
  }
};
