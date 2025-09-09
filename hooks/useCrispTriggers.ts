'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { openChat, sendVisitorMessage } from '@/lib/crisp';
import { addSessionTags as tagSession } from '@/lib/crisp';

/**
 * Custom hook for Crisp chat triggers based on page routes
 * Handles auto-opening chat on specific pages and sending contextual messages
 */
export default function useCrispTriggers() {
  const pathname = usePathname();
  const triggeredRef = useRef<Record<string, boolean>>({});
  
  useEffect(() => {
    // Prevent triggering multiple times during development
    if (triggeredRef.current[pathname]) {
      return;
    }
    
    // Mark this path as triggered
    triggeredRef.current[pathname] = true;
    
    // QUOTE PAGE TRIGGER
    // Auto-tag users who visit the quote request page
    if (pathname === '/quote' || pathname === '/request-a-quote') {
      console.log('🔖 Tagging user on quote page');
      
      // Tag this session
      tagSession(['quote-page']);
      
      // We don't auto-open chat on this page since there's a form
      return;
    }
    
    // HOME PAGE DELAYED TRIGGER
    // On homepage, open chat after user has been on page for a while
    if (pathname === '/') {
      const delay = 30000; // 30 seconds
      
      console.log(`⏱️ Setting up delayed chat trigger for homepage (${delay}ms)`);
      
      const timer = setTimeout(() => {
        console.log('🏠 Auto-opening chat on homepage after delay');
        
        // Tag this auto-open event
        tagSession(['home-auto-open']);
        
        // Open chat with welcome message
        openChat();
        
        // Send welcome message with slight delay
        setTimeout(() => {
          sendVisitorMessage(
            "Welcome to Lux Cabinets & Stones! How can we help with your kitchen or bathroom project today?"
          );
        }, 800);
      }, delay);
      
      // Cleanup timeout when component unmounts
      return () => clearTimeout(timer);
    }
  }, [pathname]);
  
  // No return value needed - this is a side-effect only hook
}