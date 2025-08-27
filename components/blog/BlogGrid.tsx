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
} from 'lucide-react';
import { BlogPost } from '@/actions/blog.actions';

interface BlogGridProps {
  posts: BlogPost[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
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
        <article key={post.id} className="group">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-200 group-hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.featuredImage?.url || '/images/blog-default.jpg'}
                  alt={post.featuredImage?.alt || post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {/* Category Badge */}
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white backdrop-blur-sm"
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>

                {/* Read More Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-gray-900" />
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{post.authorName}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    <span>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {post.readTime || Math.ceil(post.content.length / 1000)}{' '}
                      min
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        style={{
                          backgroundColor: tag.color
                            ? `${tag.color}20`
                            : '#F3F4F6',
                          color: tag.color || '#374151',
                        }}
                      >
                        #{tag.name}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    Read More →
                  </span>
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
