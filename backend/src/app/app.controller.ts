import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { CreditUserDto } from './users/dto';
import { Roles, User } from '../decorators';
import { RolesGuard } from '../guards';
import { RolesEnum } from '../types';
import { PurchaseProductsDto } from './products/dto';

@Controller()
@UseGuards(RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/deposit')
  @Roles(RolesEnum.Buyer)
  @HttpCode(200)
  deposit(@User('_id') userId: string, @Body() creditUserDto: CreditUserDto) {
    return this.appService.creditUser(userId, creditUserDto);
  }

  @Post('/reset')
  @HttpCode(200)
  clearDeposit(@User('_id') userId: string) {
    return this.appService.clearDeposit(userId);
  }

  @Post('/buy')
  @Roles(RolesEnum.Buyer)
  @HttpCode(200)
  async purchaseProducts(
    @User('_id') userId: string,
    @Body() purchaseProductDto: PurchaseProductsDto
  ) {
    return this.appService.purchaseProducts(userId, purchaseProductDto);
  }
}
