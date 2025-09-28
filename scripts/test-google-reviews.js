/**
 * Test script for Google Reviews configuration
 * Run with: node scripts/test-google-reviews.js
 */

require('dotenv').config();

async function testGoogleReviews() {
  console.log('🧪 Testing Google Reviews Configuration');
  console.log('=====================================');

  // Check environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  console.log('📋 Environment Variables:');
  console.log(
    `   API Key: ${apiKey ? `${apiKey.substring(0, 10)}...` : '❌ NOT SET'}`
  );
  console.log(`   Place ID: ${placeId || '❌ NOT SET'}`);

  if (!apiKey) {
    console.error('\n❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found');
    return;
  }

  if (!placeId) {
    console.error('\n❌ NEXT_PUBLIC_GOOGLE_PLACE_ID not found');
    return;
  }

  try {
    // Test the Place ID
    console.log('\n🔍 Testing Place ID...');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total,formatted_address,business_status&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const place = data.result;

      console.log('✅ Place ID is valid!');
      console.log('📍 Business Details:');
      console.log(`   Name: ${place.name}`);
      console.log(`   Address: ${place.formatted_address}`);
      console.log(`   Status: ${place.business_status || 'Unknown'}`);
      console.log(`   Rating: ${place.rating || 'No rating'} ⭐`);
      console.log(`   Total Reviews: ${place.user_ratings_total || 0}`);
      console.log(
        `   Reviews Available: ${place.reviews ? place.reviews.length : 0}`
      );

      if (place.reviews && place.reviews.length > 0) {
        console.log('\n📝 Sample Reviews:');
        place.reviews.slice(0, 2).forEach((review, index) => {
          console.log(
            `   ${index + 1}. ${review.author_name} (${review.rating}⭐)`
          );
          console.log(
            `      "${review.text.substring(0, 100)}${review.text.length > 100 ? '...' : ''}"`
          );
        });
      }

      // Check if this is the right business
      console.log('\n🎯 Business Verification:');
      if (
        place.name.toLowerCase().includes('lux') ||
        place.name.toLowerCase().includes('cabinet') ||
        place.name.toLowerCase().includes('stone')
      ) {
        console.log('✅ This appears to be the correct business');
      } else {
        console.log('⚠️  This might not be the correct business');
        console.log('💡 Consider searching for your exact business name');
      }
    } else {
      console.error('❌ Place ID test failed:', data.status);

      if (data.status === 'NOT_FOUND') {
        console.log('💡 The Place ID might be incorrect');
      } else if (data.status === 'REQUEST_DENIED') {
        console.log('💡 Check your API key permissions');
      }
    }
  } catch (error) {
    console.error('❌ Error testing Place ID:', error.message);
  }

  // Test homepage component
  console.log('\n🌐 Testing Homepage Component...');
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Homepage is accessible');
      console.log('💡 Check the Google Reviews section on the homepage');
      console.log('💡 Open browser dev tools to see any JavaScript errors');
    } else {
      console.log(
        '❌ Homepage not accessible - make sure dev server is running'
      );
      console.log('💡 Run: npm run dev');
    }
  } catch (error) {
    console.log('❌ Cannot reach homepage - make sure dev server is running');
    console.log('💡 Run: npm run dev');
  }
}

// Alternative search suggestions
function suggestAlternativeSearch() {
  console.log('\n🔍 Alternative Search Suggestions:');
  console.log('=================================');

  const searches = [
    'LUX Cabinets & Stones',
    'LUX Cabinets Chantilly',
    'LUX Stones Chantilly',
    'Cabinet Store Chantilly VA',
    '4005 Westfax Dr Chantilly',
    'Stone and Cabinet Center', // Found in previous search
  ];

  searches.forEach((search, index) => {
    console.log(`${index + 1}. Try searching: "${search}"`);
  });

  console.log('\n💡 Tips:');
  console.log('   - Check Google My Business for your exact listing name');
  console.log('   - Your business might be listed under a different name');
  console.log(
    '   - You might need to claim/verify your Google Business Profile'
  );
}

// Run the test
testGoogleReviews()
  .then(() => {
    suggestAlternativeSearch();
  })
  .catch(console.error);
