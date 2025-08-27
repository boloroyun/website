# CartItem Interface Guide

This guide explains the complete `CartItem` interface and its properties.

## CartItem Interface

```typescript
export interface CartItem {
  // Required Properties
  uid: string; // Unique identifier: productid_size format
  productId: string; // Product database ID
  name: string; // Product name
  price: number; // Current price
  quantity: number; // Quantity in cart
  size: string; // Selected size
  maxQuantity: number; // Maximum available quantity
  image: string; // Product image URL
  slug: string; // Product URL slug

  // Optional Properties
  vendor?: any; // JSON data for vendor information
  color?: {
    // Color selection details
    name: string; // Color name (e.g., "Red", "Blue")
    color: string; // Color hex code (e.g., "#FF0000")
    image?: string; // Optional color swatch image URL
  };
  sku?: string; // Product SKU
  discount?: number; // Discount amount
  originalPrice?: number; // Original price before discount
}
```

## Required Properties

These properties **must** be provided when adding items to cart:

| Property      | Type     | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `productId`   | `string` | Database ID of the product                  |
| `name`        | `string` | Display name of the product                 |
| `price`       | `number` | Current selling price                       |
| `quantity`    | `number` | Number of items to add                      |
| `size`        | `string` | Selected size (e.g., "M", "Large", "32x24") |
| `maxQuantity` | `number` | Maximum available stock                     |
| `image`       | `string` | Product image URL                           |
| `slug`        | `string` | Product URL slug for navigation             |

## Optional Properties

These properties are optional and will be set to default values if not provided:

| Property        | Type     | Default | Description                    |
| --------------- | -------- | ------- | ------------------------------ |
| `vendor`        | `any`    | `null`  | Vendor/supplier information    |
| `color`         | `object` | `null`  | Color selection details        |
| `sku`           | `string` | `null`  | Product SKU identifier         |
| `discount`      | `number` | `0`     | Discount amount                |
| `originalPrice` | `number` | `price` | Original price before discount |

## Usage Examples

### Basic Usage (Required Properties Only)

```typescript
import { useCartStore } from '@/lib/cart-store';

const { addItem } = useCartStore();

// Add item with required properties only
addItem({
  productId: '64f1234567890abcdef12345',
  name: 'Premium Kitchen Cabinet',
  price: 299.99,
  quantity: 1,
  size: '24x36',
  maxQuantity: 10,
  image: 'https://example.com/cabinet.jpg',
  slug: 'premium-kitchen-cabinet',
});
```

### Advanced Usage (With Optional Properties)

```typescript
// Add item with color and vendor information
addItem({
  productId: '64f1234567890abcdef12345',
  name: 'Premium Kitchen Cabinet',
  price: 249.99,
  quantity: 1,
  size: '24x36',
  maxQuantity: 10,
  image: 'https://example.com/cabinet.jpg',
  slug: 'premium-kitchen-cabinet',
  // Optional properties
  color: {
    name: 'Oak Natural',
    color: '#D2691E',
    image: 'https://example.com/oak-swatch.jpg',
  },
  vendor: {
    name: 'Premium Cabinets Inc',
    location: 'California',
  },
  sku: 'CAB-24x36-OAK',
  originalPrice: 299.99,
  discount: 50.0,
});
```

### Using the Helper Function

```typescript
import { createCartItem } from '@/lib/cart-store';

const cartItem = createCartItem(
  {
    productId: '64f1234567890abcdef12345',
    name: 'Premium Kitchen Cabinet',
    price: 249.99,
    quantity: 1,
    size: '24x36',
    maxQuantity: 10,
    image: 'https://example.com/cabinet.jpg',
    slug: 'premium-kitchen-cabinet',
  },
  {
    // Optional properties
    color: {
      name: 'Oak Natural',
      color: '#D2691E',
    },
    sku: 'CAB-24x36-OAK',
    discount: 50.0,
  }
);
```

## Validation

The cart store automatically validates that all required properties are present:

```typescript
// ✅ Valid - all required properties provided
addItem({
  productId: '123',
  name: 'Cabinet',
  price: 100,
  quantity: 1,
  size: 'M',
  maxQuantity: 5,
  image: 'image.jpg',
  slug: 'cabinet',
});

// ❌ Invalid - missing required properties
addItem({
  productId: '123',
  name: 'Cabinet',
  // Error: Missing required fields
});
```

## Integration with Orders

When orders are created, the CartItem properties are mapped to OrderProduct:

```typescript
// CartItem → OrderProduct mapping
{
  productId: item.productId,      // ✓ Direct mapping
  name: item.name,                // ✓ Direct mapping
  image: item.image,              // ✓ Direct mapping
  size: item.size,                // ✓ Direct mapping
  qty: item.quantity,             // ✓ quantity → qty
  price: item.price,              // ✓ Direct mapping
  productCompletedAt: null        // ✓ Order tracking field
}
```

## Migration Notes

If you have existing cart items that don't include the new optional properties, they will be automatically populated with default values:

- `vendor: null`
- `color: null`
- `sku: null`
- `discount: 0`
- `originalPrice: price` (uses the current price)

## Best Practices

1. **Always provide required properties** - The validation will catch missing fields
2. **Use the `createCartItem` helper** for complex items with optional properties
3. **Include color information** for products with color variants
4. **Set `originalPrice`** when applying discounts to show savings
5. **Use meaningful SKUs** for inventory tracking
6. **Validate image URLs** before adding to cart
