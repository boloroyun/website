'use client';

import React, { useEffect, useState } from 'react';

// Add type declarations for the Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: Element, options: any) => any;
        places: {
          PlacesService: new (map: any) => any;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            UNKNOWN_ERROR: string;
          };
        };
      };
    };
  }
}

interface GoogleReviewsProps {
  placeId: string; // Google Maps Place ID for your business
}

// Define a simplified interface for Google reviews
interface SimpleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  time: number;
}

interface SimplePlaceResult {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: SimpleReview[];
}

// Individual Review Card Component with Read More functionality
const ReviewCard = ({ review }: { review: SimpleReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to check if text needs truncation (more than 3 lines approximately)
  const needsTruncation = (text: string) => {
    // Approximate: 50 characters per line, 3 lines = 150 characters
    return text.length > 150;
  };

  // Function to truncate text to approximately 3 lines
  const getTruncatedText = (text: string) => {
    if (!needsTruncation(text)) return text;

    // Find a good breaking point around 150 characters
    const truncateLength = 150;
    let truncated = text.substring(0, truncateLength);

    // Try to break at a word boundary
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > truncateLength * 0.8) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }

    return truncated + '...';
  };

  const shouldShowReadMore = needsTruncation(review.text);
  const displayText = isExpanded ? review.text : getTruncatedText(review.text);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={review.profile_photo_url}
          alt={review.author_name}
          className="w-12 h-12 rounded-full mr-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://via.placeholder.com/48x48/E5E7EB/9CA3AF?text=?';
          }}
        />
        <div>
          <h4 className="font-semibold text-gray-900">{review.author_name}</h4>
          <div className="flex mt-1">
            {Array(5)
              .fill('')
              .map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < review.rating ? '#FBBF24' : '#E5E7EB'}
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <p className="text-gray-700 leading-relaxed mb-3 flex-1">
          {displayText}
        </p>

        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 self-start mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}

        <div className="text-gray-500 text-sm mt-auto">
          {new Date(review.time * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};

// Business Info Component
const BusinessInfo = ({ place }: { place: SimplePlaceResult }) => (
  <div className="mb-8 text-center">
    <div className="text-2xl font-bold mb-3 text-gray-900">
      {place.name || 'Our Business'}
    </div>
    <div className="flex items-center justify-center">
      <div className="flex mr-2">
        {Array(5)
          .fill('')
          .map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={i < Math.round(place.rating || 0) ? '#FBBF24' : '#E5E7EB'}
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          ))}
      </div>
      <span className="font-semibold text-lg">{place.rating || 0}</span>
      <span className="mx-2 text-gray-400">•</span>
      <span className="text-gray-600">
        {place.user_ratings_total || 0} reviews
      </span>
    </div>
  </div>
);

const GoogleReviews = ({ placeId }: GoogleReviewsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [placeData, setPlaceData] = useState(null as SimplePlaceResult | null);

  useEffect(() => {
    // Check if place ID is provided
    if (!placeId) {
      setError(
        'Google Place ID is not configured. Please add NEXT_PUBLIC_GOOGLE_PLACE_ID to your .env file.'
      );
      setIsLoading(false);
      return;
    }

    // Function to initialize reviews when Google Maps API is loaded
    const initializeReviews = () => {
      try {
        if (
          typeof window.google === 'undefined' ||
          typeof window.google.maps === 'undefined' ||
          typeof window.google.maps.places === 'undefined'
        ) {
          setError('Google Maps API failed to load properly');
          setIsLoading(false);
          return;
        }

        // Create a temporary map container
        const tempMapContainer = document.createElement('div');
        tempMapContainer.style.display = 'none';
        document.body.appendChild(tempMapContainer);

        // Create a map instance (hidden)
        const map = new window.google.maps.Map(tempMapContainer, {
          center: { lat: 0, lng: 0 },
          zoom: 1,
        });

        // Create a PlacesService instance
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: placeId,
            fields: ['name', 'rating', 'review', 'user_ratings_total'],
          },
          (result: any, status: any) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              result
            ) {
              const place: SimplePlaceResult = {
                name: result.name,
                rating: result.rating,
                user_ratings_total: result.user_ratings_total,
                reviews: result.reviews,
              };
              setPlaceData(place);
            } else {
              setError('Failed to load reviews');
              console.error('Error fetching Google reviews:', status);
            }
            setIsLoading(false);

            // Clean up temporary map container
            if (document.body.contains(tempMapContainer)) {
              document.body.removeChild(tempMapContainer);
            }
          }
        );
      } catch (err) {
        setError('Error initializing Google reviews');
        console.error('Error initializing Google reviews:', err);
        setIsLoading(false);
      }
    };

    // Load Google Maps API
    const loadGoogleMapsAPI = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        // If script exists and Google is loaded, initialize immediately
        if (window.google && window.google.maps && window.google.maps.places) {
          initializeReviews();
        } else {
          // Wait for the existing script to load
          existingScript.addEventListener('load', initializeReviews);
        }
        return () => {};
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeReviews;
      script.onerror = () => {
        setError('Failed to load Google Maps API');
        setIsLoading(false);
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    // Load the API
    const cleanup = loadGoogleMapsAPI();

    return cleanup;
  }, [placeId]);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="heading text-center mb-12">CUSTOMER REVIEWS</h2>

        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <span className="ml-4 text-lg">Loading Google Reviews...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <p className="mt-2 text-gray-600">
                Please make sure you've set up your Google Maps API Key in your
                environment variables.
              </p>
            </div>
          ) : placeData ? (
            <>
              <BusinessInfo place={placeData} />

              {placeData.reviews && placeData.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {placeData.reviews.slice(0, 6).map((review, index) => (
                    <ReviewCard
                      key={`${review.author_name}-${review.time}-${index}`}
                      review={review}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No reviews available at the moment.
                  </p>
                </div>
              )}

              <div className="text-center">
                <a
                  href={`https://g.page/r/${placeId}/review`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Leave a Review
                </a>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GoogleReviews;
