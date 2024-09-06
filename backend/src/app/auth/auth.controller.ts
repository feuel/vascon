import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local/local.guard';
import { AuthService } from './auth.service';
import { Public, User } from '../../decorators';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Get('me')
  getMe(@User('_id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Post('/logout/all')
  @Public()
  logoutAll(@Body() logutDto: LogoutDto) {
    return this.authService.logout(logutDto);
  }
}
