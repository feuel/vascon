import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironmentVariables } from '../utils';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_URI } from '../constants';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
      cache: true,
      validate: validateEnvironmentVariables,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow(DATABASE_CONNECTION_URI),
        retryAttempts: 0,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    RedisModule,
    UsersModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
