import { Module } from '@nestjs/common';
import IORedis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_HOST, REDIS_PORT } from '../../constants';

export const REDIS_CONNECTION = 'REDIS_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        return new IORedis({
          maxRetriesPerRequest: 0,
          host: configService.get(REDIS_HOST),
          port: configService.get(REDIS_PORT),
        });
      },
      inject: [ConfigService],
    },
    ConfigService,
  ],
  exports: [REDIS_CONNECTION],
})
export class RedisModule {}
