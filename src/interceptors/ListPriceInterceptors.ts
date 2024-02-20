import axios from "axios";
import { ACCESS_TOKEN_CACHE_KEY, LIST_PRICE_CACHE_KEY, } from "../constnats";
const { refreshAccessToken } = require("../helpers/AuthHelper");
const expiryTime = require("../helpers/ExpiryTimeHelper");
const {getCache, setCache, hasCache, flushCacheDb} = require("./../helpers/CacheHelper");

const axiosListPricesInstance = axios.create();

axiosListPricesInstance.interceptors.request.use(
    async config => {
        console.log("Executing List Price Request Interceptor");
        var tokenExists = await hasCache(ACCESS_TOKEN_CACHE_KEY);
        if (!tokenExists) {
            await refreshAccessToken();
        }
        const keys = await getCache(ACCESS_TOKEN_CACHE_KEY);
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
        // console.log(response.status)
        // console.log(response.data)
        // TODO: what to do if data.data is empty?
        console.log(`Cache will expire on: ${expiryTime.date()} or in ${expiryTime.seconds()} seconds.`)
        await setCache(LIST_PRICE_CACHE_KEY, response.data, expiryTime.seconds());
        return response;
    },
    error => {
        Promise.reject(error)
    });

module.exports = { axiosListPricesInstance }

