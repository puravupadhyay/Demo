import { initRedisCache } from "./tech/RedisCache";
import { initNodeCache } from "./tech/NodeCache";

module.exports = function () {
    return process.env.USE_REDIS === 'true' ? initRedisCache() : initNodeCache();
}();