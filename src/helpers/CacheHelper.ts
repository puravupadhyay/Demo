import { json } from "stream/consumers";

const memoryCache = require("./../cache/MemoryCache");
const redis = require('redis');

// TODO: Move into a file
let redisClient;

(async () => {

    if (process.env.USE_REDIS === 'true') {
        if (process.env.REDIS_URL) {
            console.log("Connecting to Redis ...")
            redisClient = redis.createClient({
              url: process.env.REDIS_URL
            });
          } else {
            console.log("Using local Redis ...")
            redisClient = redis.createClient();
          }
        
          await redisClient.connect();
    }

})();

async function getCache(key: string) {
    if (process.env.USE_REDIS === 'true') {
        var cache = await redisClient.get(key);
        return JSON.parse(cache);
    } else {
        return memoryCache.get(key);
    }
}

async function setCache(key: string, value: string, expiry: number) {
    if (process.env.USE_REDIS === 'true') {
        console.log(JSON.stringify(value));
        await redisClient.set(key, JSON.stringify(value), {
            EX: expiry,
            NX: true
        });
    } else {
        memoryCache.set(key, value, expiry)
    }
}

async function hasCache(key: string) {
    if (process.env.USE_REDIS === 'true') {
        return await redisClient.exists(key) ? true : false;
    }
    else {
        console.log(memoryCache.get(key))
        return memoryCache.has(key);
    }
}

async function disconnectCache() {

    await redisClient.disconnect();
}

async function flushCacheDb() {

    await redisClient.flushDb();
}

module.exports = { getCache, setCache, hasCache, disconnectCache, flushCacheDb }