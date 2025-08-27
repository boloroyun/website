'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface QuoteRequestData {
  category: 'countertop' | 'cabinet' | 'combo';

  // Countertop fields
  material?: string;
  sqft?: number;
  edgeProfile?: string;
  sinkCutouts?: number;
  backsplashLf?: number;

  // Cabinet fields
  baseLf?: number;
  wallLf?: number;
  tallUnits?: number;
  drawerStacks?: number;

  // Common fields
  zipcode?: string;
  productIds?: string[];
}

interface UseQuoteRequestReturn {
  isLoading: boolean;
  error: string | null;
  submitQuoteRequest: (data: QuoteRequestData) => Promise<string | null>;
  clearError: () => void;
}

export function useQuoteRequest(): UseQuoteRequestReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuoteRequest = useCallback(
    async (data: QuoteRequestData): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Prepare the payload
        const payload: any = {
          category: data.category,
          zipcode: data.zipcode,
        };

        // Add product IDs if provided
        if (data.productIds && data.productIds.length > 0) {
          payload.products = data.productIds.map((id) => ({ id, qty: 1 }));
        }

        // Add countertop fields
        if (data.category === 'countertop' || data.category === 'combo') {
          if (data.material) payload.material = data.material;
          if (data.sqft) payload.sqft = data.sqft;
          if (data.edgeProfile) payload.edgeProfile = data.edgeProfile;
          if (data.sinkCutouts !== undefined)
            payload.sinkCutouts = data.sinkCutouts;
          if (data.backsplashLf) payload.backsplashLf = data.backsplashLf;
        }

        // Add cabinet fields
        if (data.category === 'cabinet' || data.category === 'combo') {
          if (data.baseLf) payload.baseLf = data.baseLf;
          if (data.wallLf) payload.wallLf = data.wallLf;
          if (data.tallUnits) payload.tallUnits = data.tallUnits;
          if (data.drawerStacks) payload.drawerStacks = data.drawerStacks;
        }

        console.log('📝 Submitting quote request via hook:', payload);

        // Submit to the unified quote API
        const response = await fetch('/api/quotes/build-unified', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_TOKEN || 'dev-token'}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate quote');
        }

        const result = await response.json();
        console.log('✅ Quote generated via hook:', result);

        return result.quoteId;
      } catch (error) {
        console.error('❌ Quote request failed:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to generate quote';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    submitQuoteRequest,
    clearError,
  };
}

// Helper hook for quick quote requests
export function useQuickQuote() {
  const { submitQuoteRequest, isLoading, error } = useQuoteRequest();
  const router = useRouter();

  const requestCountertopQuote = useCallback(
    async (
      sqft: number,
      material: string = 'quartz',
      options: Partial<QuoteRequestData> = {}
    ) => {
      const quoteId = await submitQuoteRequest({
        category: 'countertop',
        sqft,
        material,
        ...options,
      });

      if (quoteId) {
        router.push(`/quote/${quoteId}`);
      }

      return quoteId;
    },
    [submitQuoteRequest, router]
  );

  const requestCabinetQuote = useCallback(
    async (
      baseLf: number,
      wallLf: number = 0,
      options: Partial<QuoteRequestData> = {}
    ) => {
      const quoteId = await submitQuoteRequest({
        category: 'cabinet',
        baseLf,
        wallLf,
        ...options,
      });

      if (quoteId) {
        router.push(`/quote/${quoteId}`);
      }

      return quoteId;
    },
    [submitQuoteRequest, router]
  );

  const requestComboQuote = useCallback(
    async (
      countertopData: { sqft: number; material: string },
      cabinetData: { baseLf: number; wallLf?: number },
      options: Partial<QuoteRequestData> = {}
    ) => {
      const quoteId = await submitQuoteRequest({
        category: 'combo',
        ...countertopData,
        ...cabinetData,
        ...options,
      });

      if (quoteId) {
        router.push(`/quote/${quoteId}`);
      }

      return quoteId;
    },
    [submitQuoteRequest, router]
  );

  return {
    isLoading,
    error,
    requestCountertopQuote,
    requestCabinetQuote,
    requestComboQuote,
  };
}
