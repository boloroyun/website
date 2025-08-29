export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 404 Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">404</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          {/* Home Link */}
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}