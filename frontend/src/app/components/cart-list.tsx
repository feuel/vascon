'use client';

import { useLocalStorage } from '@uidotdev/usehooks';
import {
  CartProductInterface,
  FormStateErrors,
  ProductPurchaseResponseInterface,
} from '../types';
import { Button } from './button';
import { CheckCircle, Minus, Plus, Trash2 } from 'react-feather';
import {
  immutableAddToSet,
  immutableRemoveItemFromArray,
} from '../utils/array';
import { purchaseProducts } from '../actions/product';
import { useState } from 'react';
import { UserCoins } from './user-coins';

export function CartList() {
  const [successData, setSuccessData] =
    useState<ProductPurchaseResponseInterface | null>(null);

  const [cart, setCart] = useLocalStorage('cart', []);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [errors, setErrors] = useState<FormStateErrors<{
    coins: any;
    products: any;
  }> | null>({
    coins: undefined,
  });

  const onPurchase = async () => {
    setIsPurchasing(true);
    setErrors({});
    const { errors, data } = await purchaseProducts(cart);
    setIsPurchasing(false);
    setErrors(errors);

    if (data) {
      setCart([]);
      setSuccessData(data);
    }
  };

  if (successData) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <CheckCircle
          strokeWidth="1"
          className="h-16 w-16 mb-4 text-green-600"
        />
        <h1 className="text-xl font-medium text-center mb-8">
          Purchase successfull
        </h1>
        <div className="w-full mb-8">
          <div className="text-[13px] uppercase text-gray-700">
            Purchase summary
          </div>
          <div className="mt-2 flex flex-col">
            {successData.products.map(({ total, name, quantity }) => (
              <div className="w-full grid grid-cols-2 text-sm py-2 border-t">
                <div className="text-gray-900">
                  {quantity} {name}
                </div>
                <strong className="font-light text-gray-600 text-right">
                  {total} coins
                </strong>
              </div>
            ))}
            <div className="w-full grid grid-cols-2 text-sm py-2 border-t border-gray-300">
              <div className="text-gray-900 font-medium">Total</div>
              <strong className="font-light text-gray-600 text-right">
                {successData.amount_spent} coins
              </strong>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="text-[13px] uppercase text-gray-700">Balance</div>
          <div className="mt-2 flex flex-col">
            <div className="mx-auto">
              <UserCoins hideLabel coins={successData.user_balance} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.length)
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <h1 className="text-xl font-medium text-center">Your cart is empty</h1>
        <p className="text-sm text-gray-600 font-light text-center">
          Go to marketplace and add stuff to your cart
        </p>
      </div>
    );

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-xl font-medium">Your cart</h1>
        <p className="text-sm text-gray-600 font-light">
          Review and complete your purchase
        </p>
      </div>
      {(errors?.coins || errors?.products) && (
        <div className="text-red-600 py-2 px-4 bg-red-50 text-center text-sm rounded">
          {errors.coins || errors?.products}
        </div>
      )}
      <div>
        <CartProducts products={cart} />
      </div>
      <div className="mt-20">
        <Button onClick={onPurchase} loading={isPurchasing} className="w-full">
          Complete purchase
        </Button>
      </div>
    </div>
  );
}

const CartProducts = ({ products }: { products: CartProductInterface[] }) => {
  return (
    <ul>
      {products.map((product) => {
        return (
          <li key={product._id} className="py-4 border-b last:border-b-0">
            <CartProduct product={product} />
          </li>
        );
      })}
    </ul>
  );
};

const CartProduct = ({ product }: { product: CartProductInterface }) => {
  const { name, quantity, cost, _id } = product;
  const amount = quantity * cost;
  const [cart, setCart] = useLocalStorage<CartProductInterface[]>('cart', []);

  function onChangeQuantity(change: number) {
    return () => {
      const amount = quantity + change;
      if (!amount) {
        setCart(immutableRemoveItemFromArray(cart, (item) => item._id === _id));
      } else
        setCart(
          immutableAddToSet(
            cart,
            { name, quantity: quantity + change, cost, _id },
            (item) => item._id === _id
          )
        );
    };
  }

  function onRemove() {
    setCart(immutableRemoveItemFromArray(cart, (item) => item._id === _id));
  }

  return (
    <div className="flex gap-x-3">
      <div className="h-20 w-20 bg-gray-100 rounded-md"></div>
      <div className="flex flex-col min-w-0">
        <div className="text-sm font-medium flex space-x-2 items-center">
          <div className="truncate">{name}</div>
          <span>-</span>
          <span className="text-xs text-teal-600 whitespace-nowrap">
            {cost} coins
          </span>
        </div>
        <div className="text-sm text-gray-500">{amount} coins</div>
        <div className="mt-auto">
          <div className="flex items-center gap-x-2">
            <button
              onClick={onChangeQuantity(-1)}
              className="h-[25px] w-[25px] rounded-full flex items-center justify-center border text-gray-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm tabular-nums">{quantity}</span>
            <button
              onClick={onChangeQuantity(1)}
              className="h-[25px] w-[25px] rounded-full flex items-center justify-center border text-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <button onClick={onRemove}>
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
