'use client';

import React, { useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { BlogPost } from '@/actions/blog.actions';

interface BlogShareProps {
  post: BlogPost;
}

const BlogShare: React.FC<BlogShareProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${post.slug}`
      : '';
  const shareTitle = post.title;
  const shareDescription = post.excerpt;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}&via=LUXCabinets`,
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${currentUrl}`)}`,
      color: 'hover:bg-green-500 hover:text-white',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this article: ${shareTitle}\n\n${shareDescription}\n\nRead more: ${currentUrl}`)}`,
      color: 'hover:bg-gray-600 hover:text-white',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-2">
        <Share2 className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Share this article:
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Social Share Buttons */}
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg border border-gray-200 text-gray-600 transition-all duration-200 ${link.color}`}
            title={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
          </a>
        ))}

        {/* Copy Link Button */}
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
          title="Copy link"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      {/* Copy Success Message */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default BlogShare;
