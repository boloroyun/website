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

const BlogSidebar= ({
  categories,
  tags,
  featuredPosts,
  currentCategory,
  currentTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: any) => {
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up">
        <div className="flex items-center mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 ml-3">
            Search Articles
          </h3>
        </div>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type keywords to search..."
              className="w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      {topCategories.length > 0 && (
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center mb-5">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 ml-3">Categories</h3>
          </div>

          <div className="space-y-3">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className={`group flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 ${
                  currentCategory === category.slug
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center transition-all group-hover:scale-110 ${
                      currentCategory === category.slug
                        ? 'animate-pulse-glow'
                        : ''
                    }`}
                    style={{
                      backgroundColor: category.color
                        ? `${category.color}30`
                        : '#f3f4f6',
                      boxShadow:
                        currentCategory === category.slug
                          ? `0 0 8px ${category.color || 'rgba(59, 130, 246, 0.5)'}`
                          : 'none',
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: category.color || '#6B7280',
                      }}
                    />
                  </div>
                  <span
                    className={`font-medium ${currentCategory === category.slug ? 'text-blue-700' : 'text-gray-800'}`}
                  >
                    {category.name}
                  </span>
                </div>
                <div
                  className={`text-sm px-3 py-1 rounded-full transition-all ${
                    currentCategory === category.slug
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  {category.postCount}
                </div>
              </Link>
            ))}
          </div>

          {categories.length > topCategories.length && (
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View all categories
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Popular Tags */}
      {topTags.length > 0 && (
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center mb-5">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 ml-3">
              Popular Tags
            </h3>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-2">
            {topTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className={`group inline-flex items-center px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentTag === tag.slug
                    ? 'text-white shadow-md transform hover:scale-105'
                    : 'hover:opacity-90 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-0.5 hover:shadow-sm'
                }`}
                style={{
                  backgroundColor:
                    currentTag === tag.slug
                      ? tag.color || '#3B82F6'
                      : tag.color
                        ? `${tag.color}10`
                        : '#F3F4F6',
                  color:
                    currentTag === tag.slug ? 'white' : tag.color || '#374151',
                  boxShadow:
                    currentTag === tag.slug
                      ? `0 4px 12px ${tag.color ? `${tag.color}40` : 'rgba(59, 130, 246, 0.3)'}`
                      : 'none',
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${currentTag === tag.slug ? 'bg-white/80' : ''}`}
                  style={{
                    backgroundColor:
                      currentTag === tag.slug
                        ? 'rgba(255,255,255,0.8)'
                        : tag.color || '#374151',
                  }}
                ></span>
                {tag.name}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                    currentTag === tag.slug
                      ? 'bg-white/20'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}
                >
                  {tag.postCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center mb-5">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 ml-3">
              Editor's Picks
            </h3>
          </div>

          <div className="space-y-5">
            {featuredPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="flex space-x-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <Image
                      src={
                        post.featuredImage?.url || '/images/blog-default.jpg'
                      }
                      alt={post.featuredImage?.alt || post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Number Badge */}
                    <div className="absolute top-0 left-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-6 h-6 flex items-center justify-center text-xs font-medium shadow-md">
                      {index + 1}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
      <div
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl overflow-hidden relative animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Glowing Orb */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
            <svg
              className="w-8 h-8 text-white"
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
          <h3 className="text-xl font-bold text-white mb-3">Stay Updated</h3>
          <p className="text-blue-100 mb-6">
            Get design tips and inspiration delivered directly to your inbox.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-lg"
          >
            Subscribe Now
          </Link>
        </div>
      </div>

      {/* Archive */}
      <div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="flex items-center mb-5">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 ml-3">
            Browse Articles
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Link
            href="/blog"
            className="flex items-center p-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-gray-200"
          >
            <svg
              className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            All Posts
          </Link>
          <Link
            href="/blog?featured=true"
            className="flex items-center p-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-gray-200"
          >
            <svg
              className="w-4 h-4 mr-2 text-yellow-500 group-hover:text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Featured
          </Link>
          <Link
            href="/blog?category=kitchen-design"
            className="flex items-center p-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-gray-200"
          >
            <svg
              className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Kitchen Design
          </Link>
          <Link
            href="/blog?category=cabinet-tips"
            className="flex items-center p-3 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-gray-200"
          >
            <svg
              className="w-4 h-4 mr-2 text-purple-500 group-hover:text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Cabinet Tips
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link
            href="/blog/archive"
            className="text-sm text-gray-600 hover:text-blue-600 inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Browse full archive
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
