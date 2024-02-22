import express from 'express';
import { LIST_PRICE_CACHE_KEY } from './constnats';
const cache = require("./cache/Cache");
const expiryTime = require("./helpers/ExpiryTimeHelper");
const { axiosListPricesInstance } = require("./interceptors/ListPriceInterceptors");

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  return res.status(200).json("Welcome");
});

app.get('/list_price', async (req, res) => {
  try {
    var cacheExists = await cache.has(LIST_PRICE_CACHE_KEY);
    if (!cacheExists) {
      const url = "https://fleetacceptance.appiancloud.com/suite/webapi/fleet-prices?priceType=DE-EV&date=2024-02-05&origin=Cardex";
      //var startDate = expiryTime.startDate();
      //const url = `${LIST_PRICE_ENDPOINT}?priceType=${LIST_PRICE_PRICE_TYPE_DE}&date=${startDate}&origin=${LIST_PRICE_ORIGION}`;
      await axiosListPricesInstance.get(url);
    }
    const listPriceData = await cache.get(LIST_PRICE_CACHE_KEY);
    return res.status(200).json(listPriceData);
  }
  catch (error) {
    console.error(error);
    return res.sendStatus(500).json(error);
  }
});

// app.get('/set', async (req, res) => {
//   try {
//     await cacheService.set(String(req.query.key), req.query.value, Number(req.query.ttl))
//     return res.status(200).json("Set!");
//   } catch ({ err }) {
//     console.error(err);
//     return res.sendStatus(500).json(err);
//   }
// });

// app.get('/get', async (req, res) => {
//   try {
//     const result = await cacheService.get(String(req.query.key))
//     return res.status(200).json(result);
//   } catch ({ err }) {
//     console.error(err);
//     return res.sendStatus(500).json(err);
//   }
// });

// app.get('/has', async (req, res) => {
//   try {
//     const result = await cacheService.has(String(req.query.key));
//     return res.status(200).json(result);
//   } catch ({ err }) {
//     console.error(err);
//     return res.sendStatus(500).json(err);
//   }
// });

// app.get('/flush', async (req, res) => {
//   try {
//     await cacheService.flush();
//     return res.status(200).json("Flushed!");
//   } catch ({ err }) {
//     console.error(err);
//     return res.sendStatus(500).json(err);
//   }
// });

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

