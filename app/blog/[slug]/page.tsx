import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Force dynamic rendering to prevent build-time server action execution
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, Eye, Heart, User, ArrowLeft } from 'lucide-react';
import BlogContent from '@/components/blog/BlogContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BlogComments from '@/components/blog/BlogComments';
import BlogShare from '@/components/blog/BlogShare';
import BlogJsonLd from '@/components/blog/BlogJsonLd';
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getBlogCategories,
  getBlogTags,
} from '@/actions/blog.actions';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const postResult = await getBlogPostBySlug(params.slug);

  if (!postResult.success || !postResult.data) {
    return {
      title: 'Post Not Found | LUX Cabinets & Stones',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  const post = postResult.data;
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const keywords =
    post.metaKeywords ||
    `${post.category.name}, ${post.tags.map((tag) => tag.name).join(', ')}, kitchen design, cabinet design`;
  const publishedTime = post.publishedAt || post.createdAt;
  const modifiedTime = post.updatedAt;
  const imageUrl = post.featuredImage?.url || '/images/blog-default.jpg';

  return {
    title: `${title} | LUX Cabinets & Stones Blog`,
    description,
    keywords,
    authors: [{ name: post.authorName }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${post.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImage?.alt || post.title,
        },
      ],
      publishedTime: publishedTime.toISOString(),
      modifiedTime: modifiedTime.toISOString(),
      section: post.category.name,
      tags: post.tags.map((tag) => tag.name),
      authors: [post.authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: post.authorName,
    },
    other: {
      'article:published_time': publishedTime.toISOString(),
      'article:modified_time': modifiedTime.toISOString(),
      'article:author': post.authorName,
      'article:section': post.category.name,
      'article:tag': post.tags.map((tag) => tag.name).join(','),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log(`📖 Loading blog post: ${params.slug}`);

  // Fetch blog post and related data
  const [postResult, categoriesResult, tagsResult] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getBlogCategories(),
    getBlogTags(),
  ]);

  if (!postResult.success || !postResult.data) {
    console.error('❌ Blog post not found:', params.slug);
    notFound();
  }

  const post = postResult.data;

  // Fetch related posts
  const relatedPostsResult = await getRelatedBlogPosts(
    post.id,
    post.category.id,
    4
  );
  const relatedPosts = relatedPostsResult.success
    ? relatedPostsResult.data || []
    : [];

  const categories = categoriesResult.success ? categoriesResult.data || [] : [];
  const tags = tagsResult.success ? tagsResult.data || [] : [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const estimatedReadTime =
    post.readTime || Math.ceil(post.content.length / 1000);

  console.log(`✅ Blog post loaded: ${post.title}`);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <BlogJsonLd post={post} />

      <article className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="hover:text-gray-900 transition-colors"
              >
                {post.category.name}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate">
                {post.title}
              </span>
            </nav>

            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Category Badge */}
            <div className="mb-4">
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: post.category.color
                    ? `${post.category.color}20`
                    : '#F3F4F6',
                  color: post.category.color || '#374151',
                }}
              >
                {post.category.name}
              </Link>
              {post.featured && (
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{post.authorName}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{estimatedReadTime} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <span>{post.likes.toLocaleString()} likes</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    style={{
                      backgroundColor: tag.color ? `${tag.color}20` : '#F3F4F6',
                      color: tag.color || '#374151',
                    }}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <BlogShare post={post} />
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
              {post.featuredImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <p className="text-sm text-center">
                    {post.featuredImage.caption}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              {/* Author Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <div className="flex items-start space-x-4">
                  {post.authorImage ? (
                    <Image
                      src={post.authorImage}
                      alt={post.authorName}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post.authorName}
                    </h3>
                    {post.authorBio && (
                      <p className="text-gray-600 mt-1">{post.authorBio}</p>
                    )}
                    {post.authorEmail && (
                      <a
                        href={`mailto:${post.authorEmail}`}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        {post.authorEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <BlogContent content={post.content} images={post.images} />

              {/* Comments Section */}
              <div className="mt-12">
                <BlogComments postId={post.id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar
                categories={categories}
                tags={tags}
                featuredPosts={relatedPosts.slice(0, 3)}
                currentCategory={post.category.slug}
              />
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </div>
        )}
      </article>
    </>
  );
}
