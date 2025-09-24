'use client';

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { triggerAuthLogout } from '@/lib/auth-events';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(() => {
    try {
      const authUser = Cookies.get('auth-user');
      // Only log when user is authenticated to reduce console noise
      if (authUser) {
        console.log('🔍 Checking auth status: user found');
      }

      if (authUser) {
        const userData = JSON.parse(authUser);
        console.log(
          '✅ User authenticated:',
          userData.username,
          userData.email
        );
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Silently handle unauthenticated state
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
      // Clear invalid cookies
      Cookies.remove('auth-user');
      Cookies.remove('auth-token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial auth check with timeout to prevent infinite loading
  useEffect(() => {
    checkAuthStatus();

    // Add a timeout to ensure isLoading is set to false even if checkAuthStatus hangs
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds max loading time

    return () => clearTimeout(timeout);
  }, [checkAuthStatus]);

  // Listen for cookie changes using polling
  useEffect(() => {
    let lastCookieValue = Cookies.get('auth-user') || '';

    const interval = setInterval(() => {
      const currentCookieValue = Cookies.get('auth-user') || '';

      // Check if cookie state has changed
      if (currentCookieValue !== lastCookieValue) {
        console.log('🔄 Cookie change detected, refreshing auth state...');
        lastCookieValue = currentCookieValue;
        checkAuthStatus();
      }
    }, 500); // Check every 500ms for faster updates

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  // Listen for custom auth events
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('🔔 Auth change event received, refreshing...');
      checkAuthStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [checkAuthStatus]);

  const logout = async () => {
    try {
      console.log('🔐 Starting logout process...');

      // Clear client-side cookies first
      Cookies.remove('auth-user');
      Cookies.remove('auth-token');
      Cookies.remove('session');
      Cookies.remove('user-session');

      // Update state immediately
      setUser(null);
      setIsAuthenticated(false);

      // Call logout API to clear server-side httpOnly cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Trigger auth change event for immediate UI updates
      triggerAuthLogout();

      console.log(
        '🔐 Client-side logout: All cookies cleared and events triggered'
      );
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear client state
      Cookies.remove('auth-user');
      Cookies.remove('auth-token');
      Cookies.remove('session');
      Cookies.remove('user-session');
      setUser(null);
      setIsAuthenticated(false);
      triggerAuthLogout();
    }
  };

  const refreshAuth = useCallback(() => {
    console.log('🔄 Refreshing auth state...');
    setIsLoading(true);
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refreshAuth,
  };
};
