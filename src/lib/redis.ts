import Redis from 'ioredis';

// Lazy singleton — only connect when first accessed
let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    _redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Required for BullMQ
      enableReadyCheck: false,
      enableOfflineQueue: false,
    });

    _redis.on('error', (err) => console.error('Redis error:', err));
  }
  return _redis;
}

// Named export for direct use where env is already validated
export const redis = getRedis;
