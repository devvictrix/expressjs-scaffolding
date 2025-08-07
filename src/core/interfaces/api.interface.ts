/**
 * The definitive, standardized structure for all API responses.
 * @template T The type of the data payload, if any.
 */
export interface ApiResponse<T = any> {
    /**
     * The definitive business-specific success or error code.
     * This is the primary field for client-side programmatic logic.
     * Examples: '200', '201', '404.1', '500.0'.
     */
    code: string;

    /**
     * A human-readable message describing the outcome. Can be a success
     * message or an error message.
     */
    message: string;

    /**
     * The optional data payload.
     */
    data?: T;
}