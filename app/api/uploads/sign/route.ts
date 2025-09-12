import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary configuration
const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

// Simple rate limiter using Map
const rateLimiter = new Map<string, { count: number; lastRequest: number }>();
const MAX_REQUESTS = 20; // Maximum requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(request: NextRequest) {
  try {
    // Get the client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(/, /)[0] : 'unknown';

    // Check rate limit
    const now = Date.now();
    const rateLimit = rateLimiter.get(ip) || { count: 0, lastRequest: now };

    // Reset counter if outside window
    if (now - rateLimit.lastRequest > WINDOW_MS) {
      rateLimit.count = 0;
      rateLimit.lastRequest = now;
    }

    // Check if rate limit exceeded
    if (rateLimit.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }

    // Update rate limiter
    rateLimit.count += 1;
    rateLimiter.set(ip, rateLimit);

    // Required environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'lux/quote-requests';

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate timestamp and other parameters for signing
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Parameters to sign
    const paramsToSign = {
      timestamp,
      folder,
    };

    // Generate the signature
    const signature = getCloudinary().utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    // Return the necessary data for frontend
    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
