import { Server } from 'http';
import { prisma } from '@/config';
import { env } from '@/config/env';
import { logger } from '@/config/logger';

// A flag to prevent multiple shutdown attempts
let isShuttingDown = false;

/**
 * A centralized function to handle all server shutdowns gracefully.
 * It includes a configurable timeout to force-exit if the server hangs.
 * @param server - The HTTP server instance to close.
 * @param reason - The reason for the shutdown (e.g., signal or error type).
 * @param error - The error object, if the shutdown was caused by an error.
 */
const shutdown = async (server: Server, reason: string, error?: Error) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.warn(`Shutting down server: ${reason}`);
    if (error) {
        logger.fatal(error, 'Fatal error caused shutdown');
    }

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Shutdown timed out after ${env.SHUTDOWN_TIMEOUT}ms. Forcing exit.`));
        }, env.SHUTDOWN_TIMEOUT);
    });

    const serverClosePromise = new Promise<void>(resolve => {
        server.close(() => {
            logger.info('HTTP server closed.');
            resolve();
        });
    });

    try {
        await Promise.race([serverClosePromise, timeoutPromise]);
    } catch (shutdownError) {
        logger.error(shutdownError);
    } finally {
        try {
            await prisma.$disconnect();
            logger.info('Prisma client disconnected.');
        } catch (dbError) {
            logger.error(dbError, 'Failed to disconnect Prisma client.');
        }

        process.exit(error ? 1 : 0);
    }
};

/**
 * Initializes all process-level event listeners.
 * @param server - The HTTP server instance.
 */
export const initializeProcessListeners = (server: Server) => {
    process.on('SIGTERM', () => shutdown(server, 'Received SIGTERM'));
    process.on('SIGINT', () => shutdown(server, 'Received SIGINT'));

    process.on('unhandledRejection', (reason: Error) => {
        shutdown(server, 'Unhandled Rejection', reason);
    });

    process.on('uncaughtException', (error: Error) => {
        shutdown(server, 'Uncaught Exception', error);
    });

    logger.info('✅ Process event listeners initialized.');
};