const { parseCourses } = require('../parsers/course.uog.parser');
const { sendRequest } = require('../utils/fetchUtils.uog');

module.exports = async (code, term, { rp: request }) => {
  // get the course department and number separate to query webadvisor
  const [var1, var3] = code.split(/\*/);
  const html = await sendRequest(request, {
    'VAR1': term,
    'LIST.VAR1_1': var1,
    'LIST.VAR3_1': var3,
  });

  const data = await parseCourses(html);

  return data.find(course => course.code.toLowerCase() === code.toLowerCase());
};
