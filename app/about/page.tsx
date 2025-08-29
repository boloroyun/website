import { Metadata } from 'next';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

// Force dynamic rendering to prevent build-time API calls
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Types for the About page data
interface AboutPageData {
  id: string;
  title: string;
  content: string;
  heroImage?: string;
  seoDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fetch about page data from Admin API
async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const adminApiBase = process.env.ADMIN_API_BASE;
    if (!adminApiBase) {
      console.error('ADMIN_API_BASE environment variable is not set');
      return null;
    }

    const response = await fetch(`${adminApiBase}/api/pages/about`, {
      // Use no-store to always fetch fresh data, or use revalidate for caching
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('About page not found in Admin API');
        return null;
      }
      throw new Error(`Failed to fetch about page: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPageData();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'LUX Cabinets & Stones';

  if (!data || !data.isPublished) {
    return {
      title: `About Us | ${siteName}`,
      description:
        'Learn more about our company, our story, and our commitment to quality.',
    };
  }

  return {
    title: `${data.title} | ${siteName}`,
    description:
      data.seoDescription ||
      data.content.substring(0, 160).replace(/[#*`]/g, ''),
    openGraph: {
      title: data.title,
      description:
        data.seoDescription ||
        data.content.substring(0, 160).replace(/[#*`]/g, ''),
      images: data.heroImage ? [{ url: data.heroImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description:
        data.seoDescription ||
        data.content.substring(0, 160).replace(/[#*`]/g, ''),
      images: data.heroImage ? [data.heroImage] : [],
    },
  };
}

// Placeholder component when no data is available
function AboutPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2m0 0h4"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-xl text-gray-600 mb-8">
              We're working on our story. Check back soon!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              LUX Cabinets & Stones
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Welcome to LUX Cabinets & Stones, your premier destination for
                high-quality kitchen cabinets, countertops, and stone surfaces.
                We specialize in custom fabrication and professional
                installation services.
              </p>
              <p>
                Our team of skilled craftsmen and designers work together to
                transform your vision into reality, whether you're renovating
                your kitchen, bathroom, or any other space in your home.
              </p>
              <p>
                With years of experience in the industry, we pride ourselves on
                delivering exceptional quality, outstanding customer service,
                and competitive pricing.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>📍 4005 Westfax Dr, Unit M, Chantilly, VA 20151</p>
                <p>📞 571-335-0118</p>
                <p>✉️ info@luxcabistones.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main About page component
export default async function AboutPage() {
  const data = await getAboutPageData();

  // Show placeholder if no data or not published
  if (!data || !data.isPublished) {
    return <AboutPlaceholder />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {data.heroImage && (
        <div className="relative w-full h-96 bg-gray-200">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
              {data.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title (if no hero image) */}
          {!data.heroImage && (
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                {data.title}
              </h1>
              <div className="w-24 h-1 bg-blue-600 mx-auto" />
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <ReactMarkdown
              components={{
                // Custom components for better styling
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-600 my-6">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {data.content}
            </ReactMarkdown>
          </div>

          {/* Call to Action */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Transform Your Space?
            </h3>
            <p className="text-gray-600 mb-6">
              Contact us today for a free consultation and quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/quote"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Get Free Quote
              </a>
              <a
                href="tel:571-335-0118"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Call Us: 571-335-0118
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
