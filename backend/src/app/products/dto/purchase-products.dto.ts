import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PurchaseProductsDto {
  @ValidateNested({ each: true })
  @ArrayUnique((item) => item.product_id)
  @Type(() => PurchaseItemDto)
  products: PurchaseItemDto[];
}

class PurchaseItemDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  quantity: number;
}
