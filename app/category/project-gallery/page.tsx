import { getAllProducts } from '@/actions/products.actions';
import ProductCard from '@/components/home/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Project Gallery | LUX Cabinets & Stones',
  description:
    'Explore our stunning project gallery showcasing beautiful cabinet and stone installations, design inspirations, and completed projects.',
};

export default async function ProjectGalleryPage() {
  console.log('🎨 Loading project gallery page...');

  // Fetch all products and filter for gallery pricing type
  const allProductsResult = await getAllProducts();

  let galleryProducts: any[] = [];

  if (allProductsResult.success && allProductsResult.data) {
    // Filter to only include gallery pricing type products
    galleryProducts = allProductsResult.data.filter(
      (product: any) => product.pricingType === 'gallery'
    );
  }

  console.log(`🖼️ Found ${galleryProducts.length} gallery products`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Gallery</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover our stunning collection of completed projects, design
              inspirations, and beautiful installations showcasing the finest in
              cabinets and natural stones.
            </p>
            <div className="mt-6 flex justify-center items-center space-x-6 text-sm opacity-80">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Premium Installations
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Design Inspiration
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                {galleryProducts.length} Gallery Items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {galleryProducts.length > 0 ? (
          <div className="space-y-8">
            {/* Gallery Introduction */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Inspiration Gallery
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse through our curated collection of premium projects that
                showcase the beauty and craftsmanship of our materials and
                installations.
              </p>
            </div>

            {/* Gallery Products */}
            <ProductCard
              heading=""
              products={galleryProducts.map((product: any) => ({
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
                  .map((image: any) => ({
                    url: image.url || '',
                    public_id: image.public_id || '',
                  }))
                  .filter((image: any) => image.url),
                sizes: product.sizes || [],
                colors:
                  product.colors?.map((color: any) => ({
                    ...color,
                    image: color.image ?? undefined,
                  })) || [],
                category: product.category
                  ? {
                      name: product.category.name,
                      slug: product.category.slug,
                    }
                  : {
                      name: 'Gallery',
                      slug: 'project-gallery',
                    },
                subCategories:
                  product.productSubCategories?.map((psc: any) => ({
                    id: psc.subCategory.id,
                    name: psc.subCategory.name,
                    slug: psc.subCategory.slug,
                  })) || [],
                featured: product.featured || false,
                bestSeller: product.bestSeller || false,
              }))}
            />

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Create Your Own Masterpiece?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get inspired by our gallery and let us help you bring your
                vision to life with our premium materials and expert
                craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/quote"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get Free Quote
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Browse All Products
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Gallery Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We're currently curating our most beautiful projects for this
              gallery. Check back soon for stunning inspiration!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Browse Our Products
              </a>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
