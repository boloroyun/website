'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TopBarButton {
  text?: string;
  link?: string;
  textColor: string;
  backgroundColor: string;
}

interface TopBarData {
  id: string;
  title: string;
  link: string;
  textColor: string;
  backgroundColor?: string;
  button?: TopBarButton;
  createdAt: Date;
  updatedAt: Date;
}

interface TopBarProps {
  topbars: TopBarData[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const TopBar: React.FC<TopBarProps> = ({
  topbars,
  autoSlide = true,
  autoSlideInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || topbars.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % topbars.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, topbars.length]);

  // Don't render if no topbars or not visible
  if (!topbars.length || !isVisible) {
    return null;
  }

  const currentTopBar = topbars[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? topbars.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % topbars.length);
  };

  const closeTopBar = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative w-full text-center py-2 px-4 text-sm font-medium transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: currentTopBar.backgroundColor || '#000000',
        color: currentTopBar.textColor,
      }}
    >
      {/* Navigation arrows (only show if multiple topbars) */}
      {topbars.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Close button */}
      <button
        onClick={closeTopBar}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="flex items-center justify-center gap-4 max-w-6xl mx-auto">
        {/* Main title/link */}
        {currentTopBar.link ? (
          <Link
            href={currentTopBar.link}
            className="hover:underline transition-all duration-200 hover:opacity-80"
            style={{ color: currentTopBar.textColor }}
          >
            {currentTopBar.title}
          </Link>
        ) : (
          <span>{currentTopBar.title}</span>
        )}

        {/* Optional button */}
        {currentTopBar.button && currentTopBar.button.text && (
          <div className="ml-4">
            {currentTopBar.button.link ? (
              <Link
                href={currentTopBar.button.link}
                className="inline-block px-4 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  backgroundColor: currentTopBar.button.backgroundColor,
                  color: currentTopBar.button.textColor,
                }}
              >
                {currentTopBar.button.text}
              </Link>
            ) : (
              <button
                className="px-4 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  backgroundColor: currentTopBar.button.backgroundColor,
                  color: currentTopBar.button.textColor,
                }}
              >
                {currentTopBar.button.text}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dots indicator (only show if multiple topbars) */}
      {topbars.length > 1 && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full pt-1">
          <div className="flex space-x-1">
            {topbars.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-gray-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
