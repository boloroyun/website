import React from 'react';
import Link from 'next/link';

interface HeroOverlayProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const HeroOverlay: React.FC<HeroOverlayProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
          <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-4 animate-pulse">
            PREMIUM QUALITY
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-lg text-gray-100 mb-8">
            {subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href={ctaLink}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30"
            >
              {ctaText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link 
              href="/category/all"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              Browse Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
