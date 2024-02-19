import express from 'express';
import { LIST_PRICE_CACHE_KEY } from './constnats';
const memoryCache = require("./cache/MemoryCache");
const redisCache = require("./cache/RedisCache");

const { axiosListPricesInstance } = require("./interceptors/ListPriceInterceptors");
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  return res.status(200).json("Welcome");
});

app.get('/node_cache', async (req, res) => {
  try {
    if (!memoryCache.has(LIST_PRICE_CACHE_KEY)) {
      const url = "https://fleetacceptance.appiancloud.com/suite/webapi/fleet-prices?priceType=DE-EV&date=2024-02-05&origin=Cardex";
      //const url = `${LIST_PRICE_ENDPOINT}?priceType=${LIST_PRICE_PRICE_TYPE_DE}&date=${startDate}&origin=${LIST_PRICE_ORIGION}`;
      await axiosListPricesInstance.get(url);
    }
    const listPriceData = memoryCache.get(LIST_PRICE_CACHE_KEY);
    return res.status(200).json(listPriceData);
    // return res.status(200).json("Done");
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.get('/redis_cache', async (req, res) => {
  try {
    await redisCache.set('Key', 'Value', 20);
    const value = await redisCache.get('Key');
    redisCache.disconnect();
    return res.status(200).json(value);
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

