import { RedisOptions } from 'ioredis';

const port = process.env.REDIS_PORT || 6379;
export const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: +port,
  password: process.env.REDIS_PASSWORD,
};

