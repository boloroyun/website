# USA Standards Implementation

## Overview

This document outlines all the USA localization standards implemented throughout the website.

## 🇺🇸 Currency Standards (USD)

### Currency Symbol Updates

- **Old:** ₹ (Indian Rupee)
- **New:** $ (US Dollar)
- **Files Updated:** 8 files including SearchModal, ProductCard, SizeSelector, CartDrawer, etc.

### Currency Formatting

- **Format:** $123.45 (always 2 decimal places)
- **Utility:** `formatCurrency()` in `lib/usa-utils.ts`
- **Component:** `CurrencyDisplay.tsx` for consistent formatting

```typescript
// Usage
import { formatCurrency } from '@/lib/usa-utils';
formatCurrency(123.45); // Returns "$123.45"
```

## 📅 Date & Time Standards

### Date Format

- **Format:** MM/DD/YYYY (US standard)
- **Locale:** en-US
- **Utility:** `formatDate()` in `lib/usa-utils.ts`

### Time Format

- **Format:** 12-hour format with AM/PM
- **Timezone:** Eastern Time (EST/EDT) as default
- **Business Hours:** Mon-Fri: 9:00 AM - 6:00 PM EST

```typescript
// Usage
import { formatDateTime } from '@/lib/usa-utils';
formatDateTime(new Date()); // Returns "12/25/2023, 3:30 PM"
```

## 📞 Phone Number Standards

### Format

- **Standard:** (555) 123-4567
- **Pattern:** [0-9]{3}-[0-9]{3}-[0-9]{4}
- **International:** +1 (555) 123-4567
- **Utility:** `formatPhoneNumber()` in `lib/usa-utils.ts`

### Implementation

- Checkout form uses proper phone input validation
- Footer shows US phone format: +(916) 685-5555

## 🏠 Address Standards

### Address Format

- **Order:** Street Address, City, State ZIP Code
- **State:** 2-letter abbreviations (CA, NY, TX, etc.)
- **ZIP Code:** 12345 or 12345-6789 format
- **Country:** United States (default, read-only)

### Checkout Form Updates

```typescript
// State field
<Input placeholder="Enter state (e.g., CA, NY, TX)" />

// ZIP Code field
<Input
  placeholder="12345 or 12345-6789"
  pattern="[0-9]{5}(-[0-9]{4})?"
/>

// Country field
<Input defaultValue="United States" readOnly />
```

### State Management

- Full list of US states in `US_STATES` constant
- Utility functions for state name/abbreviation conversion

## 🌐 Locale Configuration

### Next.js Configuration

```javascript
// next.config.mjs
i18n: {
  locales: ['en-US'],
  defaultLocale: 'en-US',
}
```

### Metadata Updates

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'LUX - Premium Products & Services | USA',
  description:
    'Discover premium cabinets, stones, and beauty products across the United States.',
  openGraph: {
    locale: 'en_US',
  },
};
```

## 💼 Business Standards

### Business Hours Component

- **File:** `components/BusinessHours.tsx`
- **Display:** Shows EST business hours
- **Format:** Mon-Fri: 9:00 AM - 6:00 PM EST

### Tax Calculation

- State-based tax calculation utility
- Default 7% for unknown states
- Supports major states (CA: 8.75%, NY: 8%, TX: 6.25%, FL: 6%)

## 📦 Shipping Standards

### Shipping Time Format

- **1 day:** "1 business day"
- **2-5 days:** "X business days"
- **6-10 days:** "X-Y business days"
- **10+ days:** "X+ business days"

### Utility Function

```typescript
formatShippingTime(3); // Returns "3 business days"
formatShippingTime(1); // Returns "1 business day"
```

## 🛠 Utility Functions Reference

### `lib/usa-utils.ts` Exports

| Function                      | Purpose              | Example                                                |
| ----------------------------- | -------------------- | ------------------------------------------------------ |
| `formatCurrency(amount)`      | Format USD currency  | `formatCurrency(123.45)` → `"$123.45"`                 |
| `formatDate(date)`            | Format MM/DD/YYYY    | `formatDate(new Date())` → `"12/25/2023"`              |
| `formatDateTime(date)`        | Format with time     | `formatDateTime(new Date())` → `"12/25/2023, 3:30 PM"` |
| `formatPhoneNumber(phone)`    | Format US phone      | `formatPhoneNumber("5551234567")` → `"(555) 123-4567"` |
| `formatAddress(address)`      | Format US address    | Full address string                                    |
| `isValidZipCode(zip)`         | Validate ZIP code    | `true/false`                                           |
| `getStateName(abbr)`          | State abbr to name   | `getStateName("CA")` → `"California"`                  |
| `calculateTax(amount, state)` | Calculate state tax  | Tax amount                                             |
| `formatShippingTime(days)`    | Format shipping time | Business days string                                   |

### Constants Available

- `USA_LOCALE`: 'en-US'
- `USA_TIMEZONE`: 'America/New_York'
- `USA_CURRENCY`: 'USD'
- `US_STATES`: Object with all state abbreviations
- `BUSINESS_HOURS`: Standard business hours

## 🎨 Component Updates

### New Components

1. **`BusinessHours.tsx`** - Displays USA business hours
2. **`CurrencyDisplay.tsx`** - Consistent USD formatting
3. **`Price.tsx`** - Price display component
4. **`PriceWhole.tsx`** - Whole dollar display

### Updated Components

1. **SearchModal** - USD currency display
2. **ProductCard** - USD prices
3. **SizeSelector** - USD pricing
4. **CartDrawer** - USD totals
5. **Checkout** - USA address format

## 🔧 Implementation Files

### Core Files

- `lib/usa-utils.ts` - USA utility functions
- `next.config.mjs` - Locale configuration
- `app/layout.tsx` - Metadata and locale
- `docs/USA-Standards-Implementation.md` - This documentation

### Updated Components (8 files)

- `components/SearchModal.tsx`
- `components/home/ProductCard.tsx`
- `components/product/SizeSelector.tsx`
- `components/CartDrawer.tsx`
- `components/shop/FilterButton.tsx`
- `app/product/[slug]/page.tsx`
- `app/profile/orders/page.tsx`
- `app/order/page.tsx`

### New Components (4 files)

- `components/BusinessHours.tsx`
- `components/CurrencyDisplay.tsx`
- `components/Price.tsx`
- `components/PriceWhole.tsx`

## ✅ Testing Results

All pages load successfully with USA standards:

- ✅ Homepage: USD currency display
- ✅ Product pages: USD pricing
- ✅ Checkout: USA address format
- ✅ Search: USD search results
- ✅ Cart: USD totals

## 🚀 Future Enhancements

### Potential Additions

1. **State Sales Tax API Integration** - Real-time tax calculation
2. **Address Validation API** - USPS address verification
3. **Time Zone Detection** - Auto-detect user's US timezone
4. **Regional Shipping Zones** - Different shipping rules by region
5. **Holiday Calendar** - US business holiday awareness
6. **Measurement Units** - Imperial system (feet, inches, pounds)

### Advanced Features

1. **Multi-timezone Support** - Pacific, Mountain, Central, Eastern
2. **Regional Pricing** - Different pricing by US region
3. **State-specific Legal Text** - Compliance with state laws
4. **Local Store Finder** - Integration with US store locations

---

**Status:** ✅ Complete - All USA standards implemented and tested
**Last Updated:** December 2024
**Maintained By:** Development Team
