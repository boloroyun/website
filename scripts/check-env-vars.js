/**
 * Script to check environment variables
 * Run with: node scripts/check-env-vars.js
 */

require('dotenv').config();

console.log('🔍 Environment Variables Check');
console.log('=============================');

// Check all Google-related environment variables
const googleVars = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_GOOGLE_PLACE_ID',
  'NEXT_PUBLIC_GOOGLE_VERIFICATION',
];

console.log('📋 Google-related variables:');
googleVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Check other important variables
const otherVars = ['RESEND_API_KEY', 'DATABASE_URL', 'NEXTAUTH_SECRET'];

console.log('\n📋 Other important variables:');
otherVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Show all environment variables that start with NEXT_PUBLIC_
console.log('\n📋 All NEXT_PUBLIC_ variables:');
Object.keys(process.env)
  .filter((key) => key.startsWith('NEXT_PUBLIC_'))
  .forEach((key) => {
    const value = process.env[key];
    console.log(
      `   ${key}: ${value ? `${value.substring(0, 30)}...` : 'NOT SET'}`
    );
  });

// Provide troubleshooting tips
console.log('\n💡 Troubleshooting Tips:');
console.log('=======================');
console.log('1. Make sure your .env.local file is in the project root');
console.log('2. Check for typos in variable names (case-sensitive)');
console.log('3. Make sure there are no spaces around the = sign');
console.log('4. Restart your development server after adding variables');
console.log('5. Variables should look like:');
console.log('   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."');
console.log('   NEXT_PUBLIC_GOOGLE_PLACE_ID="ChIJ..."');

// Show expected .env.local format
console.log('\n📝 Expected .env.local format:');
console.log('=============================');
console.log('# Google Maps Configuration');
console.log(
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyC4R6AN7SmxxxxxxxxxxxxxxxxxxxxxxxxxxX"'
);
console.log('NEXT_PUBLIC_GOOGLE_PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4"');
console.log('');
console.log('# Resend Email Service');
console.log('RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"');
