# API and Email Troubleshooting Guide

This document provides solutions for two issues identified in the system:

1. Email Configuration Errors
2. Quote API Endpoint Errors (405 Method Not Allowed)

## 1. Email Configuration Fix

The error `getaddrinfo ENOTFOUND smtp.yourprovider.com` indicates that the email service is not properly configured.

### Solution:

1. Create a `.env.local` file in the root directory using the provided template:

```bash
# Copy the template
cp email-config-template.txt .env.local

# Edit the file with your email credentials
nano .env.local
```

2. Choose one of these options:

#### Option A: Gmail SMTP (Requires Gmail Account)

```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail-address@gmail.com"
SMTP_PASS="your-app-password"
```

**Note:** For Gmail, you need to:

- Enable 2-Factor Authentication in your Google Account
- Generate an App Password (not your regular password)
- Use this App Password in the SMTP_PASS field

#### Option B: Use Resend.com (Recommended)

```
RESEND_API_KEY="re_xxxxxxxxxx"
```

1. Create an account on [resend.com](https://resend.com)
2. Generate an API key
3. Add it to your `.env.local` file

4. Restart your development server after making changes:

```bash
npm run dev
```

## 2. Quote API 405 Method Not Allowed Fix

The 405 errors indicate that the API endpoints either don't exist or don't support the HTTP methods being used.

### Solution:

We've applied two fixes:

1. **Updated the Quote API Code**: The API now tries multiple HTTP methods (POST and PUT) for each endpoint, increasing the chances of finding a working combination.

2. **Endpoint Diagnostic Tool**: We've created a script to test various endpoint combinations:

```bash
# Run the script to find working endpoints
node scripts/test-quote-endpoints.js
```

3. **Update Admin API URL** (if needed):

If the script finds a working endpoint, update your `.env.local`:

```
NEXT_PUBLIC_ADMIN_API_BASE="https://correct-url-found-by-script"
```

### Troubleshooting Checklist:

- Ensure the admin API server is running and accessible
- Check if CORS is enabled on the admin server
- Verify the API endpoints are correctly implemented
- Confirm any required authentication (API keys, tokens) is provided

## Verifying Fixes

### Email Fix Verification:

```bash
# Test email configuration
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@email.com"}'
```

### Quote API Fix Verification:

1. Submit a quote request on the website
2. Check the server logs for successful API responses
3. If still having issues, run the endpoint diagnostic script again

## Need More Help?

If you continue experiencing issues after applying these fixes, consider:

1. Checking server logs for more detailed error messages
2. Examining the admin API server for endpoint configurations
3. Testing the API endpoints directly using tools like Postman or Insomnia
