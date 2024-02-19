import axios from "axios";
import { ACCESS_TOKEN_CACHE_KEY, LIST_PRICE_CACHE_KEY, } from "../constnats";
const { refreshAccessToken } = require("../helpers/AuthHelper");
const expiryTime = require("../helpers/ExpiryTimeHelper");
const memoryCache = require("../cache/MemoryCache");

const axiosListPricesInstance = axios.create();

axiosListPricesInstance.interceptors.request.use(
    async config => {
        console.log("Executing List Price Request Interceptor");
        
        if (!memoryCache.has(ACCESS_TOKEN_CACHE_KEY)) {
            await refreshAccessToken();
        }
        const keys = memoryCache.get(ACCESS_TOKEN_CACHE_KEY)
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
        // TODO: what to do if data.data is empty?
        console.log(`Cache will expire on: ${expiryTime.date()} or in ${expiryTime.seconds()} seconds.`)
        memoryCache.set(LIST_PRICE_CACHE_KEY, response.data, expiryTime.seconds());
        return response;
    },
    error => {
        Promise.reject(error)
    });

module.exports = { axiosListPricesInstance }

