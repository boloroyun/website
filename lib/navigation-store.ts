'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NavSubmenuItem {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  href: string;
  iconComponent?: string;
  hasSubmenu?: boolean;
  submenu?: NavSubmenuItem[];
}

interface NavigationState {
  navItems: NavItem[];
  isLoaded: boolean;
  lastFetchTime: number | null;
  setNavItems: (items: NavItem[]) => void;
  shouldRefetch: () => boolean;
}

// Cache navigation data for 5 minutes (300000ms)
const CACHE_DURATION = 300000;

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      navItems: [],
      isLoaded: false,
      lastFetchTime: null,
      setNavItems: (items) => {
        set({
          navItems: items,
          isLoaded: true,
          lastFetchTime: Date.now(),
        });
      },
      shouldRefetch: () => {
        const lastFetch = get().lastFetchTime;
        if (!lastFetch) return true;

        const now = Date.now();
        return now - lastFetch > CACHE_DURATION;
      },
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({
        navItems: state.navItems,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
