'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { triggerAuthLogin } from '@/lib/auth-events';

interface VerificationStepProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

const VerificationStep = ({
  email,
  onSuccess,
  onBack,
}: VerificationStepProps) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([] as (HTMLInputElement | null)[]);

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle input change
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
          email,
          code: verificationCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Verification successful:', result.user);

        // Trigger immediate auth change event
        triggerAuthLogin(result.user);

        onSuccess();
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
        body: JSON.stringify({ email }),
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

  return (
    <>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
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
              We sent a 4-digit code to <strong>{email}</strong>
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
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-14 h-14 text-center text-xl font-bold border-2 focus:border-blue-500"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-500">Didn't receive the code?</p>
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
          className="w-full"
          disabled={isLoading || code.some((digit) => digit === '')}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default VerificationStep;
