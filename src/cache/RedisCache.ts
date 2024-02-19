const redis = require('redis');
import { createClient } from 'redis';

let redisClient;

(async () => {

    console.log("Connecting to Redis ...")

    //localhost
    //redis.createClient()

    const redisURL = "redis://myrediscache-ar105k.serverless.euw1.cache.amazonaws.com:6379"
    redisClient = redis.createClient({
        url: redisURL
      });

      redisClient.on("error", function(error) {
        console.error(error);
        // I report it onto a logging service like Sentry. 
     });

    redisClient.on("connect", () => console.info('Connected to ElastiCache Redis'));

    await redisClient.connect();
});

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
};