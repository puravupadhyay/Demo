import NodeCache from "node-cache";
module.exports = function () {
    const memoryCache = new NodeCache();
    return {
        get: function (key: string | number) { return memoryCache.get(key); },
        set: function (key: string | number, val: any, ttl: string) { memoryCache.set(key, val, ttl) },
        has: function (key: string): boolean { return memoryCache.has(key) }
    }
}();