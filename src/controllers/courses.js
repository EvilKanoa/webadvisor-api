const {parseCourses} = require('../parsers/courseParser');
const constants = require('../constants');

const getCookie = (res, key) => (res.headers['set-cookie'] || [])
    .find((cookie) => cookie.trim().toLowerCase().startsWith(`${key.toLowerCase()}=`))
    .split('=', 2)[1];

module.exports = (app) => {
    const handler = async (req, res, next) => {
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
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500);
            res.json({
                status: 500,
                message: 'Failed to query WebAdvisor, is it down?',
                internalError: err
            });
        }

        return next();
    };

    app.get('/courses/:term', handler);
    app.get('/courses', handler);
};
