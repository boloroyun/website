'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-8 h-8';
      case 'medium':
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${getSizeClass()} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
};
