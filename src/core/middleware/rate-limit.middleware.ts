
import { env } from '@/config/env';
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    headers: true,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});