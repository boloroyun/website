import { redirect } from 'next/navigation';

// Redirect to the new products page
const ShopPage = () => {
  redirect('/products');
};

export default ShopPage;
