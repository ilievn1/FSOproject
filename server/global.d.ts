declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PROD_DATABASE_URL: string;
            DEV_DATABASE_URL: string;
            TEST_DATABASE_URL: string;
            REDIS_URL: string;
            SECRET: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string | number;
        }
    }
}

export { };