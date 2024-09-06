import { VendingMachineAcceptableCoins } from '../constants';
import { CoinDto } from '../dto';
import { createRecordFromSet } from './array.util';

export function evaluateBalanceForDebit(coins: CoinDto[], debitAmount: number) {
  const record = createRecordFromSet(coins, 'coin');
  let remainingAmount = debitAmount;

  VendingMachineAcceptableCoins.forEach((coin) => {
    const coinRef = record[coin];
    if (!coinRef) return;
    if (!coinRef.quantity) return delete record[coin];

    const amountAvailable = coin * coinRef.quantity;
    const amountToDebit = Math.min(
      remainingAmount,
      Math.floor(remainingAmount / coin) * coin,
      amountAvailable
    );
    const coinQuantityToDebit = amountToDebit / coin;

    if (coinQuantityToDebit && coin <= amountToDebit) {
      remainingAmount -= amountToDebit;
      coinRef.quantity -= coinQuantityToDebit;
    }

    if (!coinRef.quantity) delete record[coin];
  });

  return {
    unpayable: remainingAmount,
    change: Object.values(record),
  };
}
