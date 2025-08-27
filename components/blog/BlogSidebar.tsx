'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Tag,
  Folder,
  TrendingUp,
  CalendarDays,
  Eye,
} from 'lucide-react';
import { BlogCategory, BlogTag, BlogPost } from '@/actions/blog.actions';

interface BlogSidebarProps {
  categories: BlogCategory[];
  tags: BlogTag[];
  featuredPosts: BlogPost[];
  currentCategory?: string;
  currentTag?: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  tags,
  featuredPosts,
  currentCategory,
  currentTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Get top categories and tags by post count
  const topCategories = categories
    .filter((cat) => cat.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 8);

  const topTags = tags
    .filter((tag) => tag.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Search Articles
        </h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      {topCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Folder className="w-5 h-5 mr-2" />
            Categories
          </h3>
          <div className="space-y-2">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentCategory === category.slug
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{
                      backgroundColor: category.color || '#6B7280',
                    }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.postCount}
                </span>
              </Link>
            ))}
          </div>
          {categories.length > topCategories.length && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/blog"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all categories →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Popular Tags */}
      {topTags.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  currentTag === tag.slug ? 'text-white' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor:
                    currentTag === tag.slug
                      ? tag.color || '#3B82F6'
                      : tag.color
                        ? `${tag.color}20`
                        : '#F3F4F6',
                  color:
                    currentTag === tag.slug ? 'white' : tag.color || '#374151',
                }}
              >
                #{tag.name}
                <span className="ml-1 text-xs opacity-75">{tag.postCount}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Featured Articles
          </h3>
          <div className="space-y-4">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="flex space-x-3">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={
                        post.featuredImage?.url || '/images/blog-default.jpg'
                      }
                      alt={post.featuredImage?.alt || post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stay Updated
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Get the latest design tips and inspiration delivered to your inbox.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Subscribe Now
          </Link>
        </div>
      </div>

      {/* Archive */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Archive</h3>
        <div className="space-y-2 text-sm">
          <Link
            href="/blog"
            className="block text-gray-600 hover:text-gray-900 transition-colors"
          >
            All Posts
          </Link>
          <Link
            href="/blog?featured=true"
            className="block text-gray-600 hover:text-gray-900 transition-colors"
          >
            Featured Articles
          </Link>
          <Link
            href="/blog?category=kitchen-design"
            className="block text-gray-600 hover:text-gray-900 transition-colors"
          >
            Kitchen Design
          </Link>
          <Link
            href="/blog?category=cabinet-tips"
            className="block text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cabinet Tips
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
