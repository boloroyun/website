'use client';

import React from 'react';
import { openChat, sendVisitorMessage, addSessionTag } from '@/lib/crisp';

interface RequestQuoteButtonProps {
  /** Optional product name to include in the quote request message */
  productName?: string;
  /** Custom button text (defaults to "Request a Quote") */
  buttonText?: string;
  /** Additional CSS classes for styling */
  className?: string;
  /** Button variant/style */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

export default function RequestQuoteButton({
  productName,
  buttonText = 'Request a Quote',
  className = '',
  variant = 'primary',
  size = 'md',
}: RequestQuoteButtonProps) {
  const handleRequestQuote = () => {
    console.log('🎯 Request Quote button clicked', { productName });

    // Add session tag for tracking
    addSessionTag('request-quote-click');

    // Open chat
    openChat();

    // Send prefilled message
    const baseMessage = "Hi! I'd like to request a quote";
    const message = productName
      ? `${baseMessage} for ${productName}.`
      : `${baseMessage} for my project.`;

    // Small delay to ensure chat is open before sending message
    setTimeout(() => {
      sendVisitorMessage(message);
    }, 500);
  };

  // Base button styles
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      onClick={handleRequestQuote}
      className={buttonClasses}
      type="button"
      aria-label={
        productName ? `Request quote for ${productName}` : 'Request a quote'
      }
    >
      {buttonText}
    </button>
  );
}
