import React from 'react';

interface SectionSeparatorProps {
  variant?: 'wave' | 'angle' | 'curve' | 'zigzag' | 'gradient';
  position?: 'top' | 'bottom' | 'both';
  color?: string;
  bgColor?: string;
  height?: number;
  className?: string;
}

const SectionSeparator= ({
  variant = 'wave',
  position = 'bottom',
  color = '#ffffff',
  bgColor = 'transparent',
  height = 50,
  className = '',
}) => {
  const renderSeparator = (pos: 'top' | 'bottom') => {
    const isTop = pos === 'top';
    const transform = isTop ? 'rotate(180deg)' : '';
    
    switch (variant) {
      case 'wave':
        return (
          <div
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}
            style={{ transform, height: `${height}px`, backgroundColor: bgColor }}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                width: '100%', 
                height: '100%',
                fill: color,
                display: 'block'
              }}
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
            </svg>
          </div>
        );
        
      case 'angle':
        return (
          <div
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}
            style={{ transform, height: `${height}px`, backgroundColor: bgColor }}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                width: '100%', 
                height: '100%',
                fill: color,
                display: 'block'
              }}
            >
              <path d="M1200 0L0 0 598.97 114.72 1200 0z" />
            </svg>
          </div>
        );
        
      case 'curve':
        return (
          <div
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}
            style={{ transform, height: `${height}px`, backgroundColor: bgColor }}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                width: '100%', 
                height: '100%',
                fill: color,
                display: 'block'
              }}
            >
              <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" />
            </svg>
          </div>
        );
        
      case 'zigzag':
        return (
          <div
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}
            style={{ transform, height: `${height}px`, backgroundColor: bgColor }}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                width: '100%', 
                height: '100%',
                fill: color,
                display: 'block'
              }}
            >
              <path d="M1200 0L0 0 892.25 114.72 1200 0z" strokeWidth="0" />
              <path d="M0 0L0 0 309.26 114.72 0 0z" strokeWidth="0" />
            </svg>
          </div>
        );
        
      case 'gradient':
        return (
          <div
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 ${className}`}
            style={{ 
              height: `${height}px`, 
              background: isTop 
                ? `linear-gradient(to top, transparent, ${color})` 
                : `linear-gradient(to bottom, transparent, ${color})`
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full">
      {(position === 'top' || position === 'both') && renderSeparator('top')}
      {(position === 'bottom' || position === 'both') && renderSeparator('bottom')}
    </div>
  );
};

export default SectionSeparator;
