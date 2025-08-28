# Email Setup Guide for Authentication

## Current Status
The 4-digit verification code system is working, but **email sending is not configured**. In development mode, the system will show you the verification code in the browser console and UI for testing.

## Quick Testing (No Email Setup Required)

1. **Start the development server**: `npm run dev`
2. **Click the User icon** in the navbar (when not logged in)
3. **Enter any username and email** in the AccountPopUp modal
4. **Click "Continue"**
5. **Look for the verification code** in:
   - Browser console (Developer Tools)
   - The error message in the UI (shows "Development Mode: Use code XXXX")
   - Terminal logs
6. **Enter the 4-digit code** to complete authentication

## Email Service Configuration

To enable actual email sending, you need to set up environment variables. Create a `.env.local` file in the project root:

### Option 1: Resend (Recommended)

```bash
# .env.local
RESEND_API_KEY="re_xxxxxxxxxx"
NODE_ENV="development"
```

**Setup Steps:**
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Create an API key
4. Add your domain (or use their test domain)
5. Copy the API key to your `.env.local` file

### Option 2: SMTP (Gmail, Outlook, etc.)

```bash
# .env.local
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
NODE_ENV="development"
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password in `SMTP_PASS`

**For Other Providers:**
- **Outlook**: `smtp-mail.outlook.com`
- **Yahoo**: `smtp.mail.yahoo.com`
- **Custom SMTP**: Use your provider's settings

## Testing Email Configuration

Visit: `http://localhost:3000/api/test-email` to check your email configuration.

Or test with a specific email:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@email.com"}'
```

## Troubleshooting

### 1. "Email service not configured properly"
- Check your `.env.local` file exists
- Verify environment variable names are correct
- Restart your development server after adding env vars

### 2. "Authentication failed" (SMTP)
- For Gmail: Use App Password, not regular password
- Check if 2FA is enabled
- Verify SMTP settings for your provider

### 3. "Domain not verified" (Resend)
- Add your domain in Resend dashboard
- Or use their test domain for development

### 4. Still not working?
- Check browser console for error messages
- Check terminal logs for detailed error info
- Use the test API route to debug: `/api/test-email`

## Production Setup

For production, make sure to:
1. Set `NODE_ENV="production"` 
2. Use a verified domain with Resend
3. Or configure proper SMTP with your email provider
4. Test thoroughly before deploying

## Current Development Workflow

**Without Email Setup:**
1. Enter username/email → Get code in console/UI
2. Enter the displayed code → Authentication works
3. User gets logged in and cookies are set

**With Email Setup:**
1. Enter username/email → Code sent to actual email
2. Check email for 4-digit code
3. Enter code → Authentication works
4. User gets logged in and cookies are set

The authentication system works perfectly - it just needs email configuration for production use!
