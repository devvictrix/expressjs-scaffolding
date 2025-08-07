import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger-spec';
import { env } from './env';
import { logger } from './logger';

export function setupSwagger(app: Express) {
    const path = '/api-docs';

    app.use(path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get(`${path}.json`, (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    logger.info(`Swagger UI is available at ${env.APP_URL}${path}`);
    logger.info(`Swagger JSON is available at ${env.APP_URL}${path}.json`);
}