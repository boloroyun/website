import React from 'react';
import Image from 'next/image';
import { MapPin, Wrench, Handshake, Target } from 'lucide-react';

const KeyBenefits = () => {
  const benefits = [
    {
      icon: MapPin,
      title: 'VISIT OUR SHOWROOM',
      description:
        'See and feel our premium materials in person. Touch samples, view full slabs, and get expert guidance.',
      imageIndex: 1,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Wrench,
      title: 'CUSTOM FABRICATION',
      description:
        'Local manufacturing capabilities for custom countertops and cabinets. Precision cutting and professional craftsmanship.',
      imageIndex: 2,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Handshake,
      title: 'LOCAL SERVICE',
      description:
        'Community-based service you can trust. Faster response times and personalized customer support.',
      imageIndex: 3,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Target,
      title: 'RESULTS-DRIVEN',
      description:
        'From consultation to installation, we deliver actionable solutions that increase your home value.',
      imageIndex: 4,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
          backgroundSize: '30px 30px' 
        }}></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            OUR ADVANTAGES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">WHY CHOOSE US</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We combine premium materials, expert craftsmanship, and exceptional service to deliver the perfect solution for your home.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${benefit.color} rounded-t-2xl transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100`}></div>
              
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-16 h-16 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Image
                    src={`/images/features/${benefit.imageIndex}.png`}
                    alt={benefit.title}
                    width={50}
                    height={50}
                    className="w-8 h-8"
                  />
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
                
                <div className="mt-6 pt-4 border-t border-gray-100 w-full">
                  <button className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center justify-center w-full">
                    Learn More
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;