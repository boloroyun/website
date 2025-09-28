'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Share2,
  Copy,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'floating' | 'minimal';
}

const SocialShare= ({
  url,
  title = 'Check out LUX Cabinets & Stones',
  description = 'Premium kitchen cabinets and stone surfaces for your dream home.',
  image,
  hashtags = ['LUXCabinets', 'KitchenDesign', 'HomeRenovation'],
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use current page URL if not provided
  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.join(',');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${shareUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
      setIsOpen(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const buttonSizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };

  if (variant === 'floating') {
    return (
      <div
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className={`${sizeClasses[size]} rounded-full shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700`}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" side="left">
            <div className="space-y-3">
              <h4 className="font-semibold text-center">Share this page</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openShareWindow(shareLinks.facebook)}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openShareWindow(shareLinks.twitter)}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openShareWindow(shareLinks.linkedin)}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openShareWindow(shareLinks.whatsapp)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareLinks.email)}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-gray-600" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                  Copy
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`${className} text-gray-500 hover:text-gray-700`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-center">Share this page</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => openShareWindow(shareLinks.facebook)}
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => openShareWindow(shareLinks.twitter)}
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => openShareWindow(shareLinks.linkedin)}
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => openShareWindow(shareLinks.whatsapp)}
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(shareLinks.email)}
                title="Share via Email"
              >
                <Mail className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                title="Copy Link"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.facebook)}
          title="Share on Facebook"
          className={sizeClasses[size]}
        >
          <Facebook className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.twitter)}
          title="Share on Twitter"
          className={sizeClasses[size]}
        >
          <Twitter className="h-4 w-4 text-blue-400" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.linkedin)}
          title="Share on LinkedIn"
          className={sizeClasses[size]}
        >
          <Linkedin className="h-4 w-4 text-blue-700" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => openShareWindow(shareLinks.whatsapp)}
          title="Share on WhatsApp"
          className={sizeClasses[size]}
        >
          <MessageCircle className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(shareLinks.email)}
          title="Share via Email"
          className={sizeClasses[size]}
        >
          <Mail className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          title="Copy Link"
          className={sizeClasses[size]}
        >
          <Copy className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
