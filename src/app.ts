import express from 'express';
import { LIST_PRICE_CACHE_KEY } from './constnats';
const {getCache, setCache, hasCache, flushCacheDb} = require("./helpers/CacheHelper");
const expiryTime = require("./helpers/ExpiryTimeHelper");
const { axiosListPricesInstance } = require("./interceptors/ListPriceInterceptors");

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  return res.status(200).json("Welcome");
});

app.get('/list_price', async (req, res) => {
  try {
    var cacheExists = await hasCache(LIST_PRICE_CACHE_KEY);
    console.log(cacheExists)
    if (!cacheExists) {
      const url = "https://fleetacceptance.appiancloud.com/suite/webapi/fleet-prices?priceType=DE-EV&date=2024-02-05&origin=Cardex";
      //var startDate = expiryTime.startDate();
      //const url = `${LIST_PRICE_ENDPOINT}?priceType=${LIST_PRICE_PRICE_TYPE_DE}&date=${startDate}&origin=${LIST_PRICE_ORIGION}`;
      await axiosListPricesInstance.get(url);
    }
    const listPriceData = await getCache(LIST_PRICE_CACHE_KEY);
    return res.status(200).json(listPriceData);
    // return res.status(200).json("Done");
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.get('/redis_cache_set', async (req, res) => {
  try {
    await setCache('AKey', 'A Value', 100)
    return res.status(200).json("Set!");
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.get('/redis_cache_get', async (req, res) => {
  try {
    const result = await getCache('AKey')
    return res.status(200).json(result);
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.get('/redis_cache_has', async (req, res) => {
  try {
    const result = await hasCache('AKey');
    return res.status(200).json(result);
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.get('/redis_cache_flush', async (req, res) => {
  try {
    await flushCacheDb();
    return res.status(200).json("Flushed!");
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

