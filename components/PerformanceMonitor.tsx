'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const { name, value } = entry as any;

        switch (name) {
          case 'FCP':
            console.log(`🎨 First Contentful Paint: ${Math.round(value)}ms`);
            break;
          case 'LCP':
            console.log(`🖼️ Largest Contentful Paint: ${Math.round(value)}ms`);
            if (value > 2500) {
              console.warn(
                '⚠️ LCP is slow (>2.5s). Consider optimizing images or reducing bundle size.'
              );
            }
            break;
          case 'FID':
            console.log(`⚡ First Input Delay: ${Math.round(value)}ms`);
            if (value > 100) {
              console.warn(
                '⚠️ FID is slow (>100ms). Consider code splitting or reducing JavaScript.'
              );
            }
            break;
          case 'CLS':
            console.log(`📐 Cumulative Layout Shift: ${value.toFixed(3)}`);
            if (value > 0.1) {
              console.warn(
                '⚠️ CLS is high (>0.1). Consider adding dimensions to images and avoiding dynamic content.'
              );
            }
            break;
        }
      });
    });

    // Observe Core Web Vitals
    try {
      observer.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
      });
    } catch (e) {
      // Fallback for browsers that don't support all metrics
      console.log('📊 Performance monitoring partially supported');
    }

    // Monitor bundle size
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log(
        `🌐 Network: ${connection.effectiveType} (${connection.downlink}Mbps)`
      );
    }

    // Monitor memory usage (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log(
        `💾 Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB used`
      );
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded opacity-50 pointer-events-none z-50">
      Performance Monitor Active
    </div>
  );
}
