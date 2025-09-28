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
  showClosets = false,
}) => {
  return (
    <div className="absolute inset-0 flex items-start pt-8 sm:items-center sm:pt-0 z-10 pointer-events-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Updated for much smaller mobile display */}
        <div
          className="max-w-full sm:max-w-md mx-auto md:mx-0 md:ml-8 lg:ml-16 xl:ml-24 
                      bg-black/30 backdrop-blur-sm p-2.5 sm:p-6 rounded-lg border border-white/10 
                      shadow-xl pointer-events-auto inline-block w-[70%] sm:w-auto"
        >
          <span
            className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 bg-white/20 text-white text-[8px] sm:text-xs 
                         font-medium rounded-full mb-1 sm:mb-3 animate-pulse"
          >
            PREMIUM QUALITY
          </span>

          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
            {title}
          </h1>

          <p className="text-[10px] sm:text-sm md:text-base text-gray-100 mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-none">
            {subtitle}
          </p>

          {showClosets && (
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-1.5 sm:p-3 mb-2 sm:mb-4">
              <h3 className="text-white font-semibold text-[10px] sm:text-sm mb-0.5 sm:mb-1">
                Custom Closet Design
              </h3>
              <p className="text-white/90 text-[8px] sm:text-xs line-clamp-1 sm:line-clamp-none">
                Transform your space with our elegant custom closet solutions.
              </p>
            </div>
          )}

          <div className="flex flex-row flex-wrap gap-1.5 sm:gap-3">
            <div className="w-full">
              <Link
                href="/category/closets"
                className="group relative inline-flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 
                          bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                          hover:from-purple-600 hover:via-pink-600 hover:to-red-600
                          text-white text-xs sm:text-base font-bold rounded-xl sm:rounded-2xl 
                          shadow-lg hover:shadow-2xl transform hover:scale-105 
                          transition-all duration-300 ease-out w-full text-center
                          border-2 border-white/20 hover:border-white/40
                          animate-pulse hover:animate-none
                          overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>

                {/* Content */}
                <span className="relative z-10 flex items-center">
                  ✨ Explore Collection ✨
                  <svg
                    className="w-3 h-3 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroOverlay;
