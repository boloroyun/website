import React from 'react';
import Link from 'next/link';

interface HeroOverlayProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  showClosets?: boolean;
}

const HeroOverlay: React.FC<HeroOverlayProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  showClosets = false
}) => {
  return (
    <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto md:mx-0 md:ml-16 lg:ml-24 bg-black/25 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl pointer-events-auto inline-block">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-3 animate-pulse">
            PREMIUM QUALITY
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            {title}
          </h1>
          
          <p className="text-sm sm:text-base text-gray-100 mb-4">
            {subtitle}
          </p>
          
          {showClosets && (
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-3 mb-4">
              <h3 className="text-white font-semibold text-sm mb-1">Custom Closet Design</h3>
              <p className="text-white/90 text-xs">
                Transform your space with our elegant custom closet solutions, designed for both style and functionality.
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <Link 
              href={ctaLink}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-blue-500/30"
            >
              {ctaText}
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link 
              href="/category/closets"
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              Explore Closets
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroOverlay;