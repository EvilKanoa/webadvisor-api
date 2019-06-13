const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const rpMiddleware = require('./middleware/request-promise');
const cors = require('cors');

const courses = require('./controllers/courses');
const welcome = require('./controllers/welcome');

const app = express();

process.on('unhandledRejection', err => console.error('Uncaught error', err));

// connect to database cache
mongoose.promise = Promise;
mongoose
  .connect(config.mongodb, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`Connected to database at ${config.mongodb}.`);
  })
  .catch(err => {
    console.error(`Error while connecting to database at ${config.mongodb}.`);
    console.error(err);
  });

// add middleware
const corsMiddleware = cors({
  origin: true,
  credentials: true,
});
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(rpMiddleware({ jar: true, followAllRedirects: true }));
app.options('*', corsMiddleware);

// add controllers
welcome(app);
courses(app);

// all done
app.listen(config.port, () => console.log(`Listening on port ${config.port}.`));
