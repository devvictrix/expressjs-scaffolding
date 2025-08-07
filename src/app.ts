import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { setupSwagger } from '@/config/swagger';
import { errorHandler } from '@/core/middleware/error-handler.middleware';
import { apiLimiter } from '@/core/middleware/rate-limit.middleware';
import { prisma } from '@/config';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(apiLimiter);

const sanitizedPrefix = env.API_PREFIX.replace(/^\/|\/$/g, '');
const v1BasePath = `/${sanitizedPrefix}/v1`;

setupSwagger(app);
/**
 * A robust health check endpoint.
 * It checks not only if the server is running but also if it can connect
 * to critical dependencies like the database.
 */
app.get('/health', async (req, res) => {
    try {
        // Check database connectivity by running a simple, fast query.
        // $queryRaw`SELECT 1` is the standard way to ping a PostgreSQL database.
        await prisma.$queryRaw`SELECT 1`;

        res.status(StatusCodes.OK).json({
            status: 'ok',
            message: 'Server and database connections are healthy.',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        logger.error(error, 'Health check failed: Unable to connect to the database.');
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            status: 'error',
            message: 'Service is unhealthy. Database connection failed.',
        });
    }
});

app.use(errorHandler);

export default app;