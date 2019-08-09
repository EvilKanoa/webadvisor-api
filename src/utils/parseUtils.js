const promisify = xray =>
  new Promise((resolve, reject) => xray.then(resolve).catch(reject));

module.exports = { promisify };
