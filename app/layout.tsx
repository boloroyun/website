import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import TopBarWrapper from '@/components/TopBarWrapper';
import Navbar from '@/components/Navbar';
import MobileBottomBar from '@/components/MobileBottomBar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

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
  title: 'LUX - Premium Products & Services | USA',
  description:
    'Discover premium cabinets, stones, and beauty products across the United States. Fast shipping, expert consultation, and unmatched quality.',
  keywords:
    'premium products, cabinets, stones, beauty, USA, American, quality, luxury',
  openGraph: {
    title: 'LUX - Premium Products & Services | USA',
    description: 'Premium products and services across the United States',
    locale: 'en_US',
    type: 'website',
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
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopBarWrapper />
        <Navbar />
        {children}
        <MobileBottomBar />
        <Footer />
        <Toaster position="top-right" richColors />

        {crispWebsiteId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.$crisp = [];
                window.CRISP_WEBSITE_ID = "${crispWebsiteId}";
                (function() {
                  var d = document;
                  var s = d.createElement("script");
                  s.src = "https://client.crisp.chat/l.js";
                  s.async = 1;
                  d.getElementsByTagName("head")[0].appendChild(s);
                })();
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
