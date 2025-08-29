# 🚀 Vercel Environment Variables Checklist

## **🔧 REQUIRED FOR PRODUCTION & PREVIEW**

### **💾 Database (CRITICAL)**
- [ ] `DATABASE_URL` - MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
  - **REQUIRED** for all database operations

### **🌐 Site Configuration (CRITICAL)**
- [ ] `NEXT_PUBLIC_SITE_URL` - Your production domain
  - Production: `https://yourdomain.com`
  - Preview: `https://your-preview-domain.vercel.app`
- [ ] `NEXT_PUBLIC_SITE_NAME` - Site name for metadata
  - Example: `LUX Cabinets & Stones`
- [ ] `NEXT_PUBLIC_APP_URL` - App URL for internal links
  - Same as `NEXT_PUBLIC_SITE_URL`

### **🔐 Authentication (CRITICAL)**
- [ ] `NEXTAUTH_SECRET` - NextAuth secret key
  - Generate: `openssl rand -base64 32`
  - **REQUIRED** for JWT signing and encryption
- [ ] `NEXTAUTH_URL` - Auth callback URL
  - Production: `https://yourdomain.com`
  - Preview: `https://your-preview-domain.vercel.app`

### **🔐 API Security (CRITICAL)**
- [ ] `INTERNAL_API_TOKEN` - Server-side API authentication
  - Generate: Strong random string (32+ chars)
- [ ] `NEXT_PUBLIC_INTERNAL_API_TOKEN` - Client-side API authentication
  - Generate: Strong random string (32+ chars)

---

## **📧 EMAIL SERVICES (Choose One)**

### **Option A: Resend (Recommended)**
- [ ] `RESEND_API_KEY` - Resend API key
  - Get from: https://resend.com/api-keys

### **Option B: SMTP (Gmail/Custom)**
- [ ] `SMTP_HOST` - SMTP server host
  - Gmail: `smtp.gmail.com`
- [ ] `SMTP_PORT` - SMTP server port
  - Gmail: `587`
- [ ] `SMTP_USER` - SMTP username/email
- [ ] `SMTP_PASS` - SMTP password/app password
  - Gmail: Use App Password, not regular password

---

## **💳 PAYMENT GATEWAYS (Optional)**

### **Stripe**
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### **Razorpay**
- [ ] `RAZORPAY_KEY_ID` - Razorpay key ID
- [ ] `RAZORPAY_KEY_SECRET` - Razorpay secret key

---

## **🤖 EXTERNAL SERVICES (Optional)**

### **Crisp Chat**
- [ ] `CRISP_IDENTIFIER` - Crisp API identifier
- [ ] `CRISP_KEY` - Crisp API key
- [ ] `CRISP_WEBSITE_ID` - Crisp website ID
- [ ] `NEXT_PUBLIC_CRISP_WEBSITE_ID` - Crisp website ID (public)
- [ ] `CRISP_WEBHOOK_SECRET` - Crisp webhook secret

### **Admin API (Optional)**
- [ ] `ADMIN_API_BASE` - Admin API base URL

---

## **🎯 ENVIRONMENT-SPECIFIC VALUES**

### **Production Environment**
```bash
NODE_ENV=production  # Automatically set by Vercel
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

### **Preview Environment**
```bash
NODE_ENV=production  # Automatically set by Vercel
NEXT_PUBLIC_SITE_URL=https://your-preview-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-preview-domain.vercel.app
NEXTAUTH_URL=https://your-preview-domain.vercel.app
```

---

## **✅ VERIFICATION STEPS**

### **1. Test Database Connection**
Visit: `https://yourdomain.com/api/debug/count`
- Should return database counts
- If error, check `DATABASE_URL`

### **2. Test Email Service**
Visit: `https://yourdomain.com/api/test-email`
- Should show email service status
- If error, check email environment variables

### **3. Test API Authentication**
- Check that API calls work from frontend
- If 401/403 errors, verify `INTERNAL_API_TOKEN` values

### **4. Test Site Metadata**
- Check page titles show correct site name
- If generic titles, check `NEXT_PUBLIC_SITE_NAME`

---

## **🔒 SECURITY NOTES**

1. **Never commit secrets** to your repository
2. **Use different tokens** for production vs preview
3. **Rotate API keys** regularly
4. **Use strong passwords** (32+ characters, mixed case, numbers, symbols)
5. **Enable 2FA** on all service accounts

---

## **📋 QUICK SETUP COMMANDS**

### **Set Production Variables**
```bash
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add INTERNAL_API_TOKEN production
# ... continue for all required variables
```

### **Set Preview Variables**
```bash
vercel env add DATABASE_URL preview
vercel env add NEXT_PUBLIC_SITE_URL preview
vercel env add INTERNAL_API_TOKEN preview
# ... continue for all required variables
```

### **Deploy After Setting Variables**
```bash
vercel --prod  # Deploy to production
```

---

## **🚨 CRITICAL REMINDERS**

- ✅ **Database URL** must be accessible from Vercel's servers
- ✅ **NEXT_PUBLIC_*** variables are exposed to the browser
- ✅ **Production and Preview** should use separate databases if possible
- ✅ **Test thoroughly** in preview before promoting to production
- ✅ **Monitor logs** in Vercel dashboard for any runtime errors

---

**🎉 Once all required variables are set, your app will show real production data!**
