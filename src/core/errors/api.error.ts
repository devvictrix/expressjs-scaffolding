import { getReasonPhrase } from 'http-status-codes';
import { ApiResponse } from '../interfaces/api.interface';

/**
 * An options object for the ApiError constructor for maximum flexibility.
 */
interface ApiErrorOptions {
    /** The business-specific error code. If not provided, it defaults to the httpStatus. */
    code?: string;
    /** The human-readable message. If not provided, it defaults to the standard HTTP reason phrase. */
    message?: string;
    /** Optional structured data about the error. */
    data?: any;
}

/**
 * The definitive, most flexible ApiError class. It provides intelligent fallbacks
 * for its properties, making it easy to use for both simple and complex errors.
 */
export class ApiError extends Error {
    public readonly httpStatus: number;
    public readonly code: string;
    public readonly data?: any;

    constructor(httpStatus: number, options: ApiErrorOptions = {}) {
        const finalMessage = options.message || getReasonPhrase(httpStatus);
        super(finalMessage);

        this.httpStatus = httpStatus;
        this.code = options.code || httpStatus.toString();
        this.data = options.data;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Creates the final ApiResponse object from this error's properties.
     */
    public toApiResponse(): ApiResponse {
        return {
            code: this.code,
            message: this.message,
            data: this.data,
        };
    }
}