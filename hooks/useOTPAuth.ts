import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  image?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useOTPAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });
  const router = useRouter();

  // Check authentication status from cookies
  const checkAuth = () => {
    try {
      console.log('🔍 Checking authentication...');
      console.log('🍪 All cookies:', document.cookie);

      // Check if we have auth cookies
      const authUserCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-user='));

      const authTokenCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='));

      console.log(
        '🔍 Auth user cookie:',
        authUserCookie ? 'Found' : 'Not found'
      );
      console.log(
        '🔍 Auth token cookie:',
        authTokenCookie ? 'Found' : 'Not found'
      );

      if (authUserCookie && authTokenCookie) {
        const userDataString = authUserCookie.split('=')[1];
        const userData = JSON.parse(decodeURIComponent(userDataString));

        console.log(
          '✅ User authenticated:',
          userData.username || userData.email
        );
        setAuthState({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
        });
      } else {
        console.log('❌ No valid auth cookies found, user not authenticated');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear cookies
      document.cookie =
        'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie =
        'auth-user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });

      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Refresh auth state (useful after login)
  const refreshAuth = () => {
    checkAuth();
    // Also try again after a short delay to handle cookie timing issues
    setTimeout(() => checkAuth(), 100);
  };

  useEffect(() => {
    checkAuth();

    // Fallback: If still loading after 3 seconds, force to not authenticated
    const fallbackTimer = setTimeout(() => {
      setAuthState((prev) => {
        if (prev.isLoading) {
          console.log('⚠️ Auth check timeout, forcing to not authenticated');
          return {
            isAuthenticated: false,
            user: null,
            isLoading: false,
          };
        }
        return prev;
      });
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return {
    ...authState,
    logout,
    refreshAuth,
  };
}
