import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quote Requests | LUX Cabinets & Stones',
  description: 'View your quote request details',
  robots: 'noindex',
};

export default function QuoteRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-slate-50 min-h-screen py-8">{children}</div>;
}
