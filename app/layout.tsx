import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import TopBarWrapper from '@/components/TopBarWrapper';
import Navbar from '@/components/Navbar';
import MobileBottomBar from '@/components/MobileBottomBar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { Toaster as CustomToaster } from '@/components/ui/toaster';
import CrispChat from '@/components/CrispChat';
import { FloatingEstimateButton } from '@/components/GetFreeEstimateButton';
import SessionProvider from '@/components/auth/SessionProvider';
import Script from 'next/script';
import SuppressHydrationWarnings from './suppress-hydration-warnings';
import { Providers } from './providers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Lux Cabinets & Stones | Countertops & Cabinets in Virginia',
  description:
    'description: Lux Cabinets & Stones specializes in premium kitchen and bath countertops, cabinets, and stone fabrication in Northern Virginia. Get expert design, free estimates, and professional installation for your home or business.',

  keywords:
    'keywords: best contractor in Virginia, trending kitchen design, countertops Virginia, kitchen countertops Northern Virginia, bathroom countertops Northern Virginia, cabinets Virginia, kitchen cabinets Northern Virginia, granite countertops Virginia, quartz countertops Virginia, marble countertops Virginia, stone fabrication Chantilly VA, custom kitchen cabinets, countertop installation Virginia, cabinet installation Northern Virginia',
  openGraph: {
    title: 'LUX - Premium Products & Services | USA',
    description: 'Premium products and services across the United States',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/images/logo.jpeg',
    shortcut: '/images/logo.jpeg',
    apple: '/images/logo.jpeg',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SuppressHydrationWarnings />
          <Providers>
            {/* The header is now handled within each page, not globally */}
            {children}
            <MobileBottomBar />
            <Footer />
            <FloatingEstimateButton />
            <Toaster position="top-right" richColors />
            <CustomToaster />
            <CrispChat />
          </Providers>
        </SessionProvider>

        {/* Cloudinary Upload Widget (for signed uploads) */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
