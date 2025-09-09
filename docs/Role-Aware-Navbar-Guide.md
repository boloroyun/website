# 🧭 Role-Aware Navbar System

## **Overview**

The navbar system provides role-based navigation with server-side authentication checking using NextAuth.

## **Architecture**

### **Server Components:**

- **`app/_components/navbar.tsx`** - Main navbar (Server Component)
- **`lib/roles.ts`** - Role utility functions
- **`lib/auth.ts`** - Enhanced with `auth()` function

### **Client Components:**

- **`app/_components/SignOutButton.tsx`** - Sign out functionality
- **`app/_components/MobileMenu.tsx`** - Mobile navigation menu

## **Role-Based Navigation**

### **Unauthenticated Users:**

- **Public Links:** Home, Products, Blog, Contact
- **Auth Action:** "Sign in" button → `/auth/signin`

### **CLIENT Users:**

- **Public Links:** Home, Products, Blog, Contact
- **Private Links:** "Account" → `/account`
- **Actions:** Sign out button

### **STAFF/ADMIN Users:**

- **Public Links:** Home, Products, Blog, Contact
- **Private Links:** "Dashboard" → External admin URL
- **Actions:** Sign out button

## **Features**

### **🔐 Server-Side Authentication:**

```typescript
// In navbar.tsx (Server Component)
const session = await auth();
const user = session?.user;
const userRole = user?.role;
```

### **📱 Responsive Design:**

- **Desktop:** Horizontal navigation with role-based links
- **Mobile:** Hamburger menu with slide-out panel
- **Sticky:** Fixed top navigation with backdrop blur

### **🎨 Tailwind Styling:**

- **Modern Design:** Clean, minimal interface
- **Accessibility:** Proper ARIA labels and keyboard navigation
- **Dark Mode Ready:** Uses Tailwind design tokens

### **🔧 Role Utilities:**

```typescript
// lib/roles.ts
isClient(role); // Check if CLIENT
isStaffOrAdmin(role); // Check if STAFF or ADMIN
isAdmin(role); // Check if ADMIN only
isStaff(role); // Check if STAFF only
getRoleDisplayName(role); // Get display name
getAdminDashboardUrl(); // Get admin URL
```

## **Configuration**

### **Environment Variables:**

```bash
# Optional: Custom admin dashboard URL
ADMIN_APP_URL=https://admin.yourdomain.com

# Required: NextAuth configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com
```

### **Admin Dashboard URL:**

- **Environment:** Uses `ADMIN_APP_URL` if set
- **Fallback:** `https://admin.example.com`
- **Target:** Opens in new tab with `target="_blank"`

## **User Experience**

### **Desktop Navigation:**

```
[Logo] [Home] [Products] [Blog] [Contact] | [User Info] [Role Link] [Sign Out]
```

### **Mobile Navigation:**

```
[Logo]                                                    [☰]
```

**Expanded:**

```
┌─────────────────────────────┐
│ Menu                      × │
├─────────────────────────────┤
│ Home                        │
│ Products                    │
│ Blog                        │
│ Contact                     │
├─────────────────────────────┤
│ [User Info Card]            │
│ [Role-based Links]          │
│ [Sign Out Button]           │
└─────────────────────────────┘
```

## **Implementation Details**

### **Server Component Benefits:**

- **Performance:** No client-side auth checks
- **SEO:** Server-rendered navigation
- **Security:** Role checking on server

### **Client Component Usage:**

- **SignOutButton:** Handles `signOut()` from NextAuth
- **MobileMenu:** Interactive menu state management

### **Type Safety:**

```typescript
// User session type (extended)
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string; // CLIENT | STAFF | ADMIN
}
```

## **Customization**

### **Adding New Public Links:**

```typescript
// In navbar.tsx
const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/new-page', label: 'New Page' }, // Add here
];
```

### **Adding Role-Specific Links:**

```typescript
// In navbar.tsx
{isClient(userRole) && (
  <Link href="/account">Account</Link>
)}

{isStaffOrAdmin(userRole) && (
  <Link href="/dashboard">Dashboard</Link>
)}

// Add new role-based link
{isAdmin(userRole) && (
  <Link href="/admin-only">Admin Panel</Link>
)}
```

### **Styling Customization:**

```typescript
// Update Tailwind classes in navbar.tsx
className = 'your-custom-classes';
```

## **Security Notes**

1. **Server-Side Only:** Role checking happens on server
2. **Client Hydration:** No flash of wrong content
3. **Middleware Protection:** Routes still protected by middleware
4. **Token Validation:** Uses NextAuth's secure session handling

## **Testing**

### **Test Cases:**

1. **Unauthenticated:** Should show "Sign in" button
2. **CLIENT Role:** Should show "Account" link
3. **STAFF Role:** Should show "Dashboard" link
4. **ADMIN Role:** Should show "Dashboard" link
5. **Mobile Menu:** Should work on all screen sizes
6. **Sign Out:** Should redirect to home page

### **Development Testing:**

```bash
# Test different roles by updating user role in database
# Or create test accounts with different roles
```

---

**🎯 The navbar provides a seamless, role-aware navigation experience that adapts to user permissions while maintaining security and performance.**
