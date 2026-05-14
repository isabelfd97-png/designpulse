import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // REQUIRED for BullMQ — do not remove
  enableReadyCheck: false,
  enableOfflineQueue: false,
  lazyConnect: true,
});

redis.on('error', (err: Error) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Redis] Connected');
  }
});
