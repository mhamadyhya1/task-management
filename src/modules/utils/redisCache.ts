import Redis from 'ioredis';
import config from '../../config/config';

export const redisClient = new Redis({
  host: config.redis.url,
  port: config.redis.port,
});