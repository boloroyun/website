'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/actions/blog.actions';

interface BlogHeroProps {
  featuredPosts: BlogPost[];
}

const BlogHero: React.FC<BlogHeroProps> = ({ featuredPosts }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const mainPost = featuredPosts[0];
  const sidePosts = featuredPosts.slice(1, 3);

  if (!mainPost) {
    return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Design Inspiration & Tips
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the latest trends in kitchen design, cabinet styling tips,
            and stone selection guides. Get inspired by our expert insights and
            beautiful project showcases.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Design Inspiration & Tips
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the latest trends in kitchen design, cabinet styling tips,
            and stone selection guides.
          </p>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Articles
          </h2>
          <p className="text-gray-600">
            Handpicked stories and insights from our design experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Post */}
          <div className="lg:col-span-2">
            <Link href={`/blog/${mainPost.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-96 lg:h-[500px]">
                  <Image
                    src={
                      mainPost.featuredImage?.url || '/images/blog-default.jpg'
                    }
                    alt={mainPost.featuredImage?.alt || mainPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white backdrop-blur-sm"
                      style={{
                        backgroundColor: mainPost.category.color
                          ? `${mainPost.category.color}80`
                          : 'rgba(59, 130, 246, 0.8)',
                      }}
                    >
                      {mainPost.category.name}
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                      {mainPost.title}
                    </h3>
                    <p className="text-gray-200 mb-4 line-clamp-2">
                      {mainPost.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{mainPost.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span>
                          {formatDate(
                            mainPost.publishedAt || mainPost.createdAt
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {mainPost.readTime ||
                            Math.ceil(mainPost.content.length / 1000)}{' '}
                          min read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Featured Posts */}
          <div className="space-y-6">
            {sidePosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-200">
                  {/* Image */}
                  <div className="relative h-48">
                    <Image
                      src={
                        post.featuredImage?.url || '/images/blog-default.jpg'
                      }
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
                            ? `${post.category.color}80`
                            : 'rgba(59, 130, 246, 0.8)',
                        }}
                      >
                        {post.category.name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{post.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* View All Posts CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Explore More Stories
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover hundreds of design tips, trends, and inspiration
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
