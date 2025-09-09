# 🔐 Middleware Protection Guide

## **Overview**

The middleware protects specific routes to ensure only authenticated CLIENT users can access them.

## **Protected Routes**

### **CLIENT-Only Routes:**
- `/account/*` - User account management
- `/orders/*` - Order history and management  
- `/quotes/*` - Quote requests and management

### **Access Control Logic:**
1. **No Session** → Redirect to `/auth/signin?callbackUrl=<original-path>`
2. **Wrong Role** → Redirect to `/auth/unauthorized`
3. **CLIENT Role** → Allow access ✅

## **Public Routes (No Protection)**

All other routes are publicly accessible:
- `/` - Home page
- `/products/*` - Product catalog
- `/blog/*` - Blog posts
- `/contact` - Contact page
- `/about` - About page
- And all other non-protected routes

## **Excluded Paths (Always Allowed)**

These paths are never blocked by middleware:
- `/api/auth/*` - NextAuth API routes
- `/auth/*` - Authentication pages (signin, signup, unauthorized)
- `/_next/*` - Next.js static files
- `/favicon.ico` - Favicon
- `/public/*` - Public assets

## **User Experience Flow**

### **Scenario 1: Unauthenticated User**
```
User visits /account
↓
Middleware detects no session
↓
Redirects to /auth/signin?callbackUrl=/account
↓
After successful login, redirects back to /account
```

### **Scenario 2: Wrong Role (STAFF/ADMIN)**
```
STAFF user visits /account
↓
Middleware detects role !== CLIENT
↓
Redirects to /auth/unauthorized
↓
Shows 403 page with current role info
```

### **Scenario 3: CLIENT User**
```
CLIENT user visits /account
↓
Middleware detects valid CLIENT session
↓
Allows access to /account ✅
```

## **Error Handling**

### **Middleware Errors:**
- If JWT token parsing fails → Redirect to signin with error parameter
- Logs all access attempts and errors for debugging

### **Unauthorized Page Features:**
- Shows current user role (if logged in)
- Provides sign out option for role switching
- Links to home page and contact support
- Clear error messaging

## **Security Features**

1. **JWT Token Validation** - Uses NextAuth's `getToken()` for secure token parsing
2. **Role-Based Access Control** - Strict CLIENT-only enforcement
3. **Callback URL Preservation** - Maintains user's intended destination
4. **Error Logging** - Comprehensive logging for security monitoring
5. **Graceful Fallbacks** - Safe redirects on any errors

## **Development & Testing**

### **Test Cases:**
1. **Unauthenticated Access:**
   - Visit `/account` without login → Should redirect to signin
   
2. **Wrong Role Access:**
   - Login as STAFF/ADMIN, visit `/account` → Should show unauthorized
   
3. **Correct Role Access:**
   - Login as CLIENT, visit `/account` → Should allow access
   
4. **Public Route Access:**
   - Visit `/`, `/products`, `/blog` → Should always work

### **Debugging:**
- Check browser console for middleware logs
- Verify JWT token in browser dev tools (Application → Cookies)
- Test with different user roles

## **Configuration**

### **Environment Variables Required:**
```bash
NEXTAUTH_SECRET=your-secret-key  # Required for JWT token parsing
```

### **Middleware Matcher:**
```typescript
matcher: [
  '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)',
]
```

## **Customization**

### **Adding New Protected Routes:**
```typescript
const protectedRoutes = [
  '/account', 
  '/orders', 
  '/quotes',
  '/new-protected-route'  // Add here
];
```

### **Changing Role Requirements:**
```typescript
// Current: Only CLIENT allowed
if (token.role !== 'CLIENT') {
  // Redirect to unauthorized
}

// Example: Allow CLIENT and STAFF
if (!['CLIENT', 'STAFF'].includes(token.role)) {
  // Redirect to unauthorized
}
```

---

**🔒 Security Note:** This middleware provides client-side route protection. Always implement server-side authorization in your API routes and server components for complete security.
