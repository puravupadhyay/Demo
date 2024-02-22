import moment from "moment";
const redis = require('redis');

export function initRedisCache() {
    const redisClient = process.env.REDIS_URL
        ? redis.createClient({ url: process.env.REDIS_URL })
        : redis.createClient();

    redisClient.connect();
    return {
        get: async function (key: string | number) { return JSON.parse(await redisClient.get(key)) },
        set: async function (key: string | number, value: any, ttl: number) { await redisClient.set(key, JSON.stringify(value), { EX: ttl, NX: false }); },
        has: async function (key: string) { return await redisClient.exists(key) ? true : false },
        expired: async function (key: string) {
            const value = JSON.parse(await redisClient.get(key));
            return value?.expiryDateTime ? moment(value.expiryDateTime).isBefore(moment.now()) : true;
        },
        flush: async function () { await redisClient.flushDb(); }
    }
}