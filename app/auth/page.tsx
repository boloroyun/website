'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { triggerAuthLogin } from '@/lib/auth-events';

const AuthPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    'login' | 'verification' | 'success'
  >('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { refreshAuth, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Timer for resend button
  useEffect(() => {
    if (currentStep === 'verification' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === 'verification') {
      setCanResend(true);
    }
  }, [resendTimer, currentStep]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUserEmail(email.trim());
        setCurrentStep('verification');
        setResendTimer(30);
        setCanResend(false);
        // Auto-focus first verification input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for verification
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(''); // Clear error when user types

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (
      newCode.every((digit) => digit !== '') &&
      newCode.join('').length === 4
    ) {
      handleVerify(newCode.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4);
    if (pastedData.length === 4) {
      const newCode = pastedData.split('');
      setCode(newCode);
      setError('');
      handleVerify(pastedData);
    }
  };

  // Verify code
  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join('');

    if (verificationCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Verification successful:', result.user);

        // Trigger immediate auth change event
        triggerAuthLogin(result.user);

        setCurrentStep('success');

        // Refresh auth state immediately and with delays to ensure cookies are read
        refreshAuth();
        setTimeout(() => refreshAuth(), 100);
        setTimeout(() => refreshAuth(), 500);
        setTimeout(() => refreshAuth(), 1000);

        // Redirect to home after success
        setTimeout(() => {
          router.push('/');
        }, 2500);
      } else {
        setError(result.error || 'Invalid verification code');
        // Clear the code inputs on error
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setResendTimer(30);
        setCanResend(false);
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
        console.log('✅ Verification code resent successfully');
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (error) {
      console.error('❌ Resend code error:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
    setCode(['', '', '', '']);
    setError('');
    setResendTimer(30);
    setCanResend(false);
  };

  // Don't render if user is already authenticated
  return !isAuthenticated ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LUX Cabinets & Stones
          </h1>
          <p className="text-gray-600">
            {currentStep === 'login' && 'Login or create your account'}
            {currentStep === 'verification' && 'Verify your email address'}
            {currentStep === 'success' && 'Welcome to LUX!'}
          </p>
        </div>

        {/* Main Card */}
        <Card className="relative shadow-xl border-0">
          {/* Loading Overlay */}
          {isLoading && currentStep === 'login' && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">
                  Sending verification code...
                </p>
              </div>
            </div>
          )}

          {/* Login Step */}
          {currentStep === 'login' && (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">
                  Login/Signup
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your details to get started. We'll send you a
                  verification code to your email.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleContinue}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </>
          )}

          {/* Verification Step */}
          {currentStep === 'verification' && (
            <>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToLogin}
                    className="p-1 h-auto"
                    disabled={isLoading}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Mail size={20} className="text-blue-600" />
                      <span>Verify Your Email</span>
                    </CardTitle>
                    <CardDescription>
                      We sent a 4-digit code to <strong>{userEmail}</strong>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Enter the 4-digit code:
                    </p>
                    <div className="flex justify-center space-x-3">
                      {code.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-14 h-14 text-center text-xl font-bold border-2 focus:border-blue-500"
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-500">
                      Didn't receive the code?
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResend}
                      disabled={!canResend || isResending}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : canResend ? (
                        'Resend Code'
                      ) : (
                        `Resend in ${resendTimer}s`
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleVerify()}
                  className="w-full h-12 text-lg"
                  disabled={isLoading || code.some((digit) => digit === '')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </CardFooter>
            </>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <>
              <CardHeader>
                <CardTitle className="text-center text-green-600 text-2xl">
                  Welcome to LUX Cabinets & Stones!
                </CardTitle>
                <CardDescription className="text-center">
                  You have been successfully logged in.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium mb-2">Welcome back!</p>
                <p className="text-sm text-gray-600 mb-4">
                  You can now access your account and place orders.
                </p>
                <p className="text-sm text-blue-600">
                  Redirecting to homepage in a moment...
                </p>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LUX Cabinets & Stones. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export default AuthPage;
