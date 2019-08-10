const fetchers = {
  UOG: require('../fetchers/course.uog.fetcher'),
  UW: () => {},
  WLU: require('../fetchers/course.wlu.fetcher'),
};

module.exports = (root, { code, institution, term }, context) =>
  context.catchResolverErrors(async () => {
    const resolver = fetchers[institution];
    const course = resolver && (await resolver(code, term, context));
    return course || undefined;
  });
