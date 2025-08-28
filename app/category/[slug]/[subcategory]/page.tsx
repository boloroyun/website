import { getAllProducts } from '@/actions/products.actions';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/home/ProductCard';
import prisma from '@/lib/prisma';
import Image from 'next/image';

interface SubCategoryPageProps {
  params: {
    slug: string;
    subcategory: string;
  };
}

export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { slug, subcategory } = params;

  try {
    // Get the subcategory info
    const subCategoryData = await prisma.subCategory.findUnique({
      where: { slug: subcategory },
      include: {
        parent: true,
        productSubCategories: {
          include: {
            product: {
              include: {
                category: true,
                productSubCategories: {
                  include: {
                    subCategory: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subCategoryData || subCategoryData.parent.slug !== slug) {
      notFound();
    }

    // Get products for this subcategory
    const products = subCategoryData.productSubCategories.map(
      (psc) => psc.product
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a
                  href={`/category/${slug}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {subCategoryData.parent.name}
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">
                {subCategoryData.name}
              </li>
            </ol>
          </nav>

          {/* Subcategory Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{subCategoryData.name}</h1>
            {subCategoryData.images && 
             subCategoryData.images.length > 0 && 
             subCategoryData.images[0].url && (
              <Image
                src={subCategoryData.images[0].url}
                alt={subCategoryData.name}
                width={768}
                height={256}
                className="w-full h-64 object-cover rounded-lg mx-auto max-w-2xl"
              />
            )}
          </div>

          {/* Products */}
          {products && products.length > 0 ? (
            <ProductCard
              heading={`${subCategoryData.name} Products`}
              products={products.map((product) => ({
                id: product.id,
                title: product.title,
                description: product.description,
                slug: product.slug,
                brand: product.brand ?? undefined,
                rating: product.rating,
                numReviews: product.numReviews,
                sold: product.sold ?? undefined,
                discount: product.discount ?? undefined,
                pricingType: product.pricingType,
                images: product.images
                  .map((image) => ({
                    url: image.url || '',
                    public_id: image.public_id || '',
                  }))
                  .filter((image) => image.url),
                sizes: product.sizes,
                colors: product.colors.map((color) => ({
                  ...color,
                  image: color.image ?? undefined,
                })),
                category: {
                  name: product.category.name,
                  slug: product.category.slug,
                },
                subCategories:
                  product.productSubCategories?.map((psc) => ({
                    id: psc.subCategory.id,
                    name: psc.subCategory.name,
                    slug: psc.subCategory.slug,
                  })) || [],
                featured: product.featured,
                bestSeller: product.bestSeller,
              }))}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                No products found in this subcategory.
              </p>
              <p className="text-gray-500 mt-2">
                Check back soon for new products!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading subcategory page:', error);
    notFound();
  }
}
