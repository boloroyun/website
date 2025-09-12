'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuoteRequestModal from './QuoteRequestModal';
import { emitCrispEvent, CRISP_EVENTS } from '@/lib/crisp-events';
import { useToast } from '@/components/ui/use-toast';

interface GetFreeEstimateButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  showArrow?: boolean;
  className?: string;
}

export default function GetFreeEstimateButton({
  variant = 'primary',
  size = 'md',
  showIcon = true,
  showArrow = false,
  className = '',
}: GetFreeEstimateButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Map custom variants to shadcn button variants
  const buttonVariantMap = {
    primary: 'default',
    secondary: 'secondary',
    outline: 'outline',
    text: 'link',
  };

  // Map custom sizes to tailwind classes
  const sizeClassMap = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-6 py-3',
    xl: 'text-xl px-8 py-4',
  };

  // Generate variant-specific styles
  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary:
      'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50',
    text: 'text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline',
  };

  // Handle quote submission success
  const handleQuoteSubmitted = async (quoteData: any) => {
    try {
      setIsSubmitting(true);

      // Send email notification to info@luxcabistones.com
      const response = await fetch('/api/quotes/email-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_TOKEN || 'dev-token'}`,
        },
        body: JSON.stringify({
          ...quoteData,
          notificationEmail: 'info@luxcabistones.com',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to send email notification:', errorData);
        // Don't show error to user, the quote was still created
      } else {
          toast({
            title: 'Quote Request Sent',
            description:
              "Your quote request has been sent to our team. We'll get back to you soon!",
            duration: 5000,
          });
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    // Track estimate button click
    emitCrispEvent({
      name: CRISP_EVENTS.Quote.OPENED,
      data: {
        source: 'free_estimate_button',
      },
    });

    setShowModal(true);
  };

  return (
    <>
      <Button
        variant={buttonVariantMap[variant] as any}
        onClick={handleClick}
        className={`
          font-medium rounded-lg transition-all duration-300
          ${sizeClassMap[size]}
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {showIcon && (
          <Calculator className={`${showArrow ? 'mr-2' : 'mr-2'} h-5 w-5`} />
        )}
        Get a Quote
        {showArrow && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>

      <QuoteRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialCategory="combo"
        onSubmitSuccess={handleQuoteSubmitted}
      />
    </>
  );
}

// Floating version that can be fixed to bottom of screen
export function FloatingEstimateButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <GetFreeEstimateButton
        variant="secondary"
        size="lg"
        showIcon={true}
        showArrow={true}
        className="rounded-full shadow-xl animate-bounce-subtle"
      />
    </div>
  );
}

// Hero section version with larger size and arrow
export function HeroEstimateButton() {
  return (
    <GetFreeEstimateButton
      variant="secondary"
      size="xl"
      showIcon={true}
      showArrow={true}
      className="font-bold tracking-wide"
    />
  );
}
