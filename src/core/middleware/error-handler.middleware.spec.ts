import { getMockReq, getMockRes } from '@jest-mock/express';
import { errorHandler } from './error-handler.middleware';
import { ApiError } from '../errors/api.error';
import { ZodError, ZodIssueCode } from 'zod';
import { Request, Response, NextFunction } from 'express';

jest.mock('@/config/env', () => ({
    env: {
        NODE_ENV: 'test', // Provide the necessary environment variables for the middleware
    },
}));

const { res: mockRes, next: mockNext, mockClear } = getMockRes();

describe('Error Handler Middleware', () => {
    beforeEach(() => {
        mockClear();
    });

    it('should handle ZodError and return a 400 Bad Request', () => {
        const zodError = new ZodError([/* ... */]);
        // --- THE FIX IS HERE: Use a two-step assertion via 'unknown' ---
        errorHandler(zodError, getMockReq() as unknown as Request, mockRes as unknown as Response, mockNext as NextFunction);
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should handle ApiError and return the specified status code', () => {
        const apiError = new ApiError(404, { message: 'Resource not found' });
        errorHandler(apiError, getMockReq() as unknown as Request, mockRes as unknown as Response, mockNext as NextFunction);
        expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should handle a generic Error and return a 500 Internal Server Error', () => {
        const genericError = new Error('Something unexpected happened');
        errorHandler(genericError, getMockReq() as unknown as Request, mockRes as unknown as Response, mockNext as NextFunction);
        expect(mockRes.status).toHaveBeenCalledWith(500);
    });
});