import pino from 'pino';
import { env } from '@/config/env';
import { NodeEnv } from './constants';

const pinoConfig = {
    level: env.NODE_ENV === NodeEnv.Production ? 'info' : 'debug',
    transport: env.NODE_ENV === NodeEnv.Development ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        },
    } : undefined,
};

if (env.NODE_ENV === NodeEnv.Test) {
    pinoConfig.level = 'silent';
}

export const logger = pino(pinoConfig);