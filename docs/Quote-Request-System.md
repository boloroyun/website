# Quote Request System Documentation

## Overview

The Quote Request System allows customers to request quotes for products directly from the product detail pages. This document explains how the system works, including the API endpoints, data flow, and fallback mechanisms.

## Components

### Frontend Components

1. **GetQuoteButton.tsx**
   - Renders the "Get a Quote Now" button on product pages
   - Opens the quote request modal when clicked

2. **QuoteModal.tsx**
   - Displays a form for customers to enter their information
   - Collects name, email, phone (optional), ZIP code (optional), and notes
   - Submits the form data to the `/api/quotes` endpoint
   - Shows success/error messages to the user
   - Integrates with Crisp chat if available

### Backend Components

1. **Website API: `/api/quotes/route.ts`**
   - Receives quote requests from the frontend
   - Validates required fields (name, email, productId, productName)
   - Attempts to forward the request to the admin API
   - Sends email notifications to staff
   - Falls back to local storage if the admin API is unavailable
   - Returns appropriate responses to the frontend

2. **Admin API: `/api/quotes/submit/route.ts`**
   - Receives quote requests from the website API
   - Creates a new quote in the database
   - Returns success/error responses

3. **Retry System: `/api/quotes/retry/route.ts`**
   - Handles retrying failed quote requests
   - Called by the fallback mechanism

4. **Fallback System: `lib/quote-fallback.ts`**
   - Stores quote requests in local storage when the admin API is unavailable
   - Provides functions to retrieve, update, and remove pending quotes
   - Implements an automatic retry mechanism

5. **Email Notification System: `lib/mail.ts`**
   - Sends email notifications to staff when quote requests are received
   - Provides HTML templates for quote request emails
   - Handles email sending errors gracefully

## Data Flow

1. User clicks "Get a Quote Now" button on a product page
2. Quote modal opens, user fills out the form and submits
3. Frontend sends the data to `/api/quotes` endpoint
4. Website API validates the data and attempts to forward it to the admin API
5. An email notification is sent to staff (regardless of admin API success)
6. If admin API is successful, a success message is shown to the user
7. If admin API fails, the quote is stored locally and a success message with a warning is shown
8. Stored quotes are automatically retried when the page is loaded again

## Fallback Mechanism

The fallback mechanism ensures that quote requests are not lost even if the admin API is unavailable:

1. If the admin API is unreachable or returns an error, the quote is stored in local storage
2. The system schedules automatic retries for pending quotes
3. Quotes are retried up to 5 times with a 1-minute delay between attempts
4. If a retry is successful, the quote is removed from local storage

## Environment Variables

- `NEXT_PUBLIC_ADMIN_API_BASE`: URL of the admin API (e.g., `https://admin.luxcabistones.com`)
- `ADMIN_API_KEY`: Optional API key for authenticating with the admin API
- `QUOTE_NOTIFICATION_EMAIL`: Email address to send quote notifications to (defaults to `EMAIL_FROM` if not set)

### Email Configuration Variables

- `EMAIL_HOST`: SMTP server hostname
- `EMAIL_PORT`: SMTP server port
- `EMAIL_SECURE`: Whether to use TLS (true/false)
- `EMAIL_USER`: SMTP username
- `EMAIL_PASSWORD`: SMTP password
- `EMAIL_FROM`: From email address for notifications

## Troubleshooting

### Common Issues

1. **Quote requests not showing up in admin**
   - Check that `NEXT_PUBLIC_ADMIN_API_BASE` is set correctly
   - Verify that the admin API endpoint is working
   - Check the browser console and server logs for errors

2. **"Failed to submit request" error**
   - Check network connectivity
   - Verify that the admin API is running
   - Check for CORS issues

3. **Duplicate quotes in admin**
   - This can happen if a quote is successfully submitted but the response is lost
   - The fallback system might retry the quote, resulting in duplicates

### Debugging

1. Use the browser console to check for errors
2. Check the server logs for detailed error messages
3. Use the `/api/debug/auth` endpoint to check authentication status (development only)
4. Run the test scripts to verify API functionality:
   - `node scripts/test-quote-api.js`
   - `node scripts/test-admin-quotes-api.js`

## Future Improvements

1. Add server-side storage for pending quotes (e.g., in a database)
2. Implement a more robust retry mechanism with exponential backoff
3. Add admin notification for failed quote requests
4. Implement rate limiting to prevent abuse
5. Add more detailed logging and monitoring
