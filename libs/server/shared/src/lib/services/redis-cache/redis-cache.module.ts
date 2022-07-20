import { CacheModule, CacheStoreFactory, Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';
const port = process.env.REDIS_PORT || 6379;

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore as CacheStoreFactory,
      host: process.env.REDIS_HOST,
      port: +port,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService] // This is IMPORTANT,  you need to export RedisCacheService here so that other modules can use it
})
export class RedisCacheModule {}