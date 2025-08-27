// Utility functions for triggering authentication state changes

export const triggerAuthChange = () => {
  if (typeof window !== 'undefined') {
    console.log('🔔 Triggering auth change event...');
    window.dispatchEvent(new CustomEvent('auth-change'));
  }
};

export const triggerAuthLogin = (userData: any) => {
  if (typeof window !== 'undefined') {
    console.log('🔔 Triggering auth login event...', userData);
    window.dispatchEvent(new CustomEvent('auth-login', { detail: userData }));
    triggerAuthChange();
  }
};

export const triggerAuthLogout = () => {
  if (typeof window !== 'undefined') {
    console.log('🔔 Triggering auth logout event...');
    window.dispatchEvent(new CustomEvent('auth-logout'));
    triggerAuthChange();
  }
};
