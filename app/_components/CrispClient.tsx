'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { openCrispChat } from '@/lib/crisp-events';

interface CrispUser {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
}

interface CrispClientProps {
  user: CrispUser;
}

// Extend window interface for Crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export default function CrispClient({ user }: CrispClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize Crisp and configure user
  useEffect(() => {
    // Skip if running on server
    if (typeof window === 'undefined') return;

    // Initialize Crisp if not already loaded
    if (!window.$crisp) {
      // Get Crisp Website ID from environment variables
      const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

      if (!crispWebsiteId) {
        console.error(
          'NEXT_PUBLIC_CRISP_WEBSITE_ID not found in environment variables'
        );
        return;
      }

      // Initialize Crisp
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = crispWebsiteId;

      // Inject Crisp script
      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.head.appendChild(script);

      console.log('✅ Crisp chat widget initialized');
    }

    // Configure user data if logged in
    if (user.email) {
      try {
        // Set user email
        window.$crisp.push(['set', 'user:email', user.email]);

        // Set user nickname (prefer name, fallback to email)
        const nickname = user.name || user.email;
        window.$crisp.push(['set', 'user:nickname', nickname]);

        // Set session segments for campaign targeting
        window.$crisp.push([
          'set',
          'session:segments',
          [['website', 'quote_flow']],
        ]);

        // Set session data with user role and ID
        const role = user.role || 'GUEST';
        const userId = user.id || '';
        window.$crisp.push([
          'set',
          'session:data',
          [
            ['role', role],
            ['userId', userId],
          ],
        ]);

        console.log('✅ Crisp user identified:', {
          id: userId,
          email: user.email,
          nickname,
          role,
        });
      } catch (error) {
        console.error('❌ Failed to configure Crisp user data:', error);
      }
    } else {
      // Anonymous user - still set basic session data
      try {
        window.$crisp.push(['set', 'session:segments', [['website']]]);
        window.$crisp.push([
          'set',
          'session:data',
          [
            ['role', 'GUEST'],
            ['userId', ''],
          ],
        ]);
        console.log('✅ Crisp configured for anonymous user');
      } catch (error) {
        console.error(
          '❌ Failed to configure Crisp for anonymous user:',
          error
        );
      }
    }
  }, [user]);

  // Route-based triggers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for immediate support trigger
    const supportParam = searchParams.get('support');
    if (supportParam === '1') {
      console.log('🎯 Support trigger activated from URL parameter');

      // Wait for Crisp to load, then open chat
      const openSupportChat = () => {
        if (window.$crisp && Array.isArray(window.$crisp)) {
          setTimeout(() => {
            openCrispChat();
          }, 1000); // Small delay to ensure page is fully loaded
        } else {
          // Retry after 500ms if Crisp isn't loaded yet
          setTimeout(openSupportChat, 500);
        }
      };

      openSupportChat();
      return;
    }

    // Handle /products/* pages with 20-second delay
    if (pathname.startsWith('/products/')) {
      console.log('⏰ Starting 20-second timer for products page chat trigger');

      const timer = setTimeout(() => {
        if (window.$crisp && Array.isArray(window.$crisp)) {
          console.log('🎯 Products page 20-second trigger activated');
          openCrispChat();
        } else {
          console.warn('Crisp not loaded after 20 seconds on products page');
        }
      }, 20000); // 20 seconds

      // Cleanup timer on unmount or route change
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything visible
  return null;
}
