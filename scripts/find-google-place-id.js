/**
 * Script to find Google Place ID for LUX Cabinets & Stones
 * Run with: node scripts/find-google-place-id.js
 */

require('dotenv').config();

async function findPlaceId() {
  console.log('🔍 Finding Google Place ID for LUX Cabinets & Stones');
  console.log('==================================================');

  // Check if API key is configured
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error(
      '❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found in environment variables'
    );
    console.log('💡 Get your API key from: https://console.cloud.google.com/');
    console.log('💡 Enable Maps JavaScript API and Places API');
    console.log(
      '💡 Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file'
    );
    return;
  }

  console.log('✅ Google Maps API Key found');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);

  try {
    // Search for the business
    const businessName = 'LUX Cabinets & Stones';
    const address = '4005 Westfax Dr, Unit M, Chantilly, VA 20151';
    const query = `${businessName} ${address}`;

    console.log(`\n🔍 Searching for: ${query}`);

    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      const place = data.candidates[0];

      console.log('\n✅ Business found!');
      console.log('📍 Place Details:');
      console.log(`   Name: ${place.name}`);
      console.log(`   Address: ${place.formatted_address}`);
      console.log(
        `   Rating: ${place.rating || 'N/A'} (${place.user_ratings_total || 0} reviews)`
      );
      console.log(`   Place ID: ${place.place_id}`);

      console.log('\n🎯 Add this to your .env.local file:');
      console.log(`NEXT_PUBLIC_GOOGLE_PLACE_ID="${place.place_id}"`);

      // Test getting reviews
      console.log('\n🔍 Testing place details...');
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;

      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      if (detailsData.status === 'OK') {
        const details = detailsData.result;
        console.log('✅ Place details retrieved successfully');
        console.log(
          `   Reviews available: ${details.reviews ? details.reviews.length : 0}`
        );
        console.log(`   Total ratings: ${details.user_ratings_total || 0}`);
        console.log(`   Average rating: ${details.rating || 'N/A'}`);
      } else {
        console.log('⚠️ Could not retrieve place details:', detailsData.status);
      }
    } else {
      console.log('❌ Business not found');
      console.log('📍 Search status:', data.status);

      if (data.status === 'REQUEST_DENIED') {
        console.log(
          '💡 Check your API key and make sure Places API is enabled'
        );
      } else if (data.status === 'ZERO_RESULTS') {
        console.log('💡 Try searching with different terms:');
        console.log('   - Just the business name: "LUX Cabinets & Stones"');
        console.log('   - Just the address: "4005 Westfax Dr, Chantilly, VA"');
        console.log('   - City and state: "Chantilly, VA"');
      }
    }
  } catch (error) {
    console.error('❌ Error searching for place:', error.message);

    if (error.message.includes('fetch')) {
      console.log('💡 Make sure you have internet connection');
    }
  }
}

// Alternative manual search suggestions
function showManualSearchOptions() {
  console.log('\n📋 Manual Search Options:');
  console.log('========================');

  console.log('\n1. Google My Business:');
  console.log('   - Go to: https://business.google.com/');
  console.log('   - Find your business listing');
  console.log('   - Look for Place ID in business details');

  console.log('\n2. Google Maps:');
  console.log('   - Go to: https://maps.google.com/');
  console.log('   - Search: "LUX Cabinets & Stones, Chantilly, VA"');
  console.log('   - Click on your business');
  console.log('   - Check URL for Place ID');

  console.log('\n3. Place ID Finder:');
  console.log(
    '   - Go to: https://developers.google.com/maps/documentation/places/web-service/place-id'
  );
  console.log('   - Use the interactive tool');

  console.log('\n4. If business not found:');
  console.log('   - Claim your business on Google My Business');
  console.log('   - Verify your business listing');
  console.log('   - Wait 24-48 hours for indexing');
}

// Run the search
findPlaceId()
  .then(() => {
    showManualSearchOptions();
  })
  .catch(console.error);
