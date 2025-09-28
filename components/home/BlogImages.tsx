import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BlogImages = () => {
  const images = [
    {
      src: '/images/i1.jpeg',
      alt: 'Modern Kitchen',
      title: 'Contemporary Kitchen Design',
      category: 'Kitchen',
    },
    {
      src: '/images/i2.jpeg',
      alt: 'Kitchen Design',
      title: 'Elegant Countertops',
      category: 'Countertops',
    },
    {
      src: '/images/i14.jpeg',
      alt: 'Interior Design',
      title: 'Luxury Interior Solutions',
      category: 'Interior',
    },
    {
      src: '/images/i3.jpeg',
      alt: 'Home Design',
      title: 'Custom Home Renovations',
      category: 'Renovation',
    },
    {
      src: '/images/i11.jpeg',
      alt: 'Bathroom Design',
      title: 'Premium Bathroom',
      category: 'Bathroom',
    },
    {
      src: '/images/customkit.jpg',
      alt: 'Cabinet Design',
      title: 'Premium Custom Cabinets',
      category: 'Cabinets',
    },

    {
      src: '/images/closet.jpg',
      alt: 'Cabinet Design',
      title: 'Closet Design',
      category: 'Closets',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            INSPIRATION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">DESIGN GALLERY</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Explore our latest projects and get inspired for your next home renovation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`group relative overflow-hidden rounded-xl shadow-lg ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } transition-transform duration-500 hover:z-10 hover:scale-[1.02]`}
              style={{ height: index === 0 ? '500px' : '240px' }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-80"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-300">
                <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full mb-2">
                    {image.category}
                  </span>
                  <h3 className="text-white text-lg md:text-xl font-bold mb-1">
                    {image.title}
                  </h3>
                </div>
                
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-white text-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            View All Projects
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogImages;