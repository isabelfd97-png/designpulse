import { Queue } from 'bullmq';
import { redis } from './redis';

// Ingestion queue: Phase 2 RSS crawler jobs
export const ingestionQueue = new Queue('ingestion', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s initial, 10s, 20s
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});

ingestionQueue.on('error', (err: Error) => {
  console.error('[BullMQ] Queue error:', err.message);
});
