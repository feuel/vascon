import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_PER_PAGE = 10;

export class PaginationQueryParamsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page = DEFAULT_PAGE_INDEX;

  @IsNumber()
  @Type(() => Number)
  per_page = DEFAULT_PER_PAGE;
}
