const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const {parseCourses} = require('../parsers/courseParser');
const constants = require('../constants');
const {cache} = require('../middleware/cache');

const CACHE_TIMEOUT = 60 * 5; // 1 minute
const DATA_TIMEOUT = 60 * 60;
const DATA_TIME_KEY = '__internal__course_refresh_time';

const getCookie = (res, key) => (res.headers['set-cookie'] || [])
    .find((cookie) => cookie.trim().toLowerCase().startsWith(`${key.toLowerCase()}=`))
    .split('=', 2)[1];

const getStaticPath = (term) => path.join(__dirname, 'static', 'courses', `${term.toUpperCase()}.json`);

const queryCourses = async (request, term = constants.defaultTerm) => {
    // send a request to get a session token
    let response = await request({
        url: constants.webadvisorTokenUrl,
        resolveWithFullResponse: true
    });
    let token = getCookie(response, 'LASTTOKEN');

    // send another request with the token to set required cookies
    response = await request({
        url: constants.webadvisorTokenUrl + token,
        resolveWithFullResponse: true
    });
    token = getCookie(response, 'LASTTOKEN');

    // send the request for the courses
    const form = {
        'VAR1': term,
        ...constants.webadvisorCourseSearchData
    };
    const html = await request.post({ url: constants.webadvisorCourseUrl + token, form });

    // parse and send results
    const data = await parseCourses(html);
    data.forEach((course) => course.term = term);

    return data;
};

const handler = async (req, res, next) => {
    // use a done flag to enable the heroku timeout workaround
    let done = false;
    res.set('Content-Type', 'application/json');
    res.writeHead(202);
    const keepAlive = () => setTimeout(() => {
        if (!done) {
            res.write(' ');
            keepAlive();
        }
    }, 15000);
    keepAlive();

    try {
        const term = req.params.term || constants.defaultTerm;
        const data = await queryCourses(req.rp, term);

        // use fetched data if it's available, otherwise use static data
        if (data && data.length) {
            const json = JSON.stringify(data);
            res.write(json);
            req.cache(json);
        } else if (!(await promisify(fs.access)(getStaticPath(term), fs.constants.R_OK))) {
            console.log('Returning static files for term ' + term);
            done = true;
            fs.createReadStream(getStaticPath(term)).pipe(res);
            return next();
        }
    } catch (err) {
        console.error(err);
        res.write(JSON.stringify({
            status: 500,
            message: 'Failed to query WebAdvisor, is it down?',
            internalError: err
        }));
    }

    done = true;
    res.end();
    return next();
};


module.exports = (app) => {
    app.get('/courses/:term?', cache(CACHE_TIMEOUT, 'application/json'), handler);
};
