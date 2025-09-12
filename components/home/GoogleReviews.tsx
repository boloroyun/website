'use client';

import React, { useEffect } from 'react';

interface GoogleReviewsProps {
  placeId: string; // Google Maps Place ID for your business
}

const GoogleReviews: React.FC<GoogleReviewsProps> = ({ placeId }) => {
  useEffect(() => {
    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeReviews;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.head.removeChild(script);
    };
  }, [placeId]);

  const initializeReviews = () => {
    // Make sure the Google object exists
    if (typeof google === 'undefined') return;

    const mapDiv = document.getElementById('google-map-reviews');
    if (!mapDiv) return;

    // This is a hidden map that's needed for the Place API to work
    const map = new google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1,
    });

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'rating', 'review', 'user_ratings_total'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
          displayReviews(place);
        } else {
          console.error('Error fetching Google reviews:', status);
        }
      }
    );
  };

  const displayReviews = (place: google.maps.places.PlaceResult) => {
    const reviewsContainer = document.getElementById('google-reviews-container');
    if (!reviewsContainer || !place.reviews) return;

    const reviewsHtml = place.reviews.slice(0, 5).map((review) => `
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div class="flex items-center mb-4">
          <img 
            src="${review.profile_photo_url}" 
            alt="${review.author_name}"
            class="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h4 class="font-semibold">${review.author_name}</h4>
            <div class="flex mt-1">
              ${Array(5).fill('').map((_, i) => `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${i < review.rating ? '#FBBF24' : '#E5E7EB'}" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg>
              `).join('')}
            </div>
          </div>
        </div>
        <p class="text-gray-700">${review.text}</p>
        <div class="text-gray-500 text-sm mt-2">
          ${new Date(review.time * 1000).toLocaleDateString()}
        </div>
      </div>
    `).join('');

    reviewsContainer.innerHTML = `
      <div class="mb-4">
        <div class="text-xl font-semibold mb-2">${place.name}</div>
        <div class="flex items-center">
          <div class="flex mr-2">
            ${Array(5).fill('').map((_, i) => `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${i < Math.round(place.rating || 0) ? '#FBBF24' : '#E5E7EB'}" class="w-5 h-5">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
            `).join('')}
          </div>
          <span class="font-medium">${place.rating}</span>
          <span class="mx-2">•</span>
          <span>${place.user_ratings_total} reviews</span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${reviewsHtml}
      </div>
      <div class="mt-6 text-center">
        <a 
          href="https://g.page/r/${placeId}/review" 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Leave a Review
        </a>
      </div>
    `;
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="heading text-center mb-12">CUSTOMER REVIEWS</h2>
        {/* Hidden map element needed for Places API */}
        <div id="google-map-reviews" style={{ display: 'none' }}></div>
        
        {/* Container for rendered reviews */}
        <div id="google-reviews-container" className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-4 text-lg">Loading Google Reviews...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleReviews;
