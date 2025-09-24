// Test script for the "Get a Quote Now" button click functionality
require('dotenv').config();
const puppeteer = require('puppeteer');

async function testQuoteButtonClick() {
  console.log('🧪 Starting quote button click test...');

  let browser;
  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      args: ['--window-size=1280,800'],
      defaultViewport: { width: 1280, height: 800 },
    });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to a product page
    console.log('🔍 Navigating to product page...');
    await page.goto('http://localhost:3000/product/white-shaker-cabinets', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for the page to load
    await page.waitForSelector('button', { timeout: 5000 });

    // Find the "Get a Quote Now" button
    console.log('🔍 Looking for the quote button...');
    const quoteButtons = await page.$$eval('button', (buttons) => {
      return buttons
        .filter((button) => button.textContent.includes('Get a Quote Now'))
        .map((button) => ({
          text: button.textContent.trim(),
          isVisible: button.offsetWidth > 0 && button.offsetHeight > 0,
          isClickable: !button.disabled,
          hasClickHandler:
            button.onclick !== null || button.getAttribute('onClick') !== null,
        }));
    });

    console.log('📊 Quote buttons found:', quoteButtons.length);
    console.log('📊 Button details:', quoteButtons);

    if (quoteButtons.length === 0) {
      console.error('❌ No "Get a Quote Now" button found on the page');
      return false;
    }

    // Set up click event listener
    await page.exposeFunction('buttonClicked', () => {
      console.log('✅ Button click event detected!');
    });

    await page.evaluateOnNewDocument(() => {
      document.addEventListener(
        'click',
        (e) => {
          if (
            e.target.tagName === 'BUTTON' &&
            e.target.textContent.includes('Get a Quote Now')
          ) {
            window.buttonClicked();
          }
        },
        true
      );
    });

    // Click the button
    console.log('🖱️ Clicking the quote button...');
    const buttonSelector = 'button:contains("Get a Quote Now")';

    try {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const quoteButton = buttons.find((button) =>
          button.textContent.includes('Get a Quote Now')
        );

        if (quoteButton) {
          console.log('Found button:', quoteButton);
          quoteButton.click();
          return true;
        }
        return false;
      });

      // Wait for modal to appear
      console.log('⏳ Waiting for quote modal to appear...');
      const modalAppeared = await page
        .waitForSelector('[role="dialog"]', {
          timeout: 5000,
          visible: true,
        })
        .then(() => true)
        .catch(() => false);

      if (modalAppeared) {
        console.log('✅ Quote modal appeared successfully!');
        return true;
      } else {
        console.error(
          '❌ Quote modal did not appear after clicking the button'
        );
        return false;
      }
    } catch (error) {
      console.error('❌ Error clicking the button:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  } finally {
    // Close the browser
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testQuoteButtonClick()
  .then((success) => {
    if (success) {
      console.log('\n✅ Quote button click test passed!');
      process.exit(0);
    } else {
      console.error('\n❌ Quote button click test failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Unhandled error in test script:', error);
    process.exit(1);
  });
