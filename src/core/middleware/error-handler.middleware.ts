import { Request, Response, NextFunction } from 'express';
import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { ApiError } from '@/core/errors/api.error';
import { ZodError } from 'zod';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { NodeEnv } from '@/config/constants';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);

    if (err instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            code: StatusCodes.BAD_REQUEST.toString(),
            message: getReasonPhrase(StatusCodes.BAD_REQUEST),
            data: err.flatten().fieldErrors,
        });
    }

    if (err instanceof ApiError) {
        const responseBody = err.toApiResponse();
        return res.status(err.httpStatus).json(responseBody);
    }

    const errorData = (env.NODE_ENV !== NodeEnv.Production) ? { name: err.name, stack: err.stack } : undefined;
    const unexpectedError = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        { data: errorData }
    );

    res.status(unexpectedError.httpStatus).json(unexpectedError.toApiResponse());
};