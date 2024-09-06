import { CartButton, Logo, Panel } from '../components';
import { getUser } from '../utils/user';
import { UserRoleEnum } from '../types';
import Link from 'next/link';
import { CreateProduct } from './create-product';
import { Buyer } from './buyer';
import { Seller } from './seller';
import { CartList } from '../components/cart-list';
import { DepositCoin } from './deposit-coin';
import { EditProduct } from './edit-product';
import { Logout } from '../components/logout';

export default async function Index({
  searchParams,
}: {
  searchParams: { panel: string; product: string };
}) {
  const panel = searchParams.panel;
  const productId = searchParams.product;
  const user = await getUser({ redirectToLogin: true });
  if (!user) return null;

  const { role, first_name, last_name, username } = user;
  return (
    <>
      <div>
        <div className="container">
          <div className="max-w-[600px] mx-auto">
            <header className="flex items-center border-b justify-between h-[50px] sticky top-0 bg-white">
              <div>
                <Logo page="Dashboard" />
              </div>
              <div className="flex items-center gap-x-2">
                {role === UserRoleEnum.Buyer ? (
                  <>
                    <Link
                      className="btn h-[35px] rounded-full"
                      href="/dashboard/?panel=deposit"
                    >
                      Deposit
                    </Link>
                    <CartButton to="/dashboard/?panel=cart" />
                  </>
                ) : (
                  <Link
                    className="btn h-[35px] rounded-full"
                    href="/dashboard/?panel=new-product"
                  >
                    Add product
                  </Link>
                )}
              </div>
            </header>
            <main>
              <div className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full uppercase h-32 w-32 text-5xl bg-gray-100 flex items-center justify-center mb-3">
                    {first_name.charAt(0)}
                    {last_name.charAt(0)}
                  </div>
                  <h1 className="text-2xl font-semibold mb-0.5">
                    {first_name} {last_name}
                  </h1>
                  <p className="text-gray-700">@{username}</p>
                  <div className="mt-4">
                    <Logout username={username} />
                  </div>
                </div>
                {role === UserRoleEnum.Buyer ? (
                  <Buyer user={user} />
                ) : (
                  <Seller user={user} />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      {role === UserRoleEnum.Buyer && (
        <Panel close="/dashboard" open={panel === 'cart'}>
          <CartList key={`${panel === 'cart'}`} />
        </Panel>
      )}
      {role === UserRoleEnum.Buyer && (
        <Panel close="/dashboard" open={panel === 'deposit'}>
          <DepositCoin key={`${panel === 'deposit'}`} />
        </Panel>
      )}
      {role === UserRoleEnum.Seller && (
        <Panel close="/dashboard" open={panel === 'new-product'}>
          <CreateProduct key={`${panel === 'new-product'}`} />
        </Panel>
      )}
      {role === UserRoleEnum.Seller && productId && (
        <Panel close="/dashboard" open={panel === 'edit-product'}>
          <EditProduct
            productId={productId}
            key={`${panel === 'edit-product'}`}
          />
        </Panel>
      )}
    </>
  );
}
