import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, GetProductQueryDto, UpdateProductDto } from './dto';
import { Public, Roles, User } from '../../decorators';
import { RolesEnum } from '../../types';
import { RolesGuard } from '../../guards';

const ProductIdKey = 'user_id'; // To use for product id parameter
const GetProductPath = (path?: string) =>
  `:${ProductIdKey}${path ? `${path}` : ''}`;

@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles(RolesEnum.Seller)
  async createProduct(
    @User('_id') userId: string,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.createProduct(userId, createProductDto);
  }

  @Public()
  @Get()
  async getProducts(@Query(ValidationPipe) queryDto: GetProductQueryDto) {
    return this.productsService.getProducts(queryDto);
  }

  @Patch(GetProductPath())
  @Roles(RolesEnum.Seller)
  async updateProduct(
    @User('_id') userId: string,
    @Param(ProductIdKey) productId: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.updateProduct(
      userId,
      productId,
      updateProductDto
    );
  }

  @Get(GetProductPath())
  @Public()
  async getProduct(@Param(ProductIdKey) productId: string) {
    return this.productsService.getProductById(productId);
  }
}
