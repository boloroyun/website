'use client';

// Import dependencies
import { useEffect } from 'react';
import { useOTPAuth } from '@/hooks/useOTPAuth';
// Import from Crisp library with renamed import to avoid potential issues
import { identifyUser, addSessionTags as tagSession } from '@/lib/crisp';

/**
 * Component that identifies authenticated users in Crisp chat
 */
export default function CrispIdentifyFromSession() {
  // Get auth data from OTP auth system
  const { isAuthenticated, user, isLoading } = useOTPAuth();

  useEffect(() => {
    // Skip if auth is loading
    if (isLoading) return;

    // Handle authenticated users
    if (isAuthenticated && user) {
      const { email, username } = user;

      // Only proceed if we have an email
      if (email) {
        console.log('🔐 Identifying authenticated user in Crisp:', {
          email,
          username,
        });

        // Set user data in Crisp
        identifyUser({
          email,
          name: username || undefined,
        });

        // Tag this session as authenticated
        tagSession(['authenticated']);
      }
    } else if (!isAuthenticated) {
      console.log('👤 User is not authenticated - Crisp will remain anonymous');
    }
  }, [isAuthenticated, user, isLoading]);

  // This component doesn't render anything
  return null;
}
