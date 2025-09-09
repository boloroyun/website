'use client';

/**
 * Type-safe Crisp Events Module
 *
 * This module provides consistent, type-safe event tracking for Crisp chat analytics.
 * It can be used across both Website and Admin applications with full TypeScript support.
 *
 * Usage:
 * ```typescript
 * import { emitCrispEvent, CRISP_EVENTS, openCrispChat } from '@/lib/crisp-events';
 *
 * // Type-safe event emission
 * emitCrispEvent({
 *   name: CRISP_EVENTS.Quote.OPENED,
 *   data: { source: 'product_page', productId: 'prod_123' }
 * });
 * ```
 */

// =============================================================================
// EVENT CONSTANTS
// =============================================================================

/**
 * Crisp event names organized by category
 * Use these constants to ensure consistency across the application
 */
export const CRISP_EVENTS = {
  Quote: {
    OPENED: 'quote_opened',
    STEP_CHANGED: 'quote_step_changed',
    UPLOAD_ADDED: 'quote_upload_added',
    DRAFT_SAVED: 'quote_draft_saved',
    SUBMITTED: 'quote_submitted',
  },
  Payment: {
    INVOICE_VIEWED: 'invoice_viewed',
    STARTED: 'payment_started',
    SUCCEEDED: 'payment_succeeded',
    FAILED: 'payment_failed',
  },
  General: {
    CONTACT_CLICKED: 'contact_clicked',
    CTA_CLICKED: 'cta_clicked',
  },
} as const;

// =============================================================================
// TYPESCRIPT INTERFACES
// =============================================================================

/**
 * Quote Events
 */
export interface QuoteOpened {
  source: 'product_page' | 'homepage' | 'campaign' | 'direct';
  productId?: string;
  quoteId?: string;
}

export interface QuoteStepChanged {
  quoteId?: string;
  step: number;
  stepKey: 'material' | 'dimensions' | 'photos' | 'summary';
}

export interface QuoteUploadAdded {
  quoteId?: string;
  fileCount: number;
  types: string[];
  totalMB: number;
}

export interface QuoteDraftSaved {
  quoteId: string;
  itemsCount?: number;
  total?: number;
}

export interface QuoteSubmitted {
  quoteId: string;
  itemsCount: number;
  total?: number;
  city?: string;
  zipcode?: string;
}

/**
 * Payment Events
 */
export interface InvoiceViewed {
  invoiceId: string;
  quoteId?: string;
}

export interface PaymentStarted {
  provider: 'stripe' | 'razorpay';
  amount: number;
  currency: string;
  invoiceId: string;
  quoteId?: string;
}

export interface PaymentSucceeded {
  provider: 'stripe' | 'razorpay';
  amount: number;
  currency: string;
  invoiceId: string;
  quoteId?: string;
  paymentId?: string;
}

export interface PaymentFailed {
  provider: 'stripe' | 'razorpay';
  invoiceId: string;
  quoteId?: string;
  errorCode?: string;
  message?: string;
}

/**
 * General Events
 */
export interface ContactClicked {
  location: string;
  channel: 'phone' | 'email' | 'messenger' | 'whatsapp';
}

export interface CtaClicked {
  location: string;
  label: string;
}

// =============================================================================
// DISCRIMINATED UNION TYPE
// =============================================================================

/**
 * Discriminated union of all possible Crisp events
 * This ensures type safety when emitting events
 */
export type CrispEvent =
  | { name: typeof CRISP_EVENTS.Quote.OPENED; data: QuoteOpened }
  | { name: typeof CRISP_EVENTS.Quote.STEP_CHANGED; data: QuoteStepChanged }
  | { name: typeof CRISP_EVENTS.Quote.UPLOAD_ADDED; data: QuoteUploadAdded }
  | { name: typeof CRISP_EVENTS.Quote.DRAFT_SAVED; data: QuoteDraftSaved }
  | { name: typeof CRISP_EVENTS.Quote.SUBMITTED; data: QuoteSubmitted }
  | { name: typeof CRISP_EVENTS.Payment.INVOICE_VIEWED; data: InvoiceViewed }
  | { name: typeof CRISP_EVENTS.Payment.STARTED; data: PaymentStarted }
  | { name: typeof CRISP_EVENTS.Payment.SUCCEEDED; data: PaymentSucceeded }
  | { name: typeof CRISP_EVENTS.Payment.FAILED; data: PaymentFailed }
  | { name: typeof CRISP_EVENTS.General.CONTACT_CLICKED; data: ContactClicked }
  | { name: typeof CRISP_EVENTS.General.CTA_CLICKED; data: CtaClicked };

// =============================================================================
// CRISP INTEGRATION
// =============================================================================

/**
 * Extend window interface for Crisp
 * Note: This matches the declaration in lib/crisp-client.ts
 */
declare global {
  interface Window {
    $crisp: any[];
  }
}

/**
 * Check if Crisp is loaded and available
 */
function isCrispAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.$crisp &&
    Array.isArray(window.$crisp)
  );
}

/**
 * Initialize Crisp if not already available
 */
function ensureCrispInitialized(): void {
  if (typeof window !== 'undefined' && !window.$crisp) {
    window.$crisp = [];
  }
}

// =============================================================================
// SAFE EVENT EMITTER
// =============================================================================

/**
 * Type-safe Crisp event emitter
 *
 * @param evt - The event object with name and data
 *
 * @example
 * ```typescript
 * // Quote opened event
 * emitCrispEvent({
 *   name: CRISP_EVENTS.Quote.OPENED,
 *   data: { source: 'product_page', productId: 'prod_123' }
 * });
 *
 * // Payment succeeded event
 * emitCrispEvent({
 *   name: CRISP_EVENTS.Payment.SUCCEEDED,
 *   data: {
 *     provider: 'stripe',
 *     amount: 2500,
 *     currency: 'USD',
 *     invoiceId: 'inv_123',
 *     paymentId: 'pi_456'
 *   }
 * });
 * ```
 */
export function emitCrispEvent<E extends CrispEvent>(evt: E): void {
  // Skip if running on server
  if (typeof window === 'undefined') {
    console.warn('emitCrispEvent called on server side, ignoring');
    return;
  }

  // Ensure Crisp is initialized
  ensureCrispInitialized();

  try {
    // Add timestamp to event data
    const eventData = {
      ...evt.data,
      timestamp: new Date().toISOString(),
    };

    // Push event to Crisp
    window.$crisp.push(['set', 'session:event', [[evt.name, eventData]]]);

    console.log('✅ Crisp event emitted:', evt.name, eventData);
  } catch (error) {
    console.error('❌ Failed to emit Crisp event:', error);
  }
}

// =============================================================================
// CHAT CONTROLS
// =============================================================================

/**
 * Open Crisp chat widget programmatically
 *
 * @example
 * ```typescript
 * import { openCrispChat } from '@/lib/crisp-events';
 *
 * const handleSupportClick = () => {
 *   openCrispChat();
 * };
 * ```
 */
export function openCrispChat(): void {
  if (typeof window === 'undefined') {
    console.warn('openCrispChat called on server side, ignoring');
    return;
  }

  if (!isCrispAvailable()) {
    console.warn('Crisp not available, cannot open chat');
    return;
  }

  try {
    window.$crisp.push(['do', 'chat:open']);
    console.log('✅ Crisp chat opened');
  } catch (error) {
    console.error('❌ Failed to open Crisp chat:', error);
  }
}

/**
 * Close Crisp chat widget programmatically
 */
export function closeCrispChat(): void {
  if (typeof window === 'undefined') {
    console.warn('closeCrispChat called on server side, ignoring');
    return;
  }

  if (!isCrispAvailable()) {
    console.warn('Crisp not available, cannot close chat');
    return;
  }

  try {
    window.$crisp.push(['do', 'chat:close']);
    console.log('✅ Crisp chat closed');
  } catch (error) {
    console.error('❌ Failed to close Crisp chat:', error);
  }
}

/**
 * Set quote submission flag for campaign targeting
 * This allows Crisp campaigns to target users who have submitted quotes
 */
export function setQuoteSubmittedFlag(): void {
  if (typeof window === 'undefined') {
    console.warn('setQuoteSubmittedFlag called on server side, ignoring');
    return;
  }

  if (!isCrispAvailable()) {
    console.warn('Crisp not available, cannot set quote submitted flag');
    return;
  }

  try {
    window.$crisp.push([
      'set',
      'session:data',
      [['has_submitted_quote', 'true']],
    ]);
    console.log('✅ Crisp quote submitted flag set for campaign targeting');
  } catch (error) {
    console.error('❌ Failed to set Crisp quote submitted flag:', error);
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Convenience functions for common events
 * These provide a simpler API for frequently used events
 */
export const crispEvents = {
  /**
   * Track quote opening
   */
  quoteOpened: (data: QuoteOpened) => {
    emitCrispEvent({
      name: CRISP_EVENTS.Quote.OPENED,
      data,
    });
  },

  /**
   * Track quote submission
   */
  quoteSubmitted: (data: QuoteSubmitted) => {
    emitCrispEvent({
      name: CRISP_EVENTS.Quote.SUBMITTED,
      data,
    });
  },

  /**
   * Track payment success
   */
  paymentSucceeded: (data: PaymentSucceeded) => {
    emitCrispEvent({
      name: CRISP_EVENTS.Payment.SUCCEEDED,
      data,
    });
  },

  /**
   * Track contact clicks
   */
  contactClicked: (data: ContactClicked) => {
    emitCrispEvent({
      name: CRISP_EVENTS.General.CONTACT_CLICKED,
      data,
    });
  },

  /**
   * Track CTA clicks
   */
  ctaClicked: (data: CtaClicked) => {
    emitCrispEvent({
      name: CRISP_EVENTS.General.CTA_CLICKED,
      data,
    });
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

/**
 * All types are already exported when declared above
 * This ensures the module is tree-shakeable and types are available for import
 */
