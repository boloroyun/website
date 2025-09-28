/**
 * Test script for Resend email functionality
 * Run with: node scripts/test-contact-email.js
 */

require('dotenv').config();

async function testContactEmail() {
  console.log('🧪 Testing Contact Email Functionality');
  console.log('=====================================');

  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY to your .env.local file');
    console.log('💡 Get your API key from: https://resend.com/api-keys');
    return;
  }

  console.log('✅ RESEND_API_KEY found');
  console.log(`🔑 API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);

  try {
    // Test the API endpoint
    const testData = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '(555) 123-4567',
      subject: 'Test Contact Form Submission',
      message: 'This is a test message from the contact form test script.',
      projectType: 'kitchen-cabinets',
      budget: '25k-50k',
    };

    console.log('\n📧 Sending test email...');
    console.log('Test data:', testData);

    const formData = new FormData();
    Object.entries(testData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Response:', result);
      console.log('\n🎉 Check your email at info@luxcabistones.com');
      console.log('🎉 Check test@example.com for auto-reply');
    } else {
      console.error('❌ Email sending failed');
      console.error('📧 Error:', result);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure your Next.js development server is running:');
      console.log('💡 npm run dev');
    }
  }
}

// Run the test
testContactEmail().catch(console.error);
