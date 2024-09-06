import { IsIn, Min } from 'class-validator';
import { VendingMachineAcceptableCoins } from '../constants';

export class CoinDto {
  @IsIn(VendingMachineAcceptableCoins)
  coin: number;

  @Min(1)
  quantity: number;
}
