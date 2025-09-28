'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Wrench, Handshake, Target } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const KeyBenefits = () => {
  const benefits = [
    {
      icon: MapPin,
      title: 'VISIT OUR SHOWROOM',
      description:
        'See and feel our premium materials in person. Touch samples, view full slabs, and get expert guidance.',
      imageIndex: 1,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      icon: Wrench,
      title: 'CUSTOM FABRICATION',
      description:
        'Local manufacturing capabilities for custom countertops and cabinets. Precision cutting and professional craftsmanship.',
      imageIndex: 2,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      iconColor: 'text-amber-500',
    },
    {
      icon: Handshake,
      title: 'LOCAL SERVICE',
      description:
        'Community-based service you can trust. Faster response times and personalized customer support.',
      imageIndex: 3,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'text-green-500',
    },
    {
      icon: Target,
      title: 'RESULTS-DRIVEN',
      description:
        'From consultation to installation, we deliver actionable solutions that increase your home value.',
      imageIndex: 4,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconColor: 'text-purple-500',
    },
  ];

  // Use intersection observer for animation on scroll
  const { ref: sectionRef, inView: sectionVisible } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Subtle background wave pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '25%', width: '100%', opacity: 0.1 }}
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,133.3C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div
        ref={sectionRef}
        className={`container mx-auto px-4 relative z-10 transition-opacity duration-1000 ease-out ${sectionVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center mb-8">
          <div className="inline-block mx-auto">
            <div className="relative">
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-700/20 text-blue-700 text-xs font-medium mb-2">
                OUR ADVANTAGES
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
            WHY CHOOSE US
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full mb-3"></div>

          <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            We combine premium materials, expert craftsmanship, and exceptional
            service to deliver the perfect solution for your home.
          </p>
        </div>

        {/* Scrollable container on mobile, grid on larger screens */}
        <div className="relative">
          {/* Scroll indicators for mobile */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-50 to-transparent w-8 h-full z-10 pointer-events-none md:hidden"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-gray-50 to-transparent w-8 h-full z-10 pointer-events-none md:hidden"></div>

          <div
            className="flex md:grid overflow-x-auto md:overflow-visible pb-4 md:pb-0
                      scroll-pl-6 scroll-pr-6 md:scroll-p-0
                      md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8
                      no-scrollbar snap-x snap-mandatory pl-2 pr-2 md:px-0"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-lg overflow-hidden transition-all duration-500 
                hover:shadow-lg hover:-translate-y-1 border border-gray-100/50 shadow-md
                flex-shrink-0 w-[75%] md:w-auto snap-center
                ${sectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Top gradient bar */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-blue-800"></div>

                <div className="p-3 sm:p-4 md:p-6 flex flex-col items-center text-center h-full">
                  {/* Animated icon container */}
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-3 sm:mb-4 
                  transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-md`}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>

                    <Image
                      src={`/images/features/${benefit.imageIndex}.png`}
                      alt={benefit.title}
                      width={50}
                      height={50}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Background pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '8px 8px',
                      }}
                    ></div>
                  </div>

                  {/* Title with gradient effect on hover */}
                  <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-gray-800 transition-colors duration-300 group-hover:text-blue-700">
                    {benefit.title}
                  </h3>

                  {/* Clean, slightly larger description */}
                  <p className="text-gray-600 text-xs sm:text-sm leading-tight">
                    {benefit.description}
                  </p>

                  {/* Interactive call to action */}
                  <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-100 w-full">
                    <button className="inline-flex items-center justify-center w-full text-blue-600 text-xs sm:text-sm font-medium group-hover:text-blue-700 transition-all duration-300 relative py-1 sm:py-1.5 overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        Learn More
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicators (dots) */}
          <div className="flex justify-center mt-4 space-x-1.5 md:hidden">
            {benefits.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full bg-blue-500/30 ${index === 0 ? 'bg-blue-500' : ''}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Call to action section */}
        <div className="mt-8 sm:mt-10 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-700 to-blue-900 p-[1.5px] rounded-md shadow">
            <div className="bg-white px-4 sm:px-6 py-3 rounded-[4px] hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
              <div className="font-semibold text-base sm:text-lg text-blue-800 mb-1">
                Ready to transform your space?
              </div>
              <div className="text-gray-600 text-xs sm:text-sm">
                Our experts are waiting to help
              </div>
              <div className="mt-2 sm:mt-3">
                <a href="/contact" className="group relative inline-block">
                  <button className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 ease-out border-2 border-white/30 hover:border-white/50 animate-pulse hover:animate-none">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>

                    {/* Pulsing glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 blur-lg opacity-50 group-hover:opacity-75 animate-pulse"></div>

                    {/* Content */}
                    <span className="relative z-10 flex items-center justify-center">
                      🗓️ Schedule a FREE Consultation 🗓️
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;
