const { env } = require('../config');

const institutions = {
  UOG: require('../fetchers/course.uog.fetcher').single,
  UW: () => {},
  WLU: require('../fetchers/course.wlu.fetcher').single,
};

module.exports = async (root, { code, institution, term }, context) => {
  try {
    const resolver = institutions[institution];
    const course = resolver && (await resolver(code, term, context));
    if (course) {
      course.institution = institution;
      course.term = term;
    }
    return course;
  } catch (e) {
    if (env !== 'production') {
      console.error(e);
    }
  }
};
