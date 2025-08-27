'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Server action to handle complete logout
export async function handleLogout() {
  try {
    const cookieStore = cookies();

    // Clear all authentication-related cookies
    cookieStore.delete('auth-token');
    cookieStore.delete('auth-user');

    // Also clear any other potential auth cookies that might exist
    cookieStore.delete('session');
    cookieStore.delete('user-session');

    console.log('🔐 Server-side logout: All authentication cookies cleared');

    return {
      success: true,
      message: 'Successfully logged out',
    };
  } catch (error) {
    console.error('Server logout error:', error);
    return {
      success: false,
      error: 'Failed to logout on server',
    };
  }
}

// Server action for logout with redirect
export async function logoutAndRedirect() {
  try {
    const cookieStore = cookies();

    // Clear all authentication-related cookies
    cookieStore.delete('auth-token');
    cookieStore.delete('auth-user');
    cookieStore.delete('session');
    cookieStore.delete('user-session');

    console.log('🔐 Server-side logout with redirect: All cookies cleared');
  } catch (error) {
    console.error('Server logout with redirect error:', error);
  }

  // Redirect to homepage after clearing cookies
  redirect('/');
}

// Form action for logout (can be used directly in forms)
export async function logoutFormAction() {
  'use server';

  try {
    const cookieStore = cookies();

    // Clear all authentication-related cookies
    cookieStore.delete('auth-token');
    cookieStore.delete('auth-user');
    cookieStore.delete('session');
    cookieStore.delete('user-session');

    console.log('🔐 Form logout: All authentication cookies cleared');
  } catch (error) {
    console.error('Form logout error:', error);
  }

  // Redirect to homepage
  redirect('/');
}
