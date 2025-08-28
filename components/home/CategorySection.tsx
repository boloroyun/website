import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  productCount: number;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase heading ownContainer  sm:my-[40px]">
        LUXURY CATEGORIES
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center group hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <Image
                  src={
                    category.images.length > 0
                      ? category.images[0].url
                      : '/images/placeholder-category.jpg'
                  }
                  alt={category.name}
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              <span className="text-sm font-medium text-center mt-2 group-hover:text-blue-600 transition-colors duration-200">
                {category.name.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {category.productCount} products
              </span>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              No categories available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
