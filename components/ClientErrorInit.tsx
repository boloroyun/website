'use client';

import { useEffect } from 'react';
import { setupGlobalErrorHandlers } from '@/components/ReactErrorRecovery';

/**
 * Client-side error handler initialization
 * This ensures error handlers are set up on the client side
 */
export function ClientErrorInit() {
  useEffect(() => {
    // Set up global error handlers on the client side
    setupGlobalErrorHandlers();

    console.log('🛡️ Global error handlers initialized');
  }, []);

  return null; // This component doesn't render anything
}
