'use client';

import React from 'react';
import Image from 'next/image';

interface BlogImage {
  url: string;
  public_id: string;
  alt?: string;
  caption?: string;
}

interface BlogContentProps {
  content: string;
  images: BlogImage[];
}

const BlogContent: React.FC<BlogContentProps> = ({ content, images }) => {
  // Function to process content and inject images
  const processContent = (htmlContent: string) => {
    // This is a simple implementation - you might want to use a more sophisticated HTML parser
    // For now, we'll just render the content and display additional images separately
    return htmlContent;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: processContent(content) }}
          className="
            [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h1]:mt-8 [&>h1]:first:mt-0
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:border-b [&>h2]:border-gray-200 [&>h2]:pb-2
            [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-3 [&>h3]:mt-6
            [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-gray-900 [&>h4]:mb-2 [&>h4]:mt-4
            [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
            [&>ul]:mb-4 [&>ul]:pl-6 [&>ul>li]:text-gray-700 [&>ul>li]:mb-2 [&>ul>li]:list-disc
            [&>ol]:mb-4 [&>ol]:pl-6 [&>ol>li]:text-gray-700 [&>ol>li]:mb-2 [&>ol>li]:list-decimal
            [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:my-6 [&>blockquote]:bg-blue-50 [&>blockquote]:italic [&>blockquote]:text-gray-700
            [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-gray-800
            [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6
            [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-white
            [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800 [&>a]:transition-colors
            [&>strong]:font-semibold [&>strong]:text-gray-900
            [&>em]:italic
            [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>img]:w-full [&>img]:h-auto
            [&>hr]:border-gray-200 [&>hr]:my-8
            [&>table]:w-full [&>table]:border-collapse [&>table]:my-6
            [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-200 [&>table>thead>tr>th]:bg-gray-50 [&>table>thead>tr>th]:px-4 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:text-gray-900
            [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-200 [&>table>tbody>tr>td]:px-4 [&>table>tbody>tr>td]:py-3 [&>table>tbody>tr>td]:text-gray-700
          "
        />
      </div>

      {/* Additional Images Gallery */}
      {images.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-md bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                      <p className="text-sm text-center">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Was this article helpful?</p>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V8a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>Yes</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M5 4H3a2 2 0 00-2 2v6a2 2 0 002 2h2.5"
                  />
                </svg>
                <span>No</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Share Article
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
