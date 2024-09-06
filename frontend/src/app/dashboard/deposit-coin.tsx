'use client';
import { useMemo, useState } from 'react';

import { Button } from '../components/button';
import { FormStateErrors } from '../types';
import { Coin } from '../components/coin';
import { immutableUpdateItemInSet } from '../utils/array';
import { Trash2 } from 'react-feather';
import { depositCoins } from '../actions/deposit';

const Coins = [100, 50, 20, 10, 5].map((coin) => ({ coin, quantity: 0 }));

export function DepositCoin() {
  const [coins, setCoins] = useState(Coins);

  const [isDepositing, setIsDepositing] = useState(false);
  const [errors, setErrors] = useState<FormStateErrors<{ coins: any }> | null>({
    coins: undefined,
  });

  const total = useMemo(
    () => coins.reduce((acc, coin) => acc + coin.coin * coin.quantity, 0),
    [coins]
  );

  const onDeposit = async () => {
    setIsDepositing(true);
    setErrors({});
    const errors = await depositCoins(coins);
    setIsDepositing(false);
    setErrors(errors);
  };

  const onAdd = (coin: number) => {
    return (amount: number) => {
      setCoins(
        immutableUpdateItemInSet(
          coins,
          (item) => {
            item.quantity += amount;
            return item;
          },
          (item) => item.coin === coin
        )
      );
    };
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-xl font-medium">Deposit coin</h1>
        <p className="text-sm text-gray-600 font-light">Tap the coin to add</p>
      </div>
      <div>
        <div className="flex">
          <div className="flex gap-x-2 mx-auto">
            {coins.map(({ coin, quantity }) => (
              <CoinAddButton
                key={coin}
                onAdd={onAdd(coin)}
                coin={coin}
                quantity={quantity}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-28">
        <Button
          onClick={onDeposit}
          disabled={!total}
          loading={isDepositing}
          className="w-full"
        >
          Deposit {total ? `${total} coins` : ''}
        </Button>
      </div>
    </div>
  );
}

const CoinAddButton = ({
  coin,
  quantity,
  onAdd,
}: {
  coin: number;
  quantity: number;
  onAdd: (amount: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        onClick={() => onAdd(1)}
        role="button"
        tabIndex={0}
        className="cursor-pointer active:scale-95 transition-transform duration-100"
      >
        <Coin amount={coin} />
      </span>
      {quantity > 0 && (
        <span className="cursor-pointer group flex gap-x-2 items-center justify-center rounded-full text-[12px] border h-[25px] py-1 px-2 tabular-nums">
          {quantity}
          <span
            onClick={() => onAdd(-1 * quantity)}
            role="button"
            className="group-hover:inline-flex hidden text-red-600 hover:bg-red-50 p-1 rounded-full -mr-[6px]"
          >
            <Trash2 className="h-3 w-3" />
          </span>
        </span>
      )}
    </div>
  );
};
