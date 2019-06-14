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

module.exports = { sendRequest };
