const redis = require('redis');
import { createClient } from 'redis';

let redisClient;

(async () => {
    console.log("Connecting to Redis ...")
    const host = 'demorediscache-ar105k.serverless.euw1.cache.amazonaws.com';
    const port = 6379;
    redisClient = redis.createClient({ host, port });

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    redisClient.on("connect", () => console.info('Connected to ElastiCache Redis'));

    await redisClient.connect();
})();

module.exports = function () {
    return {
        get: async function (key: string) {
            return await redisClient.get(key);
        },
        set: async function (key: string, value: string, expiry: number) {
            await redisClient.set(key, value, {
                EX: expiry,
                NX: true
            });
        },
        disconnect: async function(){
            await redisClient.disconnect();
        } 
    };
}();
