'use client';

import { Edit2, Minus, Plus } from 'react-feather';
import {
  CartProductInterface,
  ProductInterface,
  UserInterface,
  UserRoleEnum,
} from '../types';
import { Button } from './button';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useMemo } from 'react';
import {
  getItemFromArray,
  immutableAddToSet,
  immutableRemoveItemFromArray,
} from '../utils/array';
import clsx from 'clsx';
import Link from 'next/link';

export function ProductsList({
  products,
  user,
  className,
  editLink = '/dashboard/?panel=edit-product',
}: {
  products: ProductInterface[];
  user: UserInterface | null;
  className?: string;
  editLink?: string;
}) {
  return (
    <ul
      className={clsx(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
        className
      )}
    >
      {products.map((product) => (
        <Product
          editLink={editLink}
          key={product._id}
          user={user}
          product={product}
        />
      ))}
    </ul>
  );
}

function Product({
  product,
  user,
  editLink,
}: {
  product: ProductInterface;
  user: UserInterface | null;
  editLink: string;
}) {
  const { name, amount_available, _id, cost, seller } = product;
  const [cart, setCart] = useLocalStorage<CartProductInterface[]>('cart', []);

  const { inCart, count } = useMemo(() => {
    const item = getItemFromArray(cart, (item) => item._id === _id)?.item;
    if (!item) return { inCart: false, count: 0 };
    return { inCart: true, count: item.quantity };
  }, [cart, _id]);

  const allowAddToCart =
    !user || (user.role === UserRoleEnum.Buyer && amount_available > 0);

  function onAddToCart() {
    setCart(
      immutableAddToSet(
        cart,
        { name, quantity: 1, cost, _id },
        (item) => item._id === _id
      )
    );
  }
  function onChangeQuantity(change: number) {
    return () => {
      const amount = count + change;
      if (!amount) {
        setCart(immutableRemoveItemFromArray(cart, (item) => item._id === _id));
      } else
        setCart(
          immutableAddToSet(
            cart,
            { name, quantity: count + change, cost, _id },
            (item) => item._id === _id
          )
        );
    };
  }

  return (
    <div className="rounded-lg border p-3 flex flex-col">
      <div className="h-40 bg-gray-100 mb-3 rounded"></div>
      <div className="flex gap-x-3 items-start justify-between mb-4">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-sm text-gray-600 font-medium">{cost} coins</div>
        </div>
        {allowAddToCart && !inCart && (
          <Button
            onClick={onAddToCart}
            className="h-[32px] w-[32px] rounded-full px-2"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}

        {allowAddToCart && inCart && (
          <div className="flex gap-x-1 items-center">
            <button
              onClick={onChangeQuantity(-1)}
              className="h-[32px] w-[32px] rounded-full flex items-center justify-center border text-gray-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm tabular-nums">{count}</span>
            <button
              onClick={onChangeQuantity(1)}
              className="h-[32px] w-[32px] rounded-full flex items-center justify-center border text-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {user?.role === UserRoleEnum.Seller && seller === user._id && (
          <Link
            prefetch
            href={`${editLink}&product=${_id}`}
            className="btn h-[32px] w-[32px] rounded-full px-2"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
        )}
      </div>
      <div className="text-[13px] mt-auto justify-end">
        {amount_available > 0 ? (
          <span className="text-teal-700">
            {product.amount_available} remaining
          </span>
        ) : (
          <span className="text-orange-700">Out of stock</span>
        )}
      </div>
    </div>
  );
}
