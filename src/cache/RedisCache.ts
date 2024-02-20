const Redis = require('ioredis');


let redisClient;

(async () => {

    console.log("Connecting to Redis ...")

    //localhost
    //redis.createClient()

    // redisClient = redis.createClient({
    //     host: "myrediscluster.ar105k.ng.0001.euw1.cache.amazonaws.com",
    //     // host: "myredisserverless-ar105k.serverless.euw1.cache.amazonaws.com",
    //     port: "6379"
    // });

    redisClient = new Redis({
        port: 6379,           // Redis port
        host: "myrediscluster.ar105k.ng.0001.euw1.cache.amazonaws.com"
    });
})();

module.exports = { redisClient }

// module.exports = function () {
//     return {
//         get: async function (key: string) {
//             return await redisClient.get(key);
//         },
//         set: async function (key: string, value: string, expiry: number) {
//             await redisClient.set(key, value, {
//                 EX: expiry,
//                 NX: true
//             });
//         },
//         disconnect: async function(){
//             await redisClient.disconnect();
//         }
//     };
// };