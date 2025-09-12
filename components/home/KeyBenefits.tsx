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
    },
    {
      icon: Wrench,
      title: 'CUSTOM FABRICATION',
      description:
        'Local manufacturing capabilities for custom countertops and cabinets. Precision cutting and professional craftsmanship.',
      imageIndex: 2,
    },
    {
      icon: Handshake,
      title: 'LOCAL SERVICE',
      description:
        'Community-based service you can trust. Faster response times and personalized customer support.',
      imageIndex: 3,
    },
    {
      icon: Target,
      title: 'RESULTS-DRIVEN',
      description:
        'From consultation to installation, we deliver actionable solutions that increase your home value.',
      imageIndex: 4,
    },
  ];

  return (
    <div className="container mx-auto px-4 mb-[80px] my-[10px]">
      <h2 className="heading text-center my-[40px]">WHY CHOOSE US</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <Image
              src={`/images/features/${benefit.imageIndex}.png`}
              alt={benefit.title}
              width={50}
              height={50}
              className="sm:w-[50px] sm:h-[50px] mb-[20px]"
            />
            <h3 className="text-sm sm:text-lg mb-1 sm:mb-2 textGap text-gray-700">
              {benefit.title}
            </h3>
            <p className="text-xs sm:text-sm textGap text-gray-500">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyBenefits;
