import { getCategoryWithProducts } from '@/actions/categories.actions';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/home/ProductCard';
import Image from 'next/image';

// Force dynamic rendering to prevent build-time server action execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  const categoryResult = await getCategoryWithProducts(slug);

  if (!categoryResult.success || !categoryResult.data) {
    notFound();
  }

  const category = categoryResult.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.images &&
            category.images.length > 0 &&
            category.images[0].url && (
              <Image
                src={category.images[0].url}
                alt={category.name}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg mx-auto max-w-2xl"
              />
            )}
        </div>

        {/* Subcategories */}
        {category.subCategories && category.subCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.subCategories.map((subCat) => (
                <a
                  key={subCat.id}
                  href={`/category/${slug}/${subCat.slug}`}
                  className="text-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  {subCat.images &&
                    subCat.images.length > 0 &&
                    subCat.images[0].url && (
                      <Image
                        src={subCat.images[0].url}
                        alt={subCat.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                      />
                    )}
                  <p className="text-sm font-medium">{subCat.name}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {category.products && category.products.length > 0 ? (
          <ProductCard
            heading={`${category.name} Products`}
            products={category.products.map((product) => ({
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
                name: category.name,
                slug: category.slug,
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
              No products found in this category.
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for new products!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
