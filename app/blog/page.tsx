import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent build-time server action execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPagination from '@/components/blog/BlogPagination';
import {
  getBlogPosts,
  getFeaturedBlogPosts,
  getBlogCategories,
  getBlogTags,
} from '@/actions/blog.actions';

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
  const page = parseInt(searchParams.page || '1', 10);

  console.log('📖 Loading blog page with params:', { page });

  try {
    // Test with a simple blog posts fetch
    const blogPostsResult = await getBlogPosts({
      page,
      limit: 12,
    });

    if (!blogPostsResult.success) {
      console.error('❌ Failed to fetch blog posts:', blogPostsResult.error);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Blog Posts
            </h1>
            <p className="text-red-600">
              Error loading blog posts: {blogPostsResult.error}
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-gray-600">
                Debug: Check{' '}
                <a 
                  href="/api/debug/blog-posts" 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  /api/debug/blog-posts
                </a>{' '}
                to see all blog posts in the database.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const { posts, pagination } = blogPostsResult.data;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <div className="text-sm text-gray-600">
              Showing {posts.length} of {pagination.totalCount} posts
              {posts.length === 0 && (
                <div className="mt-2">
                  <a 
                    href="/api/debug/blog-posts" 
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    Debug: Check database →
                  </a>
                </div>
              )}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                No Published Blog Posts Found
              </h2>
              <p className="text-gray-600 mb-6">
                There are currently no published blog posts available.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto">
                <h3 className="font-medium text-blue-900 mb-2">
                  Possible Reasons:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Blog posts exist but are not published</li>
                  <li>• Blog posts have status "draft" instead of "published"</li>
                  <li>• Database connection issues</li>
                  <li>• No blog posts have been created yet</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <a href={`/blog/${post.slug}`} className="block">
                  {post.featuredImage && (
                    <div className="relative overflow-hidden">
                      <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {post.authorName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>
                </a>
                <div className="px-6 pb-4">
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    Read More
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error in blog page:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Posts</h1>
          <p className="text-red-600">Unexpected error loading blog posts</p>
        </div>
      </div>
    );
  }
}
