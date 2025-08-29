import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent build-time server action execution
export const dynamic = 'force-dynamic';
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
  const category = searchParams.category;
  const tag = searchParams.tag;
  const search = searchParams.search;

  console.log('📖 Loading blog page with params:', {
    page,
    category,
    tag,
    search,
  });

  // Fetch blog data
  const [blogPostsResult, featuredPostsResult, categoriesResult, tagsResult] =
    await Promise.all([
      getBlogPosts({
        page,
        limit: 12,
        categorySlug: category,
        tagSlug: tag,
        search,
      }),
      getFeaturedBlogPosts(3),
      getBlogCategories(),
      getBlogTags(),
    ]);

  if (!blogPostsResult.success) {
    console.error('❌ Failed to fetch blog posts:', blogPostsResult.error);
    notFound();
  }

  const { posts, pagination } = blogPostsResult.data!;
  const featuredPosts = featuredPostsResult.success
    ? featuredPostsResult.data || []
    : [];
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];
  const tags = tagsResult.success ? tagsResult.data || [] : [];

  console.log(
    `📚 Loaded ${posts.length} posts, ${featuredPosts.length} featured, ${categories.length} categories, ${tags.length} tags`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Hero Section */}
      <BlogHero featuredPosts={featuredPosts} />

      {/* Main Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search Results Header */}
            {(category || tag || search) && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {search && `Search results for "${search}"`}
                  {category &&
                    `Category: ${posts[0]?.category.name || category}`}
                  {tag && `Tag: ${tag}`}
                </h2>
                <p className="text-gray-600">
                  {pagination.totalCount}{' '}
                  {pagination.totalCount === 1 ? 'post' : 'posts'} found
                </p>
              </div>
            )}

            {/* Blog Posts Grid */}
            <BlogGrid posts={posts} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <BlogPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  baseUrl="/blog"
                  searchParams={{ category, tag, search }}
                />
              </div>
            )}

            {/* No Posts Found */}
            {posts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No blog posts found
                </h3>
                <p className="text-gray-600 mb-6">
                  {search || category || tag
                    ? 'Try adjusting your search criteria or browse all posts.'
                    : 'Check back soon for new content!'}
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
                >
                  View All Posts
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar
              categories={categories}
              tags={tags}
              featuredPosts={featuredPosts.slice(0, 3)}
              currentCategory={category}
              currentTag={tag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
