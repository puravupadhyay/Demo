import NodeCache from "node-cache";

export function initNodeCache(){
    const memoryCache = new NodeCache();
    return {
        get: function (key: string | number) { return memoryCache.get(key) },
        set: function (key: string | number, val: any, expiry: string) { memoryCache.set(key, val, expiry) },
        has: function (key: string): boolean { return memoryCache.has(key) }
    }
}