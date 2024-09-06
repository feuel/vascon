import { Type } from 'class-transformer';
import { CoinDto } from '../../../dto';
import { ArrayUnique, ValidateNested } from 'class-validator';

export class CreditUserDto {
  @ValidateNested({ each: true })
  @ArrayUnique((item) => item.coin)
  @Type(() => CoinDto)
  coins: CoinDto[];
}
