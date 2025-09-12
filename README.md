# Lux Cabinets & Stones Website

A modern Next.js e-commerce website for premium cabinets, stones, and beauty products.

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies:

```bash
npm i
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```
ADMIN_API_BASE=
INTERNAL_API_TOKEN=
NEXT_PUBLIC_CRISP_WEBSITE_ID=
CRISP_IDENTIFIER=
CRISP_KEY=
CRISP_WEBSITE_ID=
NEXT_PUBLIC_SITE_NAME=Lux Cabinets & Stones
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

### Build and Start

```bash
npm run build
npm start
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel Project Settings:
   - Copy all variables from `.env.example`
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain
   - Configure any required API keys and secrets
3. Deploy automatically on push to main branch

## Environment Variables

All environment variables are documented in `.env.example`. Make sure to set these in your deployment platform:

- `ADMIN_API_BASE` - Base URL for admin API calls
- `INTERNAL_API_TOKEN` - Token for internal API authentication
- `NEXT_PUBLIC_ADMIN_API_BASE` - Admin API base URL for client-side requests
  - Local: `http://localhost:3001` (or whatever port your admin API runs on)
  - Production: `https://admin.yourdomain.com`
- `NEXT_PUBLIC_CRISP_WEBSITE_ID` - Crisp chat widget ID (optional)
- `CRISP_IDENTIFIER` - Crisp API identifier
- `CRISP_KEY` - Crisp API key
- `CRISP_WEBSITE_ID` - Crisp website ID
- `NEXT_PUBLIC_SITE_NAME` - Site name for metadata
- `NEXT_PUBLIC_SITE_URL` - Full site URL for canonical links

## Features

- 🛍️ E-commerce functionality with cart and checkout
- 📱 Responsive design with mobile-first approach
- 🔍 Product search and filtering
- 💬 Crisp chat integration
- 📧 Contact forms and quote requests
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast performance with Next.js 14

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand, Jotai
- **Database**: Prisma with MongoDB
- **Email**: React Email with Resend
- **Chat**: Crisp
- **Deployment**: Vercel
