import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreditUserDto } from './users/dto';
import { ProductsService } from './products/products.service';
import { PurchaseProductsDto } from './products/dto';

@Injectable()
export class AppService {
  constructor(
    private userService: UsersService,
    private productsService: ProductsService
  ) {}

  creditUser(userId: string, creditUserDto: CreditUserDto) {
    return this.userService.creditUser(userId, creditUserDto);
  }

  clearDeposit(userId: string) {
    return this.userService.clearDeposit(userId);
  }

  purchaseProducts(userId: string, purchaseProductDto: PurchaseProductsDto) {
    return this.productsService.purchaseProducts(userId, purchaseProductDto);
  }
}
