'use client';

import { useEffect } from 'react';

/**
 * Component to suppress hydration errors from browser extensions
 * This helps clean up the console by ignoring common React hydration warnings
 * caused by browser extensions like Grammarly that add attributes to the DOM
 */
export default function SuppressHydrationErrors() {
  useEffect(() => {
    // Original console.error function
    const originalConsoleError = console.error;

    // Override console.error to filter out specific hydration warnings
    console.error = (...args) => {
      // Check if this is a hydration warning about extra attributes
      const isHydrationAttributeWarning = args.some(
        (arg) =>
          typeof arg === 'string' &&
          (arg.includes('Extra attributes from the server') ||
            arg.includes('data-gr-ext-installed') ||
            arg.includes('data-new-gr-c-s-check-loaded'))
      );

      // If it's not a hydration attribute warning, pass it through
      if (!isHydrationAttributeWarning) {
        originalConsoleError(...args);
      }
    };

    // Restore original console.error on cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // This component doesn't render anything
  return null;
}
