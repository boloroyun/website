'use client';

import { useEffect } from 'react';

/**
 * This component suppresses React hydration warnings caused by browser extensions
 * like Grammarly that add attributes to the DOM after server rendering.
 */
export default function SuppressGrammarly() {
  useEffect(() => {
    // Disable console warnings for Grammarly and similar extensions
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('data-new-gr-c-s-check-loaded') ||
          args[0].includes('data-gr-ext-installed'))
      ) {
        // Suppress specific hydration warnings
        return;
      }
      originalError(...args);
    };

    // Cleanup function to restore original console.error
    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
