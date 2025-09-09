'use client';

// Import dependencies
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
// Import from Crisp library with renamed import to avoid potential issues
import { identifyUser, addSessionTags as tagSession } from '@/lib/crisp';

/**
 * Component that identifies authenticated users in Crisp chat
 */
export default function CrispIdentifyFromSession() {
  // Get session data from NextAuth
  const { data: session, status } = useSession();

  useEffect(() => {
    // Skip if session is loading
    if (status === 'loading') return;

    // Handle authenticated users
    if (status === 'authenticated' && session?.user) {
      const { email, name } = session.user;

      // Only proceed if we have an email
      if (email) {
        console.log('🔐 Identifying authenticated user in Crisp:', { email, name });

        // Set user data in Crisp
        identifyUser({ 
          email, 
          name: name || undefined 
        });

        // Tag this session as authenticated
        tagSession(['authenticated']);
      }
    } else if (status === 'unauthenticated') {
      console.log('👤 User is not authenticated - Crisp will remain anonymous');
    }
  }, [session, status]);

  // This component doesn't render anything
  return null;
}