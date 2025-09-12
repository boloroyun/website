'use client';

import { useEffect } from 'react';

/**
 * Improved component to suppress hydration errors from browser extensions
 * This helps clean up the console by ignoring common React hydration warnings
 */
export default function SuppressHydrationWarnings() {
  useEffect(() => {
    // The error we're looking for has a specific pattern
    const hydrationErrorPattern =
      /Extra attributes from the server|data-new-gr-c-s-check-loaded|data-gr-ext-installed/i;

    // Get the original error function
    const originalError = console.error;

    // Create a wrapper that filters out hydration warnings
    function errorFilter(...args: any[]) {
      // If this is a hydration warning about extra attributes from extensions like Grammarly, ignore it
      if (
        args.length > 1 &&
        typeof args[0] === 'string' &&
        hydrationErrorPattern.test(args[0])
      ) {
        return;
      }

      // Otherwise pass through to original error function
      return originalError.apply(console, args);
    }

    // Replace console.error with our filtered version
    console.error = errorFilter;

    // When component unmounts, restore the original function
    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
