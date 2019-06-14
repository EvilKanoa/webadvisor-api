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

const sendRequest = async (request, formData = {}, postOpts = {}) => {
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
  return await request.post({
    ...postOpts,
    url: uog.webadvisorCourseUrl + token,
    form: {
      ...uog.webadvisorCourseSearchData,
      ...formData,
    },
  });
};

const loadAllCourses = async (term, { rp: request }) => {
  const html = await sendRequest(request, { VAR1: term });

  // parse and send results
  const data = await parseCourses(html);
  data.forEach(course => (course.term = term));

  return data;
};

module.exports = async (code, term, { rp: request }) => {
  // get the course department an number separate to query webadvisor
  const [var1, var3] = code.split(/\*/);
  const html = await sendRequest(request, {
    'VAR1': term,
    'LIST.VAR1_1': var1,
    'LIST.VAR3_1': var3,
  });

  const data = await parseCourses(html);

  return data.find(course => course.code.toLowerCase() === code.toLowerCase());
};
