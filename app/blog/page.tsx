import React from 'react';
import { Metadata } from 'next';
import BlogPageClient from '@/components/blog/BlogPageClient';

// Force dynamic rendering to prevent build-time server action execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog | LUX Cabinets & Stones - Design Inspiration & Tips',
    description:
      'Discover the latest trends in kitchen design, cabinet styling tips, and stone selection guides. Get inspired by our expert insights and beautiful project showcases.',
    keywords:
      'kitchen design, cabinet design, stone selection, interior design, home renovation, kitchen trends, design inspiration',
    openGraph: {
      title: 'Blog | LUX Cabinets & Stones',
      description:
        'Discover the latest trends in kitchen design, cabinet styling tips, and stone selection guides.',
      type: 'website',
      url: '/blog',
      images: [
        {
          url: '/images/blog-hero.jpg',
          width: 1200,
          height: 630,
          alt: 'LUX Blog - Design Inspiration',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | LUX Cabinets & Stones',
      description:
        'Discover the latest trends in kitchen design, cabinet styling tips, and stone selection guides.',
      images: ['/images/blog-hero.jpg'],
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  console.log('📖 Loading blog page with params:', searchParams);

  return <BlogPageClient initialSearchParams={searchParams} />;
}
