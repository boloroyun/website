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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12">
      {/* Main Content */}
      <div className="prose prose-lg prose-blue max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: processContent(content) }}
          className="
            [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h1]:mt-10 [&>h1]:first:mt-0 [&>h1]:leading-tight
            [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-5 [&>h2]:mt-10 [&>h2]:leading-tight
            [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-4 [&>h3]:mt-8
            [&>h4]:text-lg [&>h4]:md:text-xl [&>h4]:font-semibold [&>h4]:text-gray-900 [&>h4]:mb-3 [&>h4]:mt-6
            
            [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-base [&>p]:md:text-lg [&>p]:tracking-normal [&>p]:break-words [&>p]:text-pretty
            
            [&>ul]:mb-6 [&>ul]:pl-6 [&>ul>li]:text-gray-700 [&>ul>li]:mb-2 [&>ul>li]:list-disc [&>ul>li]:leading-relaxed [&>ul>li]:text-base [&>ul>li]:md:text-lg [&>ul>li]:pl-2
            [&>ol]:mb-6 [&>ol]:pl-6 [&>ol>li]:text-gray-700 [&>ol>li]:mb-2 [&>ol>li]:list-decimal [&>ol>li]:leading-relaxed [&>ol>li]:text-base [&>ol>li]:md:text-lg [&>ol>li]:pl-2
            
            [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-8 [&>blockquote]:bg-blue-50 [&>blockquote]:rounded-r-lg [&>blockquote]:text-gray-700 [&>blockquote]:shadow-sm
            [&>blockquote>p]:text-lg [&>blockquote>p]:md:text-xl [&>blockquote>p]:leading-relaxed [&>blockquote>p]:mb-0 [&>blockquote>p]:italic [&>blockquote>p]:text-gray-700
            
            [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-blue-700
            [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-5 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:shadow-lg
            [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-white
            
            [&>a]:text-blue-600 [&>a]:font-medium [&>a]:underline-offset-2 [&>a]:decoration-blue-300 [&>a]:hover:text-blue-800 [&>a]:hover:decoration-blue-500 [&>a]:transition-colors [&>a]:underline
            
            [&>strong]:font-semibold [&>strong]:text-gray-900
            [&>em]:italic
            
            [&>img]:rounded-xl [&>img]:shadow-lg [&>img]:my-8 [&>img]:w-full [&>img]:h-auto [&>img]:border [&>img]:border-gray-100
            
            [&>figure]:my-8
            [&>figure>img]:rounded-xl [&>figure>img]:shadow-lg [&>figure>img]:w-full [&>figure>img]:h-auto [&>figure>img]:border [&>figure>img]:border-gray-100
            [&>figure>figcaption]:text-center [&>figure>figcaption]:text-gray-500 [&>figure>figcaption]:mt-3 [&>figure>figcaption]:text-sm
            
            [&>hr]:border-gray-200 [&>hr]:my-12
            
            [&>table]:w-full [&>table]:border-collapse [&>table]:my-8 [&>table]:shadow-sm [&>table]:rounded-lg [&>table]:overflow-hidden
            [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-200 [&>table>thead>tr>th]:bg-gray-100 [&>table>thead>tr>th]:px-6 [&>table>thead>tr>th]:py-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:text-gray-900
            [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-200 [&>table>tbody>tr>td]:px-6 [&>table>tbody>tr>td]:py-3 [&>table>tbody>tr>td]:text-gray-700
            [&>table>tbody>tr]:odd:bg-gray-50
            
            [&>h2+p]:text-lg [&>h2+p]:md:text-xl [&>h2+p]:leading-relaxed [&>h2+p]:text-gray-700
            
            [&>*:first-child]:mt-0
          "
        />
      </div>

      {/* Additional Images Gallery */}
      {images.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 ml-4">Image Gallery</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 border border-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-black/50 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm text-center">{image.caption}</p>
                    </div>
                  )}
                  
                  {/* Image overlay button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Navigation */}
      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8">
          {/* Article Feedback */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex-1 lg:max-w-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Was this article helpful?
            </h4>
            
            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors group">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-green-600"
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
                <span className="font-medium">Yes, it helped</span>
              </button>
              
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors group">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-red-600"
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
                <span className="font-medium">Not really</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-500 mt-4 text-center">
              Your feedback helps us improve our content
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 flex-1">
            <div className="text-lg font-semibold text-gray-900 mb-2">Share this article</div>
            
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
              
              <button className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-sky-500 hover:bg-sky-600 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
              
              <button className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
                </svg>
                LinkedIn
              </button>
            
              <button className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Copy Link
              </button>
            </div>
            
            <div className="mt-4">
              <button className="w-full inline-flex items-center justify-center space-x-2 py-3 px-6 border border-blue-600 text-blue-600 rounded-lg bg-white hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="font-medium">Save Article for Later</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Table of Contents - Mobile/Tablet Floating Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
