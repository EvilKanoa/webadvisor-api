const request = require('request');

const app = require('express')();

const errorHandler = err => console.error('Uncaught error', err);
process.on('unhandledRejection', errorHandler);
process.on('uncaughtException', errorHandler);

// add middleware
app.use(require('./middleware/errors')());
app.use(require('./middleware/cors'));
app.use(require('body-parser').json());
app.use(
  require('./middleware/request-promise')(() => ({
    jar: request.jar(),
    followAllRedirects: true,
  })),
);
app.options('*', require('./middleware/cors'));

// add route handlers
require('./routes')(app);

module.exports = app;
