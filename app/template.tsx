'use client';

import { usePathname } from 'next/navigation';
import DefaultHeader from '@/components/DefaultHeader';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Only render DefaultHeader if not on homepage
  return (
    <>
      {!isHomePage && <DefaultHeader />}
      {children}
    </>
  );
}
