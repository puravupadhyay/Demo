import express from 'express';
import { LIST_PRICE_CACHE_KEY, LIST_PRICE_ENDPOINT, LIST_PRICE_ORIGION, LIST_PRICE_PRICE_TYPE_DE } from './constnats';
const cache = require("./cache/Cache");
const expiryTime = require("./datetime/ExpiryTimeHelper");
const { axiosListPricesInstance } = require("./interceptors/ListPriceInterceptors");

const app = express();
app.use(express.json());
const port = 3000;

// const startDate = expiryTime.startDate();
const startDate = '2024-02-05';
const priceType = LIST_PRICE_PRICE_TYPE_DE;
const origin = LIST_PRICE_ORIGION;

app.get('/', async (req, res) => {
  return res.status(200).json("Welcome");
});

app.get('/list_price', async (req, res) => {
  try {
    const cacheExists = await cache.has(LIST_PRICE_CACHE_KEY);
    const cacheExpired = await cache.expired(LIST_PRICE_CACHE_KEY);
    if (!cacheExists || cacheExpired) {
      const url = `${LIST_PRICE_ENDPOINT}?priceType=${priceType}&date=${startDate}&origin=${origin}`;
      await axiosListPricesInstance.get(url);
    }
    const listPriceData = await cache.get(LIST_PRICE_CACHE_KEY);
    return res.status(200).json(listPriceData);
  }
  catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }
});

app.post('/set', async (req, res) => {
  try {
    console.log(req.query.key)
    console.log(req.body)
    await cache.set(String(req.query.key), req.body)
    return res.status(200).json("Set!");
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.get('/get', async (req, res) => {
  try {
    if (cache.has(String(req.query.key))) {
      const result = await cache.get(String(req.query.key))
      return res.status(200).json(result);
    };
    return res.status(200).json(null);
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

// app.get('/has', async (req, res) => {
//   try {
//     const result = await cacheService.has(String(req.query.key));
//     return res.status(200).json(result);
//   } catch ({ err }) {
//     console.error(err);
//     return res.sendStatus(500).json(err);
//   }
// });

app.get('/flush', async (req, res) => {
  try {
    await cache.flush();
    return res.status(200).json("Flushed!");
  } catch ({ err }) {
    console.error(err);
    return res.sendStatus(500).json(err);
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

