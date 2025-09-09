'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { identifyUser, addSessionTags } from '@/lib/crisp';

/**
 * Component that automatically identifies users in Crisp chat based on NextAuth session
 * Should be mounted once in the app layout or main page
 */
export default function CrispIdentifyFromSession() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    // If user is authenticated, identify them in Crisp
    if (status === 'authenticated' && session?.user) {
      const { email, name } = session.user;

      if (email) {
        console.log('🔐 Identifying authenticated user in Crisp chat:', {
          email,
          name,
        });

        // Identify user in Crisp
        identifyUser({ email, name: name || undefined });

        // Add authenticated tag
        addSessionTags(['authenticated']);
      }
    } else if (status === 'unauthenticated') {
      console.log('👤 User is not authenticated - Crisp will remain anonymous');
    }
  }, [session, status]);

  // This component doesn't render anything
  return null;
}
