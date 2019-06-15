const { parseCourses } = require('../parsers/course.uog.parser');
const { sendRequest } = require('../utils/fetchUtils.uog');

module.exports = async (query, term, skip = 0, limit = 0, { rp: request }) => {
  let results = await parseCourses(
    await sendRequest(request, { VAR1: term, VAR3: query }),
  );

  if (query.split(/[\s]+/).length === 1) {
    if (query.includes('*')) {
      const [var1, var3] = query.split(/\*/);
      results.push(
        ...(await parseCourses(
          await sendRequest(request, {
            'VAR1': term,
            'LIST.VAR1_1': var1.toUpperCase(),
            'LIST.VAR3_1': var3,
          }),
        )),
      );
    } else {
      results.push(
        ...(await parseCourses(
          await sendRequest(request, {
            'VAR1': term,
            'LIST.VAR1_1': query.toUpperCase(),
          }),
        )),
        ...(await parseCourses(
          await sendRequest(request, { 'VAR1': term, 'LIST.VAR3_1': query }),
        )),
      );
    }
  }

  results = Object.values(
    results.reduce((obj, course) => {
      obj[course.code] = obj[course.code] || {
        code: course.code,
        course,
      };
      return obj;
    }, {}),
  );

  results = results.slice(skip);
  if (limit > 0 && results.length > limit) {
    results = results.slice(0, limit - results.length);
  }

  return results;
};
