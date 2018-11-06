const express = require('express');

const bodyParser = require('body-parser');
const rpMiddleware = require('./middleware/request-promise');
const cors = require('cors');

const courses = require('./controllers/courses');

const app = express();

process.on('unhandledRejection', (err) => console.error('Uncaught error', err));

// add middleware
const corsMiddleware = cors({
    origin: true,
    credentials: true
});
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(rpMiddleware({ jar: true, followAllRedirects: true }));
app.options('*', corsMiddleware);

// add controllers
app.get('/', (req, res, next) => {
    res.send('Lightweight and simple RESTful JSON API for UoG WebAdvisor.');
    return next();
});
courses(app);

// all done
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
