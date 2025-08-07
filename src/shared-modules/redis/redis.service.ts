// File: src/shared-modules/redis/redis.service.ts

import Redis from 'ioredis';
import { env } from '@/config/env';
import { logger } from '@/config/logger';

export class RedisService {
    private client: Redis;

    constructor() {
        if (!env.REDIS_ENABLED) {
            throw new Error("RedisService should not be instantiated if Redis is not enabled.");
        }

        this.client = new Redis({
            host: env.REDIS_HOST!,
            port: env.REDIS_PORT!,
            password: env.REDIS_PASSWORD,
            lazyConnect: true,
        });

        this.client.on('connect', () => {
            logger.info('Successfully connected to Redis');
        });

        this.client.on('error', (error: Error) => {
            logger.error(error, 'Redis connection error');
        });
    }

    async connect() {
        if (this.client.status === 'end') {
            await this.client.connect();
        }
    }

    async get(key: string): Promise<string | null> {
        await this.connect();
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        await this.connect();
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async disconnect(): Promise<void> {
        if (this.client.status === 'ready') {
            await this.client.quit();
        }
    }
}

export const redisService = new RedisService();