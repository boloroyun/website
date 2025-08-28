'use server';

import prisma from '@/lib/prisma';

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
    color?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  image?: {
    url: string;
    public_id: string;
  };
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  postCount: number;
}

// Get all published blog posts with pagination
export async function getBlogPosts(options?: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  search?: string;
}) {
  try {
    const {
      page = 1,
      limit = 12,
      categorySlug,
      tagSlug,
      featured,
      search,
    } = options || {};

    console.log(`📖 Fetching blog posts (page: ${page}, limit: ${limit})`);

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      published: true,
      status: 'published',
    };

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    if (tagSlug) {
      whereClause.tags = {
        some: {
          tag: { slug: tagSlug },
        },
      };
    }

    if (featured !== undefined) {
      whereClause.featured = featured;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              color: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true,
                },
              },
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where: whereClause }),
    ]);

    const formattedPosts: BlogPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url || '',
            public_id: post.featuredImage.public_id || '',
            alt: post.featuredImage.alt || undefined,
            caption: post.featuredImage.caption || undefined,
          }
        : undefined,
      images: post.images.map((image) => ({
        url: image.url || '',
        public_id: image.public_id || '',
        alt: image.alt || undefined,
        caption: image.caption || undefined,
      })),
      status: post.status as 'draft' | 'published' | 'archived',
      featured: post.featured,
      published: post.published,
      publishedAt: post.publishedAt || undefined,
      readTime: post.readTime || undefined,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      metaKeywords: post.metaKeywords || undefined,
      authorName: post.authorName || 'Anonymous',
      authorEmail: post.authorEmail || undefined,
      authorImage: post.authorImage || undefined,
      authorBio: post.authorBio || undefined,
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description || undefined,
        color: post.category.color || undefined,
      },
      tags: post.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
        slug: tagRelation.tag.slug,
        color: tagRelation.tag.color || undefined,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log(`📚 Found ${posts.length} blog posts (${totalCount} total)`);

    return {
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    };
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return {
      success: false,
      error: 'Failed to fetch blog posts',
      details: error,
    };
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    console.log(`📖 Fetching blog post: ${slug}`);

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
        status: 'published',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            color: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
        comments: {
          where: { approved: true, parentId: null },
          include: {
            replies: {
              where: { approved: true },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        error: 'Blog post not found',
      };
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: post.views + 1 },
    });

    const formattedPost: BlogPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url || '',
            public_id: post.featuredImage.public_id || '',
            alt: post.featuredImage.alt || undefined,
            caption: post.featuredImage.caption || undefined,
          }
        : undefined,
      images: post.images.map((image) => ({
        url: image.url || '',
        public_id: image.public_id || '',
        alt: image.alt || undefined,
        caption: image.caption || undefined,
      })),
      status: post.status as 'draft' | 'published' | 'archived',
      featured: post.featured,
      published: post.published,
      publishedAt: post.publishedAt || undefined,
      readTime: post.readTime || undefined,
      views: post.views + 1, // Include the incremented view
      likes: post.likes,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      metaKeywords: post.metaKeywords || undefined,
      authorName: post.authorName || 'Anonymous',
      authorEmail: post.authorEmail || undefined,
      authorImage: post.authorImage || undefined,
      authorBio: post.authorBio || undefined,
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description || undefined,
        color: post.category.color || undefined,
      },
      tags: post.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
        slug: tagRelation.tag.slug,
        color: tagRelation.tag.color || undefined,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    console.log(`✅ Blog post found: ${post.title}`);

    return {
      success: true,
      data: formattedPost,
    };
  } catch (error) {
    console.error('❌ Error fetching blog post:', error);
    return {
      success: false,
      error: 'Failed to fetch blog post',
      details: error,
    };
  }
}

// Get featured blog posts
export async function getFeaturedBlogPosts(limit: number = 6) {
  try {
    console.log(`⭐ Fetching featured blog posts (limit: ${limit})`);

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
        featured: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            color: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    const formattedPosts: BlogPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url || '',
            public_id: post.featuredImage.public_id || '',
            alt: post.featuredImage.alt || undefined,
            caption: post.featuredImage.caption || undefined,
          }
        : undefined,
      images: post.images.map((image) => ({
        url: image.url || '',
        public_id: image.public_id || '',
        alt: image.alt || undefined,
        caption: image.caption || undefined,
      })),
      status: post.status as 'draft' | 'published' | 'archived',
      featured: post.featured,
      published: post.published,
      publishedAt: post.publishedAt || undefined,
      readTime: post.readTime || undefined,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      metaKeywords: post.metaKeywords || undefined,
      authorName: post.authorName || 'Anonymous',
      authorEmail: post.authorEmail || undefined,
      authorImage: post.authorImage || undefined,
      authorBio: post.authorBio || undefined,
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description || undefined,
        color: post.category.color || undefined,
      },
      tags: post.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
        slug: tagRelation.tag.slug,
        color: tagRelation.tag.color || undefined,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    console.log(`⭐ Found ${posts.length} featured blog posts`);

    return {
      success: true,
      data: formattedPosts,
    };
  } catch (error) {
    console.error('❌ Error fetching featured blog posts:', error);
    return {
      success: false,
      error: 'Failed to fetch featured blog posts',
      details: error,
    };
  }
}

// Get all blog categories
export async function getBlogCategories() {
  try {
    console.log('📂 Fetching blog categories...');

    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true,
                status: 'published',
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedCategories: BlogCategory[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || undefined,
      color: category.color || undefined,
      image: category.image
        ? {
            url: category.image.url || '',
            public_id: category.image.public_id || '',
          }
        : undefined,
      postCount: category._count.posts,
    }));

    console.log(`📂 Found ${categories.length} blog categories`);

    return {
      success: true,
      data: formattedCategories,
    };
  } catch (error) {
    console.error('❌ Error fetching blog categories:', error);
    return {
      success: false,
      error: 'Failed to fetch blog categories',
      details: error,
    };
  }
}

// Get all blog tags
export async function getBlogTags() {
  try {
    console.log('🏷️ Fetching blog tags...');

    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  published: true,
                  status: 'published',
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedTags: BlogTag[] = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color || undefined,
      postCount: tag._count.posts,
    }));

    console.log(`🏷️ Found ${tags.length} blog tags`);

    return {
      success: true,
      data: formattedTags,
    };
  } catch (error) {
    console.error('❌ Error fetching blog tags:', error);
    return {
      success: false,
      error: 'Failed to fetch blog tags',
      details: error,
    };
  }
}

// Get related blog posts
export async function getRelatedBlogPosts(
  postId: string,
  categoryId: string,
  limit: number = 4
) {
  try {
    console.log(`🔗 Fetching related blog posts for post: ${postId}`);

    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
        categoryId: categoryId,
        id: { not: postId },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            color: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    });

    const formattedPosts: BlogPost[] = relatedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url || '',
            public_id: post.featuredImage.public_id || '',
            alt: post.featuredImage.alt || undefined,
            caption: post.featuredImage.caption || undefined,
          }
        : undefined,
      images: post.images.map((image) => ({
        url: image.url || '',
        public_id: image.public_id || '',
        alt: image.alt || undefined,
        caption: image.caption || undefined,
      })),
      status: post.status as 'draft' | 'published' | 'archived',
      featured: post.featured,
      published: post.published,
      publishedAt: post.publishedAt || undefined,
      readTime: post.readTime || undefined,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      metaKeywords: post.metaKeywords || undefined,
      authorName: post.authorName || 'Anonymous',
      authorEmail: post.authorEmail || undefined,
      authorImage: post.authorImage || undefined,
      authorBio: post.authorBio || undefined,
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description || undefined,
        color: post.category.color || undefined,
      },
      tags: post.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
        slug: tagRelation.tag.slug,
        color: tagRelation.tag.color || undefined,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    console.log(`🔗 Found ${relatedPosts.length} related blog posts`);

    return {
      success: true,
      data: formattedPosts,
    };
  } catch (error) {
    console.error('❌ Error fetching related blog posts:', error);
    return {
      success: false,
      error: 'Failed to fetch related blog posts',
      details: error,
    };
  }
}

// Search blog posts
export async function searchBlogPosts(query: string, limit: number = 10) {
  try {
    console.log(`🔍 Searching blog posts: "${query}"`);

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { metaKeywords: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            color: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    });

    const formattedPosts: BlogPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url || '',
            public_id: post.featuredImage.public_id || '',
            alt: post.featuredImage.alt || undefined,
            caption: post.featuredImage.caption || undefined,
          }
        : undefined,
      images: post.images.map((image) => ({
        url: image.url || '',
        public_id: image.public_id || '',
        alt: image.alt || undefined,
        caption: image.caption || undefined,
      })),
      status: post.status as 'draft' | 'published' | 'archived',
      featured: post.featured,
      published: post.published,
      publishedAt: post.publishedAt || undefined,
      readTime: post.readTime || undefined,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      metaKeywords: post.metaKeywords || undefined,
      authorName: post.authorName || 'Anonymous',
      authorEmail: post.authorEmail || undefined,
      authorImage: post.authorImage || undefined,
      authorBio: post.authorBio || undefined,
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description || undefined,
        color: post.category.color || undefined,
      },
      tags: post.tags.map((tagRelation) => ({
        id: tagRelation.tag.id,
        name: tagRelation.tag.name,
        slug: tagRelation.tag.slug,
        color: tagRelation.tag.color || undefined,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    console.log(`🔍 Found ${posts.length} blog posts matching "${query}"`);

    return {
      success: true,
      data: formattedPosts,
    };
  } catch (error) {
    console.error('❌ Error searching blog posts:', error);
    return {
      success: false,
      error: 'Failed to search blog posts',
      details: error,
    };
  }
}
