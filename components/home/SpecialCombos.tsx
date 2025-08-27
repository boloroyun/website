import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SpecialCombo {
  id: string;
  title: string;
  link: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
}

interface SpecialCombosProps {
  data?: SpecialCombo[];
}

const SpecialCombos = ({ data = [] }: SpecialCombosProps) => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        SPECIAL COMBOS
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-[20px] sm:justify-center scroll-smooth no-scrollbar">
          {data.length > 0 ? (
            data.map((combo) => {
              const mainImage =
                combo.images && combo.images.length > 0
                  ? combo.images[0].url
                  : '';
              return (
                <div
                  key={combo.id}
                  className="flex-shrink-0 w-[80vw] sm:w-[347px]"
                >
                  <Link href={combo.link || '#'}>
                    {mainImage ? (
                      <Image
                        src={mainImage}
                        alt={combo.title}
                        width={347}
                        height={300}
                        className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </Link>
                  <p className="text-center uppercase textGap font-[500] mt-2">
                    {combo.title}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center w-full h-48">
              <p className="text-gray-500 text-lg">
                No special combos available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialCombos;
