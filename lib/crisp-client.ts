'use client';

// Extend window interface for Crisp
declare global {
  interface Window {
    $crisp: any[];
  }
}

/**
 * Emit a custom event to Crisp chat for tracking user interactions
 * @param name - Event name (e.g., "request_quote_clicked", "quote_submitted")
 * @param data - Optional event data object
 */
export function emitCrispEvent(name: string, data?: Record<string, any>) {
  // Ensure we're running in the browser
  if (typeof window === 'undefined') {
    console.warn('emitCrispEvent called on server side, ignoring');
    return;
  }

  // Check if Crisp is loaded
  if (!window.$crisp || !Array.isArray(window.$crisp)) {
    console.warn('Crisp not loaded, event not sent:', name, data);
    return;
  }

  try {
    // Push event to Crisp
    window.$crisp.push(['set', 'session:event', [[name, data || {}]]]);

    console.log('✅ Crisp event emitted:', name, data);
  } catch (error) {
    console.error('❌ Failed to emit Crisp event:', error);
  }
}

/**
 * Check if Crisp is loaded and available
 * @returns boolean indicating if Crisp is ready
 */
export function isCrispLoaded(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.$crisp &&
    Array.isArray(window.$crisp)
  );
}

/**
 * Set user data in Crisp (useful for dynamic updates)
 * @param email - User email
 * @param name - User name/nickname
 * @param role - User role
 */
export function setCrispUser(email: string, name?: string, role?: string) {
  if (!isCrispLoaded()) {
    console.warn('Crisp not loaded, user data not set');
    return;
  }

  try {
    window.$crisp.push(['set', 'user:email', email]);

    if (name) {
      window.$crisp.push(['set', 'user:nickname', name]);
    }

    if (role) {
      window.$crisp.push(['set', 'session:data', [['role', role]]]);
    }

    console.log('✅ Crisp user data updated:', { email, name, role });
  } catch (error) {
    console.error('❌ Failed to set Crisp user data:', error);
  }
}

/**
 * Open Crisp chat widget programmatically
 */
export function openCrispChat() {
  if (!isCrispLoaded()) {
    console.warn('Crisp not loaded, cannot open chat');
    return;
  }

  try {
    window.$crisp.push(['do', 'chat:open']);
    console.log('✅ Crisp chat opened');
  } catch (error) {
    console.error('❌ Failed to open Crisp chat:', error);
  }
}

/**
 * Close Crisp chat widget programmatically
 */
export function closeCrispChat() {
  if (!isCrispLoaded()) {
    console.warn('Crisp not loaded, cannot close chat');
    return;
  }

  try {
    window.$crisp.push(['do', 'chat:close']);
    console.log('✅ Crisp chat closed');
  } catch (error) {
    console.error('❌ Failed to close Crisp chat:', error);
  }
}

/**
 * Open Crisp chat widget and scroll to bottom of page
 * This is a convenience function for smart triggers
 */
export function openChatNow() {
  if (!isCrispLoaded()) {
    console.warn('Crisp not loaded, cannot open chat');
    return;
  }

  try {
    // Open the chat widget
    window.$crisp.push(['do', 'chat:open']);

    // Scroll to bottom of page for better UX
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 300); // Small delay to let chat widget animate in

    console.log('✅ Crisp chat opened with scroll to bottom');
  } catch (error) {
    console.error('❌ Failed to open Crisp chat:', error);
  }
}
