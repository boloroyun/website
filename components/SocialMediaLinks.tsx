'use client';

import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

// Custom Pinterest and TikTok icons
const PinterestIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
  </svg>
);

const TikTokIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export const socialMediaLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=100077834019795',
    icon: Facebook,
    color: 'hover:text-blue-600',
    bgColor: 'bg-blue-600/20 hover:bg-blue-600',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/luxcabistones/',
    icon: Instagram,
    color: 'hover:text-pink-600',
    bgColor: 'bg-pink-600/20 hover:bg-pink-600',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@LUXCabinetsStones',
    icon: Youtube,
    color: 'hover:text-red-600',
    bgColor: 'bg-red-600/20 hover:bg-red-600',
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com/076iuae2zizrvl52yffotd3mrm5alu/',
    icon: PinterestIcon,
    color: 'hover:text-red-500',
    bgColor: 'bg-red-500/20 hover:bg-red-500',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@luxcabinetstones',
    icon: TikTokIcon,
    color: 'hover:text-gray-800',
    bgColor: 'bg-gray-800/20 hover:bg-gray-800',
  },
];

interface SocialMediaLinksProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
  iconClassName?: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  variant = 'horizontal',
  size = 'md',
  showLabels = false,
  className = '',
  iconClassName = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const containerClasses = {
    horizontal: 'flex flex-wrap gap-3',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 sm:grid-cols-3 gap-3',
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {socialMediaLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses[size]} ${social.bgColor} flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 text-white ${iconClassName}`}
            aria-label={`Follow LUX Cabinets & Stones on ${social.name}`}
            title={`Follow us on ${social.name}`}
          >
            <IconComponent size={iconSizes[size]} />
            {showLabels && (
              <span className="ml-2 text-sm font-medium">{social.name}</span>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
