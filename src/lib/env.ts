import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid postgres:// URL')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      'DATABASE_URL must be a PostgreSQL connection string'
    ),

  // Redis
  REDIS_URL: z
    .string()
    .url('REDIS_URL must be a valid redis:// URL')
    .refine(
      (url) => url.startsWith('redis://'),
      'REDIS_URL must be a Redis connection string'
    ),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Anthropic API (optional for Phase 1)
  ANTHROPIC_API_KEY: z.string().optional(),
});

// Validate on import — fail fast if required vars are missing
export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
