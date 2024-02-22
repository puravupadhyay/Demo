import { LIST_PRICE_CACHE_KEY } from "../constnats";
const expiryTime = require("../datetime/ExpiryTimeHelper");
const cache = require("../cache/Cache");

export async function cacheResponse(responseData?: any) {
    if (responseData.data && responseData.data.length === 0) {
        console.log("Data return 0 results.");
        await refreshCache();
    } else {
        await setNewCache(responseData);
    }
}

export async function refreshCache() {
    if (!await cache.has(LIST_PRICE_CACHE_KEY))
        throw new Error("Could not refresh the cache because it does not exist.");

    const existingCache = await cache.get(LIST_PRICE_CACHE_KEY);
    await setNewCache(existingCache);
}

export async function setNewCache(responseData: any) {
    const expiryDateTime = expiryTime.date(); // set new expiry
    responseData.expiryDateTime = expiryDateTime;
    await cache.set(LIST_PRICE_CACHE_KEY, responseData);
    console.log(`Cache will expire on: ${expiryDateTime}`);
}