const errors = require('../utils/errors');

module.exports = env => {
  const handler = errors(env).catchResolverErrors;
  const handlerSync = errors(env).catchResolverErrorsSync;

  return (req, res, next) => {
    req.catchResolverErrors = handler;
    req.catchResolverErrorsSync = handlerSync;
    return next();
  };
};
