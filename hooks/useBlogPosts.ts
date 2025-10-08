'use client';

import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    url: string;
    public_id: string;
    alt?: string;
    caption?: string;
  };
  images: Array<{
    url: string;
    public_id: string;
    alt?: string;
    caption?: string;
  }>;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  readTime?: number;
  views: number;
  likes: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  authorBio?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UseBlogPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

export interface UseBlogPostsResult {
  posts: BlogPost[];
  pagination: BlogPagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBlogPosts(params: UseBlogPostsParams = {}): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<BlogPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.category) queryParams.set('category', params.category);
      if (params.tag) queryParams.set('tag', params.tag);
      if (params.search) queryParams.set('search', params.search);
      if (params.featured) queryParams.set('featured', 'true');

      const response = await fetch(`/api/public/blog?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }
    } catch (err) {
      console.error('Error loading blog posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [params.page, params.limit, params.category, params.tag, params.search, params.featured]);

  return {
    posts,
    pagination,
    loading,
    error,
    refetch: fetchPosts,
  };
}

// Legacy function for compatibility with existing code
export async function loadBlogPosts() {
  try {
    const response = await fetch('/api/public/blog');
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to fetch blog posts');
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    throw error;
  }
}

// Function to display blog posts (for vanilla JS integration)
export function displayBlogPosts(posts: BlogPost[]) {
  const blogContainer = document.getElementById('blog-posts');
  
  if (!blogContainer) {
    console.error('Blog container element not found');
    return;
  }
  
  blogContainer.innerHTML = posts.map(post => `
    <article class="blog-post bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden mb-6">
      ${post.featuredImage ? `
        <div class="relative h-64 overflow-hidden">
          <img src="${post.featuredImage.url}" alt="${post.title}" class="w-full h-full object-cover">
        </div>
      ` : ''}
      <div class="p-6">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            ${post.category.name}
          </span>
          ${post.featured ? `
            <span class="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Featured
            </span>
          ` : ''}
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">${post.title}</h2>
        <p class="text-gray-600 mb-4">${post.excerpt}</p>
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <span>By ${post.authorName}</span>
          <span class="mx-2">•</span>
          <span>${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          <span class="mx-2">•</span>
          <span>${post.readTime || Math.ceil(post.content.length / 1000)} min read</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>${post.views} views</span>
            <span>${post.likes} likes</span>
          </div>
          <a href="/blog/${post.slug}" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Read More
          </a>
        </div>
      </div>
    </article>
  `).join('');
}
