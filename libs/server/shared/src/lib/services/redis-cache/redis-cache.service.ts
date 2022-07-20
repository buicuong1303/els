import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async get(key: string) {
    await this.cache.get(key);
  }

  async set(key: string, value: string, ttl = 0) {
    await this.cache.set(key, value, { ttl: ttl });
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
