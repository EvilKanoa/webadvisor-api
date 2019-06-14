const { parseXMLCourse } = require('../parsers/course.wlu.parser');
const { toWLUTerm, computeWLUTimestamp } = require('../utils/wluFetchUtils');
const { wlu } = require('../constants');

module.exports = async (code, term, { rp: request }) => {
  const xml = await request({
    uri: wlu.schedulemeCourseUrl,
    resolveWithFullResponse: false,
    qs: {
      term: toWLUTerm(term),
      course_0_0: code,
      nouser: 1,
      ...computeWLUTimestamp(),
    },
    headers: {
      'accept': 'application/xml, text/xml, */*; q=0.01',
      'accept-language': 'en-US,en;q=0.9',
    },
  });

  return parseXMLCourse(xml);
};
