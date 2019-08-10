const xray = require('x-ray');

const filters = {
  trim: v => (typeof v === 'string' ? v.trim() : v),
  cleanSpaces: v => (typeof v === 'string' ? v.replace(/\s+/g, ' ') : v),
  removeNewlines: v => (typeof v === 'string' ? v.replace(/\n/g, '') : v),
};

const promisify = xray =>
  new Promise((resolve, reject) => xray.then(resolve).catch(reject));

const getXray = (config = {}) => xray({ filters, ...config });

module.exports = { promisify, filters, getXray };
