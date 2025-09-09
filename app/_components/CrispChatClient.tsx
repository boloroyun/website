'use client';

import { useEffect } from 'react';

interface CrispUserData {
  email: string | null;
  name: string | null;
  role: string | null;
}

interface CrispChatClientProps {
  userData: CrispUserData;
}

// Extend window interface for Crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

// Export function to push Crisp events
export function pushCrispEvent(name: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.$crisp) {
    try {
      window.$crisp.push(['set', 'session:event', [[name, data || {}]]]);
      console.log('Crisp event sent:', name, data);
    } catch (error) {
      console.error('Failed to send Crisp event:', error);
    }
  } else {
    console.warn('Crisp not loaded, event not sent:', name, data);
  }
}

export default function CrispChatClient({ userData }: CrispChatClientProps) {
  useEffect(() => {
    // Skip if running on server
    if (typeof window === 'undefined') return;

    // Initialize Crisp if not already loaded
    if (!window.$crisp) {
      // Get Crisp Website ID from environment variables
      const crispWebsiteId =
        process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ||
        process.env.CRISP_WEBSITE_ID;

      if (!crispWebsiteId) {
        console.error(
          'CRISP_WEBSITE_ID or NEXT_PUBLIC_CRISP_WEBSITE_ID not found in environment variables'
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

      console.log('Crisp chat widget initialized');
    }

    // Configure user data if logged in
    if (userData.email) {
      try {
        // Set user email
        window.$crisp.push(['set', 'user:email', userData.email]);

        // Set user nickname (prefer name, fallback to email)
        const nickname = userData.name || userData.email;
        window.$crisp.push(['set', 'user:nickname', nickname]);

        // Set session segments
        window.$crisp.push(['set', 'session:segments', [['website']]]);

        // Set session data with user role
        const role = userData.role || 'GUEST';
        window.$crisp.push(['set', 'session:data', [['role', role]]]);

        console.log('Crisp user identified:', {
          email: userData.email,
          nickname,
          role,
        });
      } catch (error) {
        console.error('Failed to configure Crisp user data:', error);
      }
    } else {
      // Anonymous user - still set basic session data
      try {
        window.$crisp.push(['set', 'session:segments', [['website']]]);
        window.$crisp.push(['set', 'session:data', [['role', 'GUEST']]]);
        console.log('Crisp configured for anonymous user');
      } catch (error) {
        console.error('Failed to configure Crisp for anonymous user:', error);
      }
    }
  }, [userData]);

  // This component doesn't render anything visible
  return null;
}
