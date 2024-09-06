import Link from 'next/link';
import { CartButton, Logo, Panel, ProductsList } from './components';
import { getUser } from './utils/user';
import { getProducts } from './utils/products';
import { ShoppingBag } from 'react-feather';
import { UserRoleEnum } from './types';
import { CartList } from './components/cart-list';
import { EditProduct } from './dashboard/edit-product';

export default async function Index({
  searchParams,
}: {
  searchParams: { panel: string; product: string };
}) {
  const panel = searchParams.panel;
  const productId = searchParams.product;
  const userRequest = getUser({ redirectToLogin: false });
  const productsRequest = getProducts();
  const [user, { data: products, pagination }] = await Promise.all([
    userRequest,
    productsRequest,
  ]);

  return (
    <>
      <main>
        <div className="container">
          <div className="max-w-[900px] mx-auto">
            <header className="flex items-center border-b justify-between h-[50px] sticky top-0 bg-white">
              <div>
                <Logo page="Marketplace" />
              </div>
              {user ? (
                <div className="flex items-center gap-x-4">
                  <Link
                    href="/dashboard"
                    className="rounded-full uppercase h-8 w-8 bg-gray-300 flex items-center justify-center"
                  >
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </Link>
                  {user.role === UserRoleEnum.Buyer && <CartButton />}
                </div>
              ) : (
                <div>
                  <Link
                    href="/login"
                    className="px-3 flex items-center h-[32px] rounded-md text-sm bg-indigo-600 text-white"
                  >
                    Login
                  </Link>
                </div>
              )}
            </header>
            <div>
              {products.length ? (
                <div className="py-8">
                  <ProductsList
                    editLink="/?panel=edit-product"
                    user={user}
                    products={products}
                  />
                </div>
              ) : (
                <div className="py-20">
                  <div className="max-w-[400px] mx-auto gap-y-3 flex flex-col items-center justify-center">
                    <ShoppingBag className="h-32 w-32" strokeWidth={1} />
                    <h3 className="text-xl font-medium text-gray-900">
                      Nothing in marketplace yet!
                    </h3>
                    <div className="text-center leading-6 font-light text-gray-600">
                      {user ? (
                        user.role === UserRoleEnum.Buyer ? (
                          <p>
                            We have searched and searched and their is nothing
                            to buy now, check a little later
                          </p>
                        ) : (
                          <div className="flex gap-y-4 flex-col">
                            <p>
                              There are no items in the marketplace, you can
                              have yours here first
                            </p>
                            <Link
                              className="btn h-[35px] mx-auto"
                              href="/dashboard/?panel=new-product"
                            >
                              Add your product
                            </Link>
                          </div>
                        )
                      ) : (
                        <p>
                          No items here yet? You can create a seller account and
                          get your items here, or seller account to start
                          depositing coins
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {user?.role === UserRoleEnum.Buyer && (
        <Panel open={panel === 'cart'}>
          <CartList key={`${panel === 'cart'}`} />
        </Panel>
      )}
      {user?.role === UserRoleEnum.Seller && productId && (
        <Panel open={panel === 'edit-product'}>
          <EditProduct
            productId={productId}
            key={`${panel === 'edit-product'}`}
          />
        </Panel>
      )}
    </>
  );
}
