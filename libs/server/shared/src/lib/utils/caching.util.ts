import { BaseRedisCache } from 'apollo-server-cache-redis';

export const checkCache = async (
  redisClient: BaseRedisCache,
  key: string,
  callback: () => Promise<any>,
  maxAge: number | null = null
): Promise<any> => {
  const data = await redisClient.get(key);
  if (!data) {
    let newData = await callback();
    if (!newData) newData = null;
    redisClient.set(key, JSON.stringify(newData), { ttl: maxAge });
    return newData;
  } else {
    return JSON.parse(data);
  }
};
