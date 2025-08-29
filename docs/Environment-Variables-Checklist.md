# Environment Variables Checklist for Deployment

## ✅ Current Configuration Status

### **Authentication System - READY FOR DEPLOYMENT**

All authentication API routes have been updated with the proper handler implementation pattern:

- ✅ `app/api/auth/send-code/route.ts` - Uses lazy imports and proper error handling
- ✅ `app/api/auth/resend-code/route.ts` - Uses lazy imports and proper error handling
- ✅ `app/api/auth/verify-code/route.ts` - Uses lazy imports and proper error handling

### **Build Status**

- ✅ `npm run lint` - No ESLint warnings or errors
- ✅ `npm run build` - Build successful (exit code 0)
- ✅ No "Failed to collect page data" errors
- ✅ All API routes configured as dynamic functions (`ƒ`)

## 📋 Environment Variables Required

### **For Vercel Deployment**

#### **Option 1: Resend (Recommended)**

```
RESEND_API_KEY=re_your_actual_key_here
SMTP_FROM=noreply@yourdomain.com
```

#### **Option 2: Gmail SMTP (Current Configuration)**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=luxcabistone@gmail.com
SMTP_PASS=fbylntwbauevjhaz
SMTP_FROM=LUX Cabinets & Stones <luxcabistone@gmail.com>
```

#### **Database & Core Services**

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://luxcabistones.com
NEXT_PUBLIC_SITE_NAME=LUX Cabinets & Stones
```

## 🚀 Vercel Deployment Instructions

### **1. Environment Variables Setup**

In your Vercel dashboard:

- Go to Settings → Environment Variables
- Add each variable **WITHOUT QUOTES** around the values
- Example:
  ```
  Key: SMTP_HOST
  Value: smtp.gmail.com
  ```
  **NOT**: `"smtp.gmail.com"`

### **2. Domain Configuration**

- Your verified domain: `luxcabistones.com`
- If using Resend, ensure your domain is verified in Resend dashboard
- Update `SMTP_FROM` to use your verified domain

### **3. Build Configuration**

The project is already configured with:

- ✅ All API routes use `export const dynamic = 'force-dynamic'`
- ✅ All API routes use `export const revalidate = 0`
- ✅ All API routes use `export const runtime = 'nodejs'`
- ✅ Lazy imports for Prisma, Resend, and Nodemailer
- ✅ No top-level side effects

## 🧪 Testing Checklist

### **Local Testing**

- ✅ `npm run lint` passes
- ✅ `npm run build` succeeds
- ✅ Authentication endpoints respond correctly
- ✅ Email sending works (Gmail SMTP configured)

### **Production Testing**

After deployment, test:

1. **Send Code**: POST to `/api/auth/send-code`
2. **Verify Code**: POST to `/api/auth/verify-code`
3. **Resend Code**: POST to `/api/auth/resend-code`

## 🔧 Handler Implementation Pattern

All authentication routes follow this pattern:

```typescript
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // ✅ ENV reads inside the handler
    const {
      RESEND_API_KEY,
      SMTP_FROM,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
    } = process.env;

    // ✅ Lazy import Prisma inside handler
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // ✅ Lazy import email services
    if (RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(RESEND_API_KEY);
      // ... email logic
    } else {
      const nodemailer = (await import('nodemailer')).default;
      // ... fallback logic
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## ✅ Ready for Production

Your authentication system is now fully optimized and ready for deployment to Vercel with:

- Zero build-time side effects
- Proper lazy loading
- Comprehensive error handling
- Email fallback system
- Development mode debugging
