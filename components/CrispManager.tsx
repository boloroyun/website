'use client';

import { useCrispTriggers } from '@/hooks/useCrispTriggers';
import CrispIdentifyFromSession from './CrispIdentifyFromSession';

/**
 * Combined Crisp manager component that handles both triggers and session identification
 * Should be mounted once in the app layout
 */
export default function CrispManager() {
  // Initialize Crisp triggers (pathname-based auto-opening)
  useCrispTriggers();

  return (
    <>
      {/* Handle user identification from NextAuth session */}
      <CrispIdentifyFromSession />
    </>
  );
}
