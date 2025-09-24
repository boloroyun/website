'use client';

import React, { useEffect, useState } from 'react';
import TopBar from '../TopBar';

export function ClientTopBar() {
  const [topbars, setTopbars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopbars = async () => {
      try {
        const response = await fetch('/api/topbars');
        if (!response.ok) {
          throw new Error('Failed to fetch topbars');
        }

        const data = await response.json();
        const topbarItems = data.success ? data.data || [] : [];
        setTopbars(topbarItems);
      } catch (error) {
        console.error('Error fetching topbars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopbars();
  }, []);

  if (loading) {
    return <div className="h-8 bg-gray-100 animate-pulse"></div>;
  }

  if (topbars.length === 0) {
    return null;
  }

  return <TopBar topbars={topbars} autoSlide={true} autoSlideInterval={6000} />;
}
