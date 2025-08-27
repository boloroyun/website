'use client';

import React from 'react';
import { BlogPost } from '@/actions/blog.actions';

interface BlogJsonLdProps {
  post: BlogPost;
}

const BlogJsonLd: React.FC<BlogJsonLdProps> = ({ post }) => {
  const publishedDate = post.publishedAt || post.createdAt;
  const modifiedDate = post.updatedAt;
  const imageUrl = post.featuredImage?.url || '/images/blog-default.jpg';

  // Article structured data
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: post.authorName,
      email: post.authorEmail,
      description: post.authorBio,
      image: post.authorImage,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LUX Cabinets & Stones',
      logo: {
        '@type': 'ImageObject',
        url: '/images/logo.png',
        width: 200,
        height: 60,
      },
    },
    datePublished: publishedDate.toISOString(),
    dateModified: modifiedDate.toISOString(),
    url: `/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`,
    },
    articleSection: post.category.name,
    keywords: post.tags.map((tag) => tag.name).join(', '),
    wordCount: Math.ceil(post.content.length / 5), // Rough word count estimation
    timeRequired: `PT${post.readTime || Math.ceil(post.content.length / 1000)}M`,
    inLanguage: 'en-US',
    copyrightYear: publishedDate.getFullYear(),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'LUX Cabinets & Stones',
    },
    about: {
      '@type': 'Thing',
      name: post.category.name,
      description: post.category.description,
    },
    mentions: post.tags.map((tag) => ({
      '@type': 'Thing',
      name: tag.name,
    })),
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: '/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: '/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category.name,
        item: `/blog?category=${post.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `/blog/${post.slug}`,
      },
    ],
  };

  // Website structured data
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LUX Cabinets & Stones Blog',
    url: '/blog',
    description:
      'Design inspiration, kitchen trends, and expert tips for cabinets and stone selection.',
    publisher: {
      '@type': 'Organization',
      name: 'LUX Cabinets & Stones',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: '/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Blog section structured data
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'LUX Cabinets & Stones Blog',
    description:
      'Design inspiration, kitchen trends, and expert tips for cabinets and stone selection.',
    url: '/blog',
    publisher: {
      '@type': 'Organization',
      name: 'LUX Cabinets & Stones',
    },
    blogPost: {
      '@type': 'BlogPosting',
      '@id': `/blog/${post.slug}`,
      headline: post.title,
      datePublished: publishedDate.toISOString(),
      author: {
        '@type': 'Person',
        name: post.authorName,
      },
    },
  };

  return (
    <>
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData, null, 2),
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData, null, 2),
        }}
      />

      {/* Website Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData, null, 2),
        }}
      />

      {/* Blog Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData, null, 2),
        }}
      />
    </>
  );
};

export default BlogJsonLd;
