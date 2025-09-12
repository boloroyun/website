// This script is for testing the responsiveness of the navbar
// You can run this in the browser console to simulate different screen sizes

function testResponsiveness() {
  console.log('🧪 Testing Navbar Responsiveness');

  // Define screen sizes to test
  const screenSizes = [
    { name: 'Mobile Small', width: 320, height: 568 },
    { name: 'Mobile Medium', width: 375, height: 667 },
    { name: 'Mobile Large', width: 414, height: 736 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
  ];

  console.log('📱 Screen sizes to test:', screenSizes);
  console.log('');
  console.log('To test a specific screen size, run:');
  console.log('simulateScreenSize(width, height)');
  console.log('Example: simulateScreenSize(375, 667)');
  console.log('');
  console.log('To reset to your actual screen size, run:');
  console.log('resetScreenSize()');

  // Function to simulate a specific screen size
  window.simulateScreenSize = function (width, height) {
    console.log(`🔄 Simulating screen size: ${width}x${height}`);

    // Create a style element if it doesn't exist
    let styleEl = document.getElementById('screen-size-simulator');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'screen-size-simulator';
      document.head.appendChild(styleEl);
    }

    // Apply CSS to simulate screen size
    styleEl.textContent = `
      .max-w-7xl {
        max-width: ${width}px !important;
        width: 100% !important;
      }
      
      @media (min-width: 1024px) {
        html {
          /* Force media queries to behave as if screen is this width */
          min-width: ${width}px !important;
        }
      }
    `;

    // Trigger a resize event
    window.dispatchEvent(new Event('resize'));

    console.log(`✅ Screen size set to ${width}x${height}`);
    return `Screen size simulated: ${width}x${height}`;
  };

  // Function to reset to actual screen size
  window.resetScreenSize = function () {
    console.log('🔄 Resetting to actual screen size');

    // Remove the style element
    const styleEl = document.getElementById('screen-size-simulator');
    if (styleEl) {
      styleEl.remove();
    }

    // Trigger a resize event
    window.dispatchEvent(new Event('resize'));

    console.log('✅ Screen size reset to actual dimensions');
    return 'Screen size reset to actual dimensions';
  };

  // Function to test all screen sizes
  window.testAllScreenSizes = function () {
    console.log('🧪 Testing all screen sizes');

    let currentIndex = 0;

    function testNextSize() {
      if (currentIndex >= screenSizes.length) {
        console.log('✅ All screen sizes tested');
        resetScreenSize();
        return;
      }

      const size = screenSizes[currentIndex];
      console.log(`🔄 Testing ${size.name}: ${size.width}x${size.height}`);

      simulateScreenSize(size.width, size.height);

      // Wait 3 seconds before testing the next size
      setTimeout(() => {
        currentIndex++;
        testNextSize();
      }, 3000);
    }

    testNextSize();
  };

  console.log('');
  console.log('To test all screen sizes automatically, run:');
  console.log('testAllScreenSizes()');

  return 'Responsiveness testing utilities loaded';
}

// Execute the function to set up testing utilities
testResponsiveness();
