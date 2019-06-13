const { parseXMLCourse } = require('../parsers/course.wlu.parser');
const { wlu } = require('../constants');

const toWLUTerm = term =>
  `20${term.slice(1)}${wlu.seasons[term.slice(0, 1)] || '01'}`;

// This is simply black magic.
// Original Source (https://scheduleme.wlu.ca/):
//   function nWindow() {
//     var f8b0=["\x26\x74\x3D","\x26\x65\x3D"]
//     var t=(Math.floor((new Date())/60000))%1000;
//     var e=t%3+t%29+t%42;
//     return f8b0[0]+t+f8b0[1]+e;
//   }
const computeWLUTimestamp = () => {
  const t = Math.floor(new Date() / 60000) % 1000;
  const e = (t % 3) + (t % 29) + (t % 42);
  return { t, e };
};

module.exports = {
  single: async (code, term, { rp: request }) => {
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
  },
};
