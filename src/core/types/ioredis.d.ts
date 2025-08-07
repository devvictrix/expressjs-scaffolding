// File: src/core/types/ioredis.d.ts
// This is a manual type declaration file to stub the ioredis module.
// It allows the project to compile without needing `ioredis` in node_modules.

declare module 'ioredis' {
    class Redis {
        constructor(options?: any);

        public status: string;

        public on(event: string, callback: (...args: any[]) => void): this;
        public get(key: string): Promise<string | null>;
        public set(key: string, value: string, mode?: string, duration?: number): Promise<void>;
        public quit(): Promise<'OK'>;
        public connect(): Promise<void>;
    }

    export default Redis;
}