import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryParamsDto } from '../../../dto';

export class GetProductQueryDto extends PaginationQueryParamsDto {
  @IsOptional()
  @IsString()
  seller?: string;
}
