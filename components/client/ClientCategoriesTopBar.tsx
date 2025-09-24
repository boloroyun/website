'use client';

import React, { useEffect, useState } from 'react';
import CategoriesTopBar from '../CategoriesTopBar';

export function ClientCategoriesTopBar() {
  interface NavItem {
    name: string;
    href: string;
    children?: NavItem[];
  }

  const [categories, setCategories] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/navigation');
        if (!response.ok) {
          throw new Error('Failed to fetch navigation data');
        }

        const data = await response.json();
        const allNavItems = data.success ? data.data || [] : [];

        // Filter to get categories
        const filteredCategories = allNavItems.filter((item: NavItem) => {
          const excludedItems = ['CRAZY DEALS', 'SHOP ALL', 'BESTSELLERS'];
          return !excludedItems.includes(item.name);
        });

        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="h-10 bg-gray-50 animate-pulse"></div>;
  }

  return <CategoriesTopBar categories={categories} />;
}
