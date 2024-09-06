import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';
import { AuthenticationJwtStrategy } from './authentication-jwt/authentication-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationJwtGuard } from './authentication-jwt/authentication-jwt.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RedisModule, JwtModule, UsersModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AuthenticationJwtStrategy,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationJwtGuard,
    },
  ],
})
export class AuthModule {}
