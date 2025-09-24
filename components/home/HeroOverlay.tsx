import React from 'react';
import Link from 'next/link';
import { HeroEstimateButton } from '@/components/GetFreeEstimateButton';

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
            <div className="w-1/2 xs:w-auto">
              <HeroEstimateButton />
            </div>

            <div className="w-1/2 xs:w-auto">
              <Link
                href="/category/closets"
                className="inline-flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm
                        text-white text-[10px] sm:text-sm border border-white/30 rounded-md sm:rounded-lg font-medium
                        hover:bg-white/20 transition-all w-full text-center h-full"
              >
                Explore
                <svg
                  className="w-2.5 h-2.5 sm:w-4 sm:h-4 ml-1 sm:ml-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroOverlay;
