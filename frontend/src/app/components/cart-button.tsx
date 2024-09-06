'use client';

import { useLocalStorage } from '@uidotdev/usehooks';
import Link from 'next/link';
import { ShoppingCart } from 'react-feather';

export function CartButton({ to }: { to?: string }) {
  const [cart] = useLocalStorage('cart', []);
  return (
    <Link
      prefetch
      href={to || '/?panel=cart'}
      aria-label="Open cart"
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {cart.length ? (
        <span className="absolute text-[10px] bg-orange-600 text-white rounded-full min-w-4 min-h-4 -top-2 -right-2 flex items-center justify-center">
          {cart.length}
        </span>
      ) : null}
    </Link>
  );
}
