'use client';

interface CrispUserData {
  email: string;
  name?: string;
}

/**
 * Safely set Crisp user identification data
 * Only works on client-side after Crisp has loaded
 */
export function setCrispUser({ email, name }: CrispUserData): void {
  // Ensure we're running in the browser
  if (typeof window === 'undefined') {
    console.warn('setCrispUser called on server side, ignoring');
    return;
  }

  // Check if Crisp is loaded
  if (!window.$crisp || !Array.isArray(window.$crisp)) {
    console.warn('Crisp not loaded yet, user data not set');
    return;
  }

  try {
    // Set user email
    window.$crisp.push(['set', 'user:email', email]);

    // Set user nickname if provided
    if (name) {
      window.$crisp.push(['set', 'user:nickname', name]);
    }

    console.log('✅ Crisp user data set:', { email, name });
  } catch (error) {
    console.error('❌ Failed to set Crisp user data:', error);
  }
}

/**
 * Check if Crisp is loaded and available
 */
export function isCrispLoaded(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.$crisp &&
    Array.isArray(window.$crisp)
  );
}
