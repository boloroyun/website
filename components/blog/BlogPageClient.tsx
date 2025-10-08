'use client';

import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPagination from '@/components/blog/BlogPagination';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { Loader2 } from 'lucide-react';

interface BlogPageClientProps {
  initialSearchParams?: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

const BlogPageClient = ({ initialSearchParams = {} }: BlogPageClientProps) => {
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const page = parseInt(searchParams.page || '1', 10);
  const category = searchParams.category;
  const tag = searchParams.tag;
  const search = searchParams.search;

  // Fetch main blog posts
  const {
    posts,
    pagination,
    loading: postsLoading,
    error: postsError,
    refetch,
  } = useBlogPosts({
    page,
    limit: 12,
    category,
    tag,
    search,
  });

  // Fetch featured posts
  const {
    posts: featuredPostsData,
    loading: featuredLoading,
  } = useBlogPosts({
    featured: true,
    limit: 3,
  });

  useEffect(() => {
    if (featuredPostsData) {
      setFeaturedPosts(featuredPostsData);
    }
  }, [featuredPostsData]);

  // Fetch categories and tags
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(`${window.location.origin}/api/blog/categories`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data || []);
          }
        }

        // Fetch tags
        const tagsResponse = await fetch(`${window.location.origin}/api/blog/tags`);
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          if (tagsData.success) {
            setTags(tagsData.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  // Loading state
  if (postsLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Hero */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg mx-auto mb-6 max-w-2xl"></div>
              <div className="h-6 bg-white/10 rounded mx-auto mb-8 max-w-lg"></div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <div id="blog-posts" className="text-lg text-gray-600">
                Loading blog posts...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (postsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Error Loading Blog Posts
            </h3>
            <p className="text-gray-600 mb-6">{postsError}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Hero Section */}
      <BlogHero featuredPosts={featuredPosts} />

      {/* Main Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
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
                  {pagination?.totalCount || 0}{' '}
                  {pagination?.totalCount === 1 ? 'post' : 'posts'} found
                </p>
              </div>
            )}

            {/* Blog Posts Container for Vanilla JS */}
            <div id="blog-posts" className="hidden">
              Loading blog posts...
            </div>

            {/* React Blog Posts Grid */}
            <BlogGrid posts={posts} />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
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
            {posts.length === 0 && !postsLoading && (
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
          <div className="hidden lg:block order-1 lg:order-2 lg:col-span-1">
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

      {/* Vanilla JS Integration Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Add this to your blog page
            const API_URL = '/api/public/blog';

            async function loadBlogPosts() {
              try {
                const response = await fetch(API_URL);
                const data = await response.json();
                
                if (data.success) {
                  displayBlogPosts(data.posts);
                }
              } catch (error) {
                console.error('Error loading blog posts:', error);
              }
            }

            function displayBlogPosts(posts) {
              const blogContainer = document.getElementById('blog-posts');
              
              if (!blogContainer) return;
              
              blogContainer.innerHTML = posts.map(post => \`
                <article class="blog-post bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden mb-6">
                  \${post.featuredImage ? \`<img src="\${post.featuredImage.url}" alt="\${post.title}" class="w-full h-64 object-cover">\` : ''}
                  <div class="p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-3">\${post.title}</h2>
                    <p class="text-gray-600 mb-4">\${post.excerpt}</p>
                    <p class="text-sm text-gray-500 mb-4">By \${post.authorName} on \${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</p>
                    <a href="/blog/\${post.slug}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">Read More</a>
                  </div>
                </article>
              \`).join('');
            }

            // Load posts when page loads (only if vanilla JS container exists)
            if (document.getElementById('blog-posts') && !document.getElementById('blog-posts').classList.contains('hidden')) {
              loadBlogPosts();
            }
          `,
        }}
      />
    </div>
  );
};

export default BlogPageClient;
