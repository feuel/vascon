import { getProduct } from '../utils/products';
import { EditProductForm } from './edit-product-form';

export async function EditProduct({ productId }: { productId: string }) {
  const product = await getProduct(productId);
  return <EditProductForm product={product} />;
}
