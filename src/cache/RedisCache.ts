const redis = require('redis');

export function initRedisCache() {
    const redisClient = process.env.REDIS_URL
            ? redis.createClient({ url: process.env.REDIS_URL })
            : redis.createClient();

        redisClient.connect();
        return {
            get: async function (key: string | number) { return JSON.parse(await redisClient.get(key)) },
            set: async function (key: string | number, value: any, expiry: string) { await redisClient.set(key, value, { EX: expiry, NX: true }); },
            has: async function (key: string) { return await redisClient.exists(key) ? true : false }
        }
}