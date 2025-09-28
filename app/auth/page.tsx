'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();

  // Redirect to new OTP login system
  useEffect(() => {
    router.replace('/auth/login-otp');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default AuthPage;
