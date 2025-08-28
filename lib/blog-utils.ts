// Blog utility functions for content management

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function calculateReadTime(content: string): number {
  // Average reading speed is 200-250 words per minute
  // We'll use 200 for a conservative estimate
  const wordsPerMinute = 200;

  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;

  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? 1 : readTime;
}

export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
}

export function extractExcerpt(
  content: string,
  maxLength: number = 160
): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');

  // Get first paragraph or first sentence
  const firstParagraph = text.split('\n')[0];
  const firstSentence = text.split('.')[0];

  let excerpt =
    firstParagraph.length < firstSentence.length
      ? firstParagraph
      : firstSentence;

  return truncateText(excerpt.trim(), maxLength);
}

export function validateBlogPost(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorName: string;
}) {
  const errors: string[] = [];

  if (!post.title?.trim()) {
    errors.push('Title is required');
  }

  if (!post.slug?.trim()) {
    errors.push('Slug is required');
  } else if (!/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push(
      'Slug can only contain lowercase letters, numbers, and hyphens'
    );
  }

  if (!post.excerpt?.trim()) {
    errors.push('Excerpt is required');
  } else if (post.excerpt.length < 50) {
    errors.push('Excerpt must be at least 50 characters long');
  }

  if (!post.content?.trim()) {
    errors.push('Content is required');
  } else if (post.content.length < 200) {
    errors.push('Content must be at least 200 characters long');
  }

  if (!post.categoryId?.trim()) {
    errors.push('Category is required');
  }

  if (!post.authorName?.trim()) {
    errors.push('Author name is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function formatDate(
  date: Date | string,
  format: 'full' | 'short' | 'relative' = 'full'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);

    case 'relative':
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - dateObj.getTime()) / 1000
      );

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;

      return formatDate(dateObj, 'short');

    case 'full':
    default:
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
  }
}

export function generateMetaDescription(
  excerpt: string,
  title: string
): string {
  // Use excerpt if it's good length, otherwise create from title
  if (excerpt.length >= 120 && excerpt.length <= 160) {
    return excerpt;
  }

  if (excerpt.length > 160) {
    return truncateText(excerpt, 160);
  }

  // If excerpt is too short, combine with title
  const combined = `${excerpt} - ${title}`;
  return truncateText(combined, 160);
}

export function generateKeywords(
  title: string,
  categoryName: string,
  tags: string[]
): string {
  const titleWords = title
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 3);
  const allKeywords = [
    ...titleWords,
    categoryName.toLowerCase(),
    ...tags.map((tag) => tag.toLowerCase()),
    'kitchen design',
    'cabinet design',
    'interior design',
    'home renovation',
  ];

  // Remove duplicates and join
  const uniqueKeywords = Array.from(new Set(allKeywords));
  return uniqueKeywords.slice(0, 10).join(', ');
}

// Function to help create blog post data for seeding or admin interfaces
export function createBlogPostData(input: {
  title: string;
  content: string;
  categoryId: string;
  authorName: string;
  authorEmail?: string;
  authorBio?: string;
  tags?: string[];
  featuredImageUrl?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
}) {
  const slug = generateSlug(input.title);
  const excerpt = extractExcerpt(input.content);
  const readTime = calculateReadTime(input.content);
  const publishedAt = input.status === 'published' ? new Date() : null;

  return {
    title: input.title,
    slug,
    excerpt,
    content: input.content,
    readTime,
    publishedAt,
    published: input.status === 'published',
    status: input.status || 'draft',
    featured: input.featured || false,
    categoryId: input.categoryId,
    authorName: input.authorName,
    authorEmail: input.authorEmail,
    authorBio: input.authorBio,
    featuredImage: input.featuredImageUrl
      ? {
          url: input.featuredImageUrl,
          public_id: `blog-${slug}`,
          alt: input.title,
        }
      : undefined,
    metaTitle: input.title,
    metaDescription: generateMetaDescription(excerpt, input.title),
  };
}
