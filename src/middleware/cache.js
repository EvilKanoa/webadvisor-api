const redis = require('redis');
const config = require('../config');
const { promisify } = require('util');

const prefix = 'webadvisor-api_express';
const client = redis.createClient(config.redis, { prefix });
client.on('error', err => {
  console.error(`Redis error occurred from ${config.redis}.`);
  console.error(err);
});
client.on('ready', () => {
  console.log(`Connected to cache at ${config.redis}.`);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

module.exports = {
  cache: (timeout, contentType = 'text/plain', headers = []) => async (
    req,
    res,
    next,
  ) => {
    const key = req.originalUrl || req.url;
    const cached = await get(key);

    req.cache = async data => {
      timeout ? set(key, data, 'EX', timeout) : set(key, data);
    };

    if (cached) {
      res.set('Content-Type', contentType);
      headers.forEach(header => {
        res.set(header[0], header[1]);
      });
      res.statusCode = 200;
      res.send(cached);
    } else {
      res.ogSend = res.send;
      res.send = body => {
        req.cache(body);
        res.ogSend(body);
      };

      return next();
    }
  },
  set: async (key, body, timeout) =>
    timeout ? await set(key, body, 'EX', timeout) : await set(key, data),
  get: async key => await get(key),
};
