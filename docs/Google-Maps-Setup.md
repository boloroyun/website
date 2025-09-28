# Google Maps & Places API Setup Guide

## Overview

The website uses Google Maps Places API to display customer reviews from your Google Business Profile on the homepage.

## Required Environment Variables

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
NEXT_PUBLIC_GOOGLE_PLACE_ID="your-google-place-id"
```

## Step 1: Get Google Maps API Key

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select existing one
4. Name it something like "LUX Cabinets Website"

### 1.2 Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**

### 1.3 Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API Key**
3. Copy the generated API key
4. Click **RESTRICT KEY** (recommended for security)

### 1.4 Configure API Key Restrictions (Recommended)

**Application restrictions:**

- Select "HTTP referrers (web sites)"
- Add these referrers:
  - `http://localhost:3000/*` (for development)
  - `https://yourdomain.com/*` (for production)
  - `https://*.yourdomain.com/*` (for subdomains)

**API restrictions:**

- Select "Restrict key"
- Choose:
  - Maps JavaScript API
  - Places API

## Step 2: Find Your Google Place ID

### Method 1: Google My Business

1. Go to [Google My Business](https://business.google.com/)
2. Select your business listing
3. The Place ID should be visible in the URL or business details

### Method 2: Place ID Finder Tool

1. Go to [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for "LUX Cabinets & Stones, Chantilly, VA"
3. Copy the Place ID (starts with something like `ChIJ...`)

### Method 3: Manual Search

1. Go to [Google Maps](https://maps.google.com/)
2. Search for your business: "LUX Cabinets & Stones, 4005 Westfax Dr, Unit M, Chantilly, VA 20151"
3. Click on your business listing
4. Look at the URL - the Place ID is in the URL parameters

### Method 4: Using Places API (if you have API key)

```bash
# Replace YOUR_API_KEY with your actual API key
curl "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=LUX%20Cabinets%20%26%20Stones%20Chantilly%20VA&inputtype=textquery&fields=place_id,name,formatted_address&key=YOUR_API_KEY"
```

## Step 3: Configure Environment Variables

### 3.1 Add to .env.local

Create or update your `.env.local` file:

```bash
# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyC4R6AN7SmxxxxxxxxxxxxxxxxxxxxxxxxxxX"
NEXT_PUBLIC_GOOGLE_PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4"

# Other existing variables...
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 3.2 Restart Development Server

```bash
npm run dev
```

## Step 4: Verify Setup

### 4.1 Check Homepage

1. Go to `http://localhost:3000`
2. Scroll down to the Google Reviews section
3. You should see your business reviews loading

### 4.2 Check Console

Open browser developer tools and check for:

- ✅ No Google Maps API errors
- ✅ Reviews loading successfully
- ❌ Any API key or Place ID errors

## Troubleshooting

### Common Issues

#### "Google Place ID is not configured"

- **Cause**: `NEXT_PUBLIC_GOOGLE_PLACE_ID` not set
- **Solution**: Add the Place ID to `.env.local`

#### "Failed to load Google Maps API"

- **Cause**: Invalid API key or API not enabled
- **Solution**: Check API key and enable Maps JavaScript API + Places API

#### "This API project is not authorized to use this API"

- **Cause**: Places API not enabled for your project
- **Solution**: Enable Places API in Google Cloud Console

#### "RefererNotAllowedMapError"

- **Cause**: API key restricted to different domains
- **Solution**: Add your domain to API key restrictions

#### "REQUEST_DENIED"

- **Cause**: API key restrictions or billing not set up
- **Solution**: Check API key restrictions and enable billing

### Debug Steps

1. Check `.env.local` file exists and has correct variables
2. Restart development server after adding variables
3. Check Google Cloud Console for API usage/errors
4. Verify Place ID is correct for your business
5. Test API key with a simple request

## Production Deployment

### Environment Variables

Add these to your production environment (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-production-api-key"
NEXT_PUBLIC_GOOGLE_PLACE_ID="your-place-id"
```

### Security Best Practices

1. **Restrict API Key**: Always restrict by HTTP referrer
2. **Monitor Usage**: Set up billing alerts
3. **Separate Keys**: Use different API keys for dev/prod
4. **Regular Rotation**: Rotate API keys periodically

## Cost Considerations

### Google Maps Pricing

- **Places API**: $17 per 1,000 requests
- **Maps JavaScript API**: $7 per 1,000 loads
- **Free Tier**: $200 credit per month (covers ~28,000 requests)

### Optimization Tips

1. **Cache Results**: Reviews don't change frequently
2. **Lazy Loading**: Load reviews only when section is visible
3. **Rate Limiting**: Limit API calls per user/session
4. **Fallback Content**: Show static content if API fails

## Files Using Google Maps

### `/components/home/GoogleReviews.tsx`

- Displays Google Business reviews
- Requires both API key and Place ID
- Shows business rating and customer reviews

### `/app/page.tsx`

- Includes GoogleReviews component
- Passes Place ID from environment variable

## Support Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google My Business](https://business.google.com/)
