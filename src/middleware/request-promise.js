const rp = require('request-promise-native');

module.exports = defaults => (req, res, next) => {
  if (!req.rp) {
    req.rp = rp.defaults(defaults);
  }
  return next();
};
