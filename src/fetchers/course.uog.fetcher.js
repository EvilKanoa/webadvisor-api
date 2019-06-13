const { parseCourses } = require('../parsers/course.uog.parser');
const { uog } = require('../constants');

const getCookie = (res, key) =>
  (res.headers['set-cookie'] || [])
    .find(cookie =>
      cookie
        .trim()
        .toLowerCase()
        .startsWith(`${key.toLowerCase()}=`),
    )
    .split('=', 2)[1];

module.exports = {
  list: async (term, { rp: request }) => {
    // send a request to get a session token
    let response = await request({
      url: uog.webadvisorTokenUrl,
      resolveWithFullResponse: true,
    });
    let token = getCookie(response, 'LASTTOKEN');

    // send another request with the token to set required cookies
    response = await request({
      url: uog.webadvisorTokenUrl + token,
      resolveWithFullResponse: true,
    });
    token = getCookie(response, 'LASTTOKEN');

    // send the request for the courses
    const form = {
      VAR1: term,
      ...uog.webadvisorCourseSearchData,
    };
    const html = await request.post({
      url: uog.webadvisorCourseUrl + token,
      form,
    });

    // parse and send results
    const data = await parseCourses(html);
    data.forEach(course => (course.term = term));

    return data;
  },
};
