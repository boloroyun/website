'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/actions/blog.actions';

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts= ({ posts }) => {
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
    <section>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Related Articles
        </h2>
        <p className="text-gray-600">
          Continue exploring our design insights and tips
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-200 group-hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.featuredImage?.url || '/images/blog-default.jpg'}
                    alt={post.featuredImage?.alt || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm"
                      style={{
                        backgroundColor: post.category.color
                          ? `${post.category.color}90`
                          : 'rgba(59, 130, 246, 0.9)',
                      }}
                    >
                      {post.category.name}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white backdrop-blur-sm">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <CalendarDays className="w-3 h-3 mr-1" />
                      <span>
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {post.readTime || Math.ceil(post.content.length / 1000)}{' '}
                        min
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
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
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      By {post.authorName}
                    </span>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* View All Posts CTA */}
      <div className="text-center mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          View All Articles
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default RelatedPosts;
