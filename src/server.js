const config = require('./config');
const app = require('express')();

process.on('unhandledRejection', err => console.error('Uncaught error', err));

// add middleware
app.use(require('./middleware/cors'));
app.use(require('body-parser').json());
app.use(require('./middleware/request-promise')({ jar: true, followAllRedirects: true }));
app.options('*', require('./middleware/cors'));

// add route handlers
require('./routes')(app);

// all done
app.listen(config.port, () => console.log(`Listening on port ${config.port}.`));

module.exports = app;
