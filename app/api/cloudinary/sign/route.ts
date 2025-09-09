import crypto from 'crypto';

export async function GET() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  if (!cloud || !apiKey || !apiSecret) {
    return new Response('Cloudinary env missing', { status: 500 });
  }

  // Params to sign — keep in sync with client options:
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'quotes'; // change if you prefer another folder
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  return Response.json({
    cloudName: cloud,
    apiKey,
    timestamp,
    signature,
    folder,
  });
}
