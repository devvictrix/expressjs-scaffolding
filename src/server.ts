import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { initializeProcessListeners } from '@/core/process/handler';

try {
    const server = app.listen(env.PORT, () => {
        logger.info(`✅ Server is running on ${env.APP_URL}`);
    });

    // Initialize the process listeners and pass the server instance to them
    initializeProcessListeners(server);
} catch (error) {
    logger.fatal(error, '❌ Failed to start server');
    process.exit(1);
}