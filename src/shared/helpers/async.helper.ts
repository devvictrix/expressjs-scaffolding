// src/shared/helpers/async.helper.ts

/**
 * Splits an array into chunks of specified maximum size.
 * @param data The array to split.
 * @param maxBatchSize The maximum size of each chunk.
 * @returns An array of arrays, each of size at most maxBatchSize.
 */
export function createBatches<T>(data: T[], maxBatchSize: number): T[][] {
    if (!Array.isArray(data)) {
        throw new TypeError('Expected an array to split into batches');
    }
    if (maxBatchSize <= 0) {
        throw new RangeError('maxBatchSize must be greater than zero');
    }

    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += maxBatchSize) {
        batches.push(data.slice(i, i + maxBatchSize));
    }
    return batches;
}

/**
 * Processes an array of functions that return promises in batches.
 * You can configure the concurrent batch size, a delay between batches, and retry logic.
 * 
 * @param promises An array of functions that return a Promise.
 * @param batchSize The number of functions to process concurrently in each batch (default is 10).
 * @param delay The delay in milliseconds to wait between batches (default is 0).
 * @param maxAttempts The maximum number of retry attempts for each function (0 means no retries, default is 0).
 * @param baseDelay The initial delay in milliseconds for retry attempts (default is 500).
 * @param expFactor The exponential factor to increase the delay between retries (default is 2).
 * @returns A Promise that resolves with an array of results (or errors if a function ultimately fails).
 */
export async function processInBatches<R>(promises: (() => Promise<R>)[], batchSize = 10, delay = 0, maxAttempts = 0, baseDelay = 500, expFactor = 2): Promise<R[]> {
    let results: R[] = [];

    for (let i = 0; i < promises.length; i += batchSize) {
        const batch = promises.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(
            batch.map(p => retry(p, maxAttempts, baseDelay, expFactor))
        );
        results.push(...batchResults.map(result => result.status === 'fulfilled' ? result.value : result.reason));
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(promises.length / batchSize)}`);

        if (delay > 0 && i + batchSize < promises.length) {
            console.log(`Waiting for ${delay} milliseconds before processing the next batch...`);
            await sleep(delay);
        }
    }
    return results;
}

/**
 * Retries a function that returns a promise a specified number of times using exponential backoff.
 * 
 * @param fn The function to retry.
 * @param maxAttempts The maximum number of retry attempts (0 means no retries).
 * @param baseDelay The initial delay in milliseconds for the first retry.
 * @param expFactor The exponential factor to multiply the delay for subsequent retries.
 * @returns A Promise that resolves with the function's result or rejects if all attempts fail.
 */
export async function retry<T>(fn: () => Promise<T>, maxAttempts: number, baseDelay: number, expFactor: number): Promise<T> {
    if (maxAttempts === 0) {
        return fn();
    }
    let attempts = 0;
    while (true) {
        try {
            return await fn();
        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                console.error(`All ${maxAttempts} attempts failed:`, error);
                throw error;
            }
            const delay = baseDelay * Math.pow(expFactor, attempts - 1);
            console.log(`Retrying in ${delay} ms... (${attempts}/${maxAttempts})`);
            await sleep(delay);
        }
    }
}

/**
 * Returns a Promise that resolves after a specified delay.
 * 
 * @param ms The delay in milliseconds.
 * @returns A Promise that resolves after the delay.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
