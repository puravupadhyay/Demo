// const Redis = require('ioredis');
const redis = require('redis');


let redisClient;

(async () => {

    console.log("Connecting to Redis ...")

    //localhost
    // redisClient = redis.createClient()

    // AWS
    redisClient = redis.createClient({
        url: 'redis://myrediscluster.ar105k.ng.0001.euw1.cache.amazonaws.com:6379'
      });
    
    await redisClient.connect();
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