import moment from "moment";
import NodeCache from "node-cache";

export function initNodeCache() {
    const memoryCache = new NodeCache();
    return {
        get: function (key: string | number) { return JSON.parse(memoryCache.get(key)) },
        set: function (key: string | number, val: any) { memoryCache.set(key, JSON.stringify(val)) },
        has: function (key: string): boolean { return memoryCache.has(key) },
        expired: async function (key: string) {
            if (!memoryCache.has(key))
                return true;
            const value = JSON.parse(await memoryCache.get(key));
            return value?.expiryDateTime ? moment(value.expiryDateTime).isBefore(moment.now()) : true;
        },
        flush: function () { memoryCache.flushAll()}
    }
}