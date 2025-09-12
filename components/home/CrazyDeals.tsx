import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CrazyDeal {
  id: string;
  title: string;
  link: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
}

interface CrazyDealsProps {
  deals: CrazyDeal[];
}

const CrazyDeals: React.FC<CrazyDealsProps> = ({ deals }) => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        Crazy Deals
      </div>
      <div className="relative">
        {deals.length > 0 ? (
          <div className="flex overflow-x-auto gap-[20px] pb-4 sm:justify-center scroll-smooth no-scrollbar">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={deal.link}
                className="flex-shrink-0 w-[80vw] sm:w-[347px] group"
              >
                <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  <Image
                    src={
                      deal.images.length > 0
                        ? deal.images[0].url
                        : '/images/placeholder-deal.jpg'
                    }
                    alt={deal.title}
                    width={347}
                    height={200}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-sm font-medium">Shop Now →</span>
                  </div>
                </div>
                <p className="text-center uppercase textGap font-[500] mt-3 group-hover:text-red-600 transition-colors duration-200">
                  {deal.title}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No crazy deals available at the moment.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Check back soon for amazing offers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrazyDeals;
