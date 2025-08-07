// File: src/shared-modules/redis/index.ts

import { env } from '@/config/env';
import { logger } from '@/config/logger';
// FIX: Correctly import the 'RedisService' class as a type
import type { RedisService } from './redis.service';

let redisServiceInstance: RedisService | null = null;

if (env.REDIS_ENABLED) {
    try {
        const redisModule = require('./redis.service');
        redisServiceInstance = redisModule.redisService;
    } catch (error) {
        if ((error as any).code === 'MODULE_NOT_FOUND') {
            logger.warn('Redis is enabled in the .env file, but the `ioredis` package is not installed. Please run "npm install -D ioredis" to use Redis.');
        } else {
            logger.error(error, 'Failed to initialize Redis service.');
        }
    }
}

export const redisService = redisServiceInstance;