'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  Mail,
  Shield,
  ArrowLeft,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

type Step = 'email' | 'username' | 'otp' | 'success';

export default function LoginOTPPage() {
  const router = useRouter();
  const {
    refreshAuth,
    isAuthenticated,
    user,
    isLoading: authLoading,
  } = useOTPAuth();
  const [step, setStep] = useState('email' as Step);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Only redirect if clearly authenticated (not during loading)
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      console.log('🔄 User already authenticated, redirecting to homepage...');
      // Add a small delay to prevent immediate redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  }, [isAuthenticated, authLoading, user, router]);

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'otp' && timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First, check if user exists
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.error || 'Failed to check email');
        return;
      }

      if (checkData.exists) {
        // Existing user - send OTP directly
        setIsNewUser(false);
        await sendOtpToUser();
      } else {
        // New user - go to username step
        setIsNewUser(true);
        setStep('username');
      }
    } catch (error) {
      console.error('Email check error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');

    // Send OTP for new user registration
    await sendOtpToUser();
  };

  const sendOtpToUser = async () => {
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username: isNewUser ? username : undefined,
          isNewUser,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            'Too many requests. Please wait before requesting a new code.'
          );
        } else {
          setError(data.error || 'Failed to send login code');
        }
        return;
      }

      setStep('otp');
      setTimeLeft(5 * 60); // 5 minutes
      setCanResend(false);
      console.log('✅ OTP sent successfully');
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Starting OTP verification...');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);
    console.log('👤 Username:', username);
    console.log('🆕 Is New User:', isNewUser);

    setIsLoading(true);
    setError('');

    // Force stop loading after 10 seconds as failsafe
    const forceStopLoading = setTimeout(() => {
      console.log('⚠️ FORCE STOPPING LOADING - 10 second timeout reached');
      setIsLoading(false);
    }, 10000);

    try {
      console.log('📡 Making API request to /api/auth/otp/verify');

      const requestBody = {
        email,
        otp,
        username: isNewUser ? username : undefined,
        isNewUser,
      };

      console.log('📦 Request body:', requestBody);

      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        console.log('❌ Verification failed:', data.error);
        setError(data.error || 'Invalid code. Please try again.');
        clearTimeout(forceStopLoading);
        setIsLoading(false);
        return;
      }

      console.log(
        '✅ Verification successful! Immediately stopping loading...'
      );
      clearTimeout(forceStopLoading);
      setIsLoading(false);
      setStep('success');

      // Refresh auth state and redirect
      console.log('🔄 Refreshing auth state...');
      refreshAuth();
      setTimeout(() => refreshAuth(), 100);
      setTimeout(() => refreshAuth(), 500);

      // Redirect to homepage
      setTimeout(() => {
        console.log('🔄 Final auth refresh and redirect...');
        refreshAuth();
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('❌ Network error during verification:', error);
      setError('Network error. Please check your connection and try again.');
      clearTimeout(forceStopLoading);
      setIsLoading(false);
    } finally {
      // Always reset loading state as final failsafe
      console.log('🏁 Finally block - ensuring loading is stopped');
      clearTimeout(forceStopLoading);
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setError('');
    await sendOtpToUser();
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setTimeLeft(0);
    setCanResend(false);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-1">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Login Successful!
            </CardTitle>
            <CardDescription>
              You have been successfully authenticated. Redirecting to your
              profile...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            {step === 'email' ? (
              <Mail className="h-8 w-8 text-blue-600" />
            ) : (
              <Shield className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 'email' && 'Sign In'}
            {step === 'username' && 'Create Account'}
            {step === 'otp' && 'Enter Verification Code'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'email' && 'Enter your email address to continue'}
            {step === 'username' && 'Choose a username for your new account'}
            {step === 'otp' && `We sent a 6-digit code to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-center"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Continue
                  </>
                )}
              </Button>
            </form>
          )}

          {step === 'username' && (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Choose a Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-center"
                />
                <p className="text-sm text-gray-500">
                  This will be your display name on the platform
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep('email')}
              >
                ← Back to Email
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <Label
                    htmlFor="otp"
                    className="text-lg font-semibold text-gray-800"
                  >
                    Verification Code
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Enhanced OTP Input with visual feedback */}
                <div className="relative">
                  <input
                    id="otp"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      console.log(
                        '🔍 OTP onChange called with:',
                        e.target.value
                      );
                      console.log('🔍 Current otp state:', otp);
                      console.log('🔍 isLoading:', isLoading);

                      // Simplest possible handler
                      const value = e.target.value;
                      console.log('🔍 Setting OTP to:', value);
                      setOtp(value);
                    }}
                    onInput={(e) => {
                      console.log(
                        '🔍 onInput called:',
                        (e.target as HTMLInputElement).value
                      );
                    }}
                    onKeyDown={(e) => {
                      console.log('🔍 onKeyDown:', e.key);
                    }}
                    onFocus={() => console.log('🔍 Input focused')}
                    onBlur={() => console.log('🔍 Input blurred')}
                    disabled={false}
                    readOnly={false}
                    className="w-full p-6 text-center text-3xl font-bold border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-black font-mono shadow-lg"
                    style={{
                      backgroundColor: 'white !important',
                      color: 'black !important',
                      pointerEvents: 'auto',
                    }}
                    maxLength={6}
                    autoComplete="off"
                  />

                  {/* Visual progress indicator */}
                  <div className="flex justify-center mt-3 space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index < otp.length
                            ? 'bg-blue-500 shadow-md'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Status message */}
                <div className="text-center">
                  {otp.length === 0 && (
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Waiting for verification code...
                    </p>
                  )}
                  {otp.length > 0 && otp.length < 6 && (
                    <p className="text-sm text-blue-600 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                        />
                      </svg>
                      {6 - otp.length} more digits needed
                    </p>
                  )}
                  {otp.length === 6 && (
                    <p className="text-sm text-green-600 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Code complete! Ready to verify
                    </p>
                  )}
                </div>
              </div>

              {timeLeft > 0 && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Code expires in {formatTime(timeLeft)}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>

              <div className="flex flex-col space-y-2">
                {canResend && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Change Email
                </Button>
              </div>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-1 h-4 w-4 inline-block" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
