import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Global, Module } from '@nestjs/common';
import { RedisOptions } from 'ioredis';


export const PUB_SUB = 'PUB_SUB';


const port = process.env.REDIS_PORT || 6379;
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: +port,
  password: process.env.REDIS_PASSWORD,
};
@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: new RedisPubSub({
        connection: redisOptions
      }),
    }
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
