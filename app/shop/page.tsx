import { redirect } from 'next/navigation';

// Force dynamic rendering to prevent build-time redirect execution
export const dynamic = 'force-dynamic';

// Redirect to the new products page
const ShopPage = () => {
  redirect('/products');
};

export default ShopPage;
