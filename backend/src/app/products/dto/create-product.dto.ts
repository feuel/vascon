import { Type } from 'class-transformer';
import {
  IsDivisibleBy,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  amount_available: string;

  @IsNumber({}, { message: 'Enter a valid cost' })
  @IsPositive({ message: 'Enter a valid cost' })
  @IsDivisibleBy(5, { message: 'Cost must be a multiple of 5 unit coins' })
  @Type(() => Number)
  cost: number;
}
