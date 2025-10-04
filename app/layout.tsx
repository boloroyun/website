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
import Script from 'next/script';
import SuppressHydrationWarnings from './suppress-hydration-warnings';
import SuppressGrammarly from '@/components/SuppressGrammarly';
import { Providers } from './providers';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactErrorRecovery } from '@/components/ReactErrorRecovery';
import { ClientErrorInit } from '@/components/ClientErrorInit';

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com'
  ),
  title: {
    default:
      'Lux Cabinets & Stones | Premium Countertops & Cabinets in Virginia',
    template: '%s | Lux Cabinets & Stones',
  },
  description:
    'Lux Cabinets & Stones specializes in premium kitchen and bath countertops, cabinets, and stone fabrication in Northern Virginia. Get expert design, free estimates, and professional installation for your home or business.',
  keywords: [
    'kitchen countertops Virginia',
    'bathroom countertops Northern Virginia',
    'cabinets Virginia',
    'kitchen cabinets Northern Virginia',
    'granite countertops Virginia',
    'quartz countertops Virginia',
    'marble countertops Virginia',
    'stone fabrication Chantilly VA',
    'custom kitchen cabinets',
    'countertop installation Virginia',
    'cabinet installation Northern Virginia',
    'kitchen remodeling Virginia',
    'bathroom renovation Northern Virginia',
    'premium countertops',
    'luxury kitchen design',
  ],
  authors: [{ name: 'Lux Cabinets & Stones' }],
  creator: 'Lux Cabinets & Stones',
  publisher: 'Lux Cabinets & Stones',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com',
    siteName: 'Lux Cabinets & Stones',
    title: 'Premium Countertops & Cabinets in Northern Virginia',
    description:
      'Expert design, fabrication and installation of premium countertops and cabinets for kitchens and bathrooms in Northern Virginia.',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Lux Cabinets & Stones Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Cabinets & Stones | Premium Countertops & Cabinets',
    description:
      'Expert design, fabrication and installation of premium countertops and cabinets for kitchens and bathrooms in Northern Virginia.',
    images: ['/images/logo.jpeg'],
    creator: '@luxcabinets',
  },
  icons: {
    icon: '/images/logo.jpeg',
    shortcut: '/images/logo.jpeg',
    apple: '/images/logo.jpeg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_SITE_URL || 'https://luxcabinetsandstones.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
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
        <SuppressHydrationWarnings />
        <SuppressGrammarly />
        <ClientErrorInit />
        <ErrorBoundary>
          <ReactErrorRecovery>
            <Providers>
              {/* The header is now handled within each page, not globally */}
              {children}
              <MobileBottomBar />
              <Footer />
              <Toaster position="top-right" richColors />
              <CustomToaster />
              <CrispChat />
              <PerformanceMonitor />
            </Providers>
          </ReactErrorRecovery>
        </ErrorBoundary>

        {/* Cloudinary Upload Widget (for signed uploads) */}
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          async
        ></script>
      </body>
    </html>
  );
}
