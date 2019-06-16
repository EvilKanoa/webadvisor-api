const config = require('./config');
const app = require('./app');

// boot up the server!
app.listen(config.port, () => console.log(`Listening on port ${config.port}.`));

module.exports = app;
