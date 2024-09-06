import { useMemo } from 'react';
import { UserCoinInterface } from '../types';
import { Coin } from './coin';

export function UserCoins({
  coins,
  hideLabel = false,
}: {
  coins: UserCoinInterface[];
  hideLabel?: boolean;
}) {
  const sortedCoins = useMemo(
    () => coins.sort((a, b) => b.coin - a.coin),
    [coins]
  );
  return (
    <div className="flex gap-x-2">
      {sortedCoins.map((coin) => (
        <div className="flex flex-col items-center gap-2">
          <Coin amount={coin.coin} />
          <span className="flex items-center justify-center rounded-full text-[13px] border h-[25px] px-2 text-gray-500">
            <span className="text-gray-800 font-medium">{coin.quantity}</span>
            {!hideLabel && (
              <span>&nbsp;piece{coin.quantity > 1 ? 's' : ''}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
