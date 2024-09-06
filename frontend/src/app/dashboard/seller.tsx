import Link from 'next/link';
import { ProductsList } from '../components';
import { UserInterface } from '../types';
import { getUserProducts } from '../utils/products';
import { Box } from 'react-feather';

export async function Seller({ user }: { user: UserInterface }) {
  const { data: products, pagination } = await getUserProducts(user._id);
  return (
    <div>
      {products.length ? (
        <div className="py-10">
          <ProductsList
            className="!grid-cols-1 sm:!grid-cols-2"
            user={user}
            products={products}
          />
        </div>
      ) : (
        <div className="py-28">
          <div className="max-w-[400px] mx-auto gap-y-3 flex flex-col items-center justify-center">
            <Box className="h-28 w-28" strokeWidth={0.5} />
            <h3 className="text-xl font-medium text-gray-900">
              No product yet!
            </h3>
            <p className="text-center leading-6 font-light text-gray-600">
              You don't have any product in the marketplace yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
