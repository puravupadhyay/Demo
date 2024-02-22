import { LIST_PRICE_CACHE_KEY } from "../constnats";

const expiryTime = require("../datetime/ExpiryTimeHelper");
const cache = require("../cache/Cache");

export async function updateCacheExpiry(data?: any) {
    if (await cache.has(LIST_PRICE_CACHE_KEY)) {
        console.log("Retaining the existing cached value.");
        const existingCache = await cache.get(LIST_PRICE_CACHE_KEY);
        existingCache.expiryDateTime = expiryTime.date(); // set new expiry        
        await cache.set(LIST_PRICE_CACHE_KEY, existingCache);
        console.log(`Cache will expire on: ${existingCache.expiryDateTime} or in ${existingCache.expiryDateTime} seconds.`);
    } else {
        console.log("Existing cache does not exist.");
        setNewCache(data);
    }
}

export async function setNewCache(data: any) {
    console.log("Setting a new cache from the response");
    const expiryDateTime = expiryTime.date(); // set new expiry
    data.expiryDateTime = expiryDateTime;
    await cache.set(LIST_PRICE_CACHE_KEY, data);
    console.log(`Cache will expire on: ${expiryDateTime} or in ${expiryDateTime} seconds.`);
}