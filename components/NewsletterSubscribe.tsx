'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle' as 'idle' | 'loading' | 'success' | 'error');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(
          'Successfully subscribed! Thank you for joining our newsletter.'
        );
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-blue-400">STAY UPDATED</h3>
      <p className="text-xs text-gray-300 mb-4 leading-relaxed">
        Get design inspiration, product updates, and exclusive offers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col space-y-3">
          <Input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border-gray-600 bg-gray-800 text-white placeholder-gray-400 text-sm"
            disabled={status === 'loading'}
          />
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>SUBSCRIBING...</span>
              </div>
            ) : status === 'success' ? (
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>SUBSCRIBED!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>SUBSCRIBE</span>
              </div>
            )}
          </Button>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`flex items-start space-x-2 text-xs p-3 rounded-lg ${
              status === 'success'
                ? 'bg-green-900/20 border border-green-400/20 text-green-300'
                : 'bg-red-900/20 border border-red-400/20 text-red-300'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-400 mt-3">
        * We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSubscribe;
