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
      <div className="bg-[url('/images/blog-hero-bg.jpg')] bg-cover bg-center text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6">
              LUX INSIGHTS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Design Inspiration & Tips
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Discover the latest trends in kitchen design, cabinet styling tips,
              and stone selection guides.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            EDITOR'S PICKS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured Articles
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Handpicked stories and insights from our design experts to inspire your next project
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Post */}
          <div className="lg:col-span-2">
            <Link href={`/blog/${mainPost.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-blue-200 border border-gray-100">
                {/* Image */}
                <div className="relative h-[440px] lg:h-[500px]">
                  <Image
                    src={
                      mainPost.featuredImage?.url || '/images/blog-default.jpg'
                    }
                    alt={mainPost.featuredImage?.alt || mainPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* New Reading Status */}
                  <div className="absolute top-6 right-6">
                    <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/20">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      Featured Story
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium text-white backdrop-blur-md shadow-lg"
                      style={{
                        backgroundColor: mainPost.category.color
                          ? `${mainPost.category.color}90`
                          : 'rgba(59, 130, 246, 0.8)',
                      }}
                    >
                      {mainPost.category.name}
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-white transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {mainPost.title}
                    </h3>
                    <p className="text-gray-100 mb-6 line-clamp-3 max-w-3xl text-lg">
                      {mainPost.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{mainPost.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <span>
                          {formatDate(
                            mainPost.publishedAt || mainPost.createdAt
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span>
                          {mainPost.readTime ||
                            Math.ceil(mainPost.content.length / 1000)}{' '}
                          min read
                        </span>
                      </div>
                    </div>
                    
                    {/* Read more button */}
                    <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-transform duration-500">
                        <ArrowRight className="w-5 h-5" />
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-100 hover:bg-blue-50/20">
                  {/* Image */}
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-56 md:h-32 md:w-36 md:flex-shrink-0">
                      <Image
                        src={
                          post.featuredImage?.url || '/images/blog-default.jpg'
                        }
                        alt={post.featuredImage?.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent opacity-60"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm shadow-sm"
                          style={{
                            backgroundColor: post.category.color
                              ? `${post.category.color}90`
                              : 'rgba(59, 130, 246, 0.8)',
                          }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                            <User className="w-3 h-3" />
                          </div>
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
                </div>
              </Link>
            ))}

            {/* View All Posts CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center border border-blue-400/20 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10"></div>
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Explore More Stories
                </h3>
                <p className="text-blue-100 mb-6">
                  Discover hundreds of design tips, trends, and inspiration
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-lg"
                >
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
