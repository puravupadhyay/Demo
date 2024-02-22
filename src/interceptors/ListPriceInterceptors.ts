import axios from "axios";
import { ACCESS_TOKEN_CACHE_KEY, } from "../constnats";
import { cacheResponse, refreshCache } from "../cache/CacheHelper";
import { validateData } from "../validators/ListPriceValidator";
const { refreshAccessToken } = require("../auth/AuthHelper");
const cache = require("../cache/Cache");

const axiosListPricesInstance = axios.create();

axiosListPricesInstance.interceptors.request.use(
    async config => {
        console.log("Executing List Price Request Interceptor");
        var tokenExists = await cache.has(ACCESS_TOKEN_CACHE_KEY);
        if (!tokenExists) {
            await refreshAccessToken();
        }
        const keys = await cache.get(ACCESS_TOKEN_CACHE_KEY);
        config.headers["Authorization"] = `Bearer ${keys.access_token}`;
        config.headers["Accept"] = "*/*";
        return config;
    },
    error => {
        Promise.reject(error)
    });

axiosListPricesInstance.interceptors.response.use(
    async response => {
        console.log("Executing List Price Response Interceptor");
        console.log("Url: " + response.config.url);
        console.log("Received a response status of " + response.status);

        validateData(response.data);

        await cacheResponse(response.data);

        return response;
    },
    async error => {
        console.log("Url: " + error.config.url);
        console.log("Received a response status of " + error.response.status + " with response: " + JSON.stringify(error.response.data));
        await refreshCache();
    });

module.exports = { axiosListPricesInstance };