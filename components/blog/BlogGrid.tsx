'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  User,
  Eye,
  Heart,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { BlogPost } from '@/actions/blog.actions';

interface BlogGridProps {
  posts: BlogPost[];
}

const BlogGrid = ({ posts }: BlogGridProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post, index) => (
        <article key={post.id} className="group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <Link href={`/blog/${post.slug}`} className="block h-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 h-full
              group-hover:shadow-xl group-hover:border-blue-100 group-hover:-translate-y-1 group-hover:shadow-blue-100/20">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.featuredImage?.url || '/images/blog-default.jpg'}
                  alt={post.featuredImage?.alt || post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {/* Category Badge */}
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white backdrop-blur-md shadow-sm"
                    style={{
                      backgroundColor: post.category.color
                        ? `${post.category.color}90`
                        : 'rgba(59, 130, 246, 0.9)',
                    }}
                  >
                    {post.category.name}
                  </span>

                  {/* Featured Badge */}
                  {post.featured && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white backdrop-blur-md shadow-sm">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                      Featured
                    </span>
                  )}
                </div>

                {/* Read More Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-blue-600 transform group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col h-[calc(100%-16rem)]">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="font-medium">{post.authorName}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <CalendarDays className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span>
                      {post.readTime || Math.ceil(post.content.length / 1000)}{' '}
                      min read
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: tag.color
                            ? `${tag.color}15`
                            : '#F3F4F6',
                          color: tag.color || '#374151',
                          border: `1px solid ${tag.color ? `${tag.color}30` : '#e5e7eb'}`,
                        }}
                      >
                        #{tag.name}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default BlogGrid;
