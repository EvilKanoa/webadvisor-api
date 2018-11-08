const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const {parseCourses} = require('../parsers/courseParser');
const constants = require('../constants');
const {cache, putFromReq} = require('../middleware/cache');

const CACHE_TIMEOUT = 60 * 5; // 5 minutes

const getCookie = (res, key) => (res.headers['set-cookie'] || [])
    .find((cookie) => cookie.trim().toLowerCase().startsWith(`${key.toLowerCase()}=`))
    .split('=', 2)[1];

const getStaticPath = (term) => path.join(__dirname, 'static', 'courses', `${term.toUpperCase()}.json`);

module.exports = (app) => {
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
            // send a request to get a session token
            let response = await req.rp({ url: constants.webadvisorTokenUrl, resolveWithFullResponse: true });
            let token = getCookie(response, 'LASTTOKEN');

            // send another request with the token to set required cookies
            response = await req.rp({ url: constants.webadvisorTokenUrl + token, resolveWithFullResponse: true });
            token = getCookie(response, 'LASTTOKEN');

            // send the request for the courses
            const term = req.params.term || constants.defaultTerm;
            const form = {
                'VAR1': term,
                ...constants.webadvisorCourseSearchData
            };
            const html = await req.rp.post({ url: constants.webadvisorCourseUrl + token, form });

            // parse and send results
            const data = await parseCourses(html);
            data.forEach((course) => course.term = term);

            // use fetched data if it's available, otherwise use static data
            if (data && data.length) {
                const json = JSON.stringify(data);
                res.write(json);
                putFromReq(req, json, CACHE_TIMEOUT);
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

    app.get('/courses/:term?', cache(CACHE_TIMEOUT), handler);
};
