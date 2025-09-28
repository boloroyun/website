# Resend Email Configuration Guide

## Overview

The contact form now uses Resend email service to send emails to `info@luxcabistones.com` and auto-replies to customers.

## Setup Instructions

### 1. Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

### 2. Configure Environment Variable

Add the following to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"

# Google Maps & Places (for reviews section)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyC4R6AN7SmxxxxxxxxxxxxxxxxxxxxxxxxxxX"
NEXT_PUBLIC_GOOGLE_PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4"
```

### 3. Domain Configuration (Production)

For production, you'll need to:

1. Add and verify your domain `luxcabistones.com` in Resend
2. Update the `from` address in `/lib/resend.ts` if needed
3. Configure DNS records as instructed by Resend

## Email Features

### Business Email (to info@luxcabistones.com)

- **Subject**: 🏠 New Contact: [Customer Subject]
- **From**: LUX Cabinets & Stones <noreply@luxcabistones.com>
- **Reply-To**: Customer's email (for easy replies)
- **Content**: Formatted HTML with all form data
- **Includes**: Name, email, phone, subject, project type, budget, message

### Customer Auto-Reply

- **Subject**: 🏠 Thank you for contacting LUX Cabinets & Stones
- **From**: LUX Cabinets & Stones <noreply@luxcabistones.com>
- **Content**: Professional thank you message with contact info
- **Includes**: Business hours, phone numbers, address

## Files Modified

### `/lib/resend.ts` (NEW)

- Resend email service configuration
- `sendContactEmail()` - Sends to business
- `sendContactAutoReply()` - Sends to customer
- Beautiful HTML email templates

### `/app/api/contact/route.ts` (UPDATED)

- Now uses Resend instead of console logging
- Validates email format
- Handles API key configuration
- Sends both business email and auto-reply
- Better error handling

## Testing

### Local Testing

1. Set `RESEND_API_KEY` in `.env.local`
2. Fill out contact form on `/contact`
3. Check console for success/error messages
4. Check Resend dashboard for sent emails

### Error Handling

- Missing API key: Returns 503 error with helpful message
- Invalid email: Returns 400 error
- Email sending failure: Returns 500 error with details
- Auto-reply failure: Logged as warning (non-critical)

## Email Templates

### Business Email Template

- Professional gradient header
- Organized field display
- Clickable phone/email links
- Timestamp and source tracking
- Mobile-responsive design

### Auto-Reply Template

- Branded header with logo
- Thank you message
- Next steps information
- Complete contact information
- Professional closing

## Production Checklist

- [ ] Add `RESEND_API_KEY` to production environment
- [ ] Verify domain in Resend dashboard
- [ ] Configure DNS records
- [ ] Test email delivery
- [ ] Monitor Resend dashboard for delivery stats
- [ ] Set up email monitoring/alerts

## Troubleshooting

### Common Issues

1. **503 Error**: API key not configured
2. **Email not received**: Check spam folder, verify domain
3. **Invalid domain**: Verify domain in Resend dashboard
4. **Rate limits**: Check Resend usage limits

### Debug Steps

1. Check console logs for detailed error messages
2. Verify API key format (starts with `re_`)
3. Check Resend dashboard for delivery status
4. Test with different email addresses

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support
