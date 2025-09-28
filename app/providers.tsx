'use client';

import { ReactNode } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Global providers wrapper
 * This is where you would add global providers like SWR or React Query
 * if you were using them in your project.
 */
export function Providers({ children }: ProvidersProps) {
  // Simple passthrough component for now
  // Add providers here when needed
  return children;
}
