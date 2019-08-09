const { uog } = require('../constants');

const getCookie = (res, key) => {
  const cookie = ((res && res.headers['set-cookie']) || []).find(cookie =>
    cookie
      .trim()
      .toLowerCase()
      .startsWith(`${key.toLowerCase()}=`),
  );
  return cookie && cookie.split('=', 2)[1];
};

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

const toCalendarYear = year => {
  const parsed = parseInt(year, 10);
  return parsed && parsed > 0 ? `${parsed}-${parsed + 1}` : 'current';
};

module.exports = { sendRequest, getCookie, toCalendarYear };
