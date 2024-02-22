import { initRedisCache } from "./RedisCache";
import { initNodeCache } from "./NodeCache";

module.exports = function () {
    return process.env.USE_REDIS === 'true' ? initRedisCache() : initNodeCache();
}();