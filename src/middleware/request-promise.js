const rp = require('request-promise-native');

module.exports = getDefaults => (req, res, next) => {
  if (!req.rp) {
    req.rp = rp.defaults(getDefaults(req));
  }
  return next();
};
