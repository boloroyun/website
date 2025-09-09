'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { openChat, sendVisitorMessage, addSessionTag } from '@/lib/crisp';

/**
 * Custom hook for Crisp chat triggers based on page routes
 * Handles auto-opening chat on specific pages and sending contextual messages
 */
export function useCrispTriggers() {
  const pathname = usePathname();
  const homeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredHome = useRef(false);

  useEffect(() => {
    // Clear any existing home timer when route changes
    if (homeTimerRef.current) {
      clearTimeout(homeTimerRef.current);
      homeTimerRef.current = null;
    }

    // Handle /quote page - auto-open with greeting
    if (pathname === '/quote') {
      console.log('🎯 Quote page detected - triggering Crisp chat');

      // Small delay to ensure Crisp is fully loaded
      setTimeout(() => {
        addSessionTag('quote-page');
        openChat();
        sendVisitorMessage("Hi! I'd like to request a quote for my project.");
      }, 1000);

      return;
    }

    // Handle home page - 20 second auto-open (only once per session)
    if (pathname === '/' && !hasTriggeredHome.current) {
      console.log(
        '🏠 Home page detected - setting 20s timer for Crisp auto-open'
      );

      homeTimerRef.current = setTimeout(() => {
        console.log('⏰ 20s timer triggered - opening Crisp chat on home page');
        hasTriggeredHome.current = true;

        addSessionTag('home-auto-open');
        openChat();
        sendVisitorMessage(
          "Hello! I'm browsing your products and might need some help choosing the right option for my project."
        );
      }, 20000); // 20 seconds
    }

    // Cleanup function
    return () => {
      if (homeTimerRef.current) {
        clearTimeout(homeTimerRef.current);
        homeTimerRef.current = null;
      }
    };
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (homeTimerRef.current) {
        clearTimeout(homeTimerRef.current);
      }
    };
  }, []);
}
