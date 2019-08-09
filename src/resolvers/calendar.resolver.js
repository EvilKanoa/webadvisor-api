const uogFetchers = require('../fetchers/calendar.uog.fetcher');
const { toCalendarYear } = require('../utils/fetchUtils.uog');

const fetchers = {
  disclaimer: {
    UOG: uogFetchers.disclaimer,
    UW: () => {},
    WLU: () => {},
  },
  courseDescriptions: {
    UOG: () => {},
    UW: () => {},
    WLU: () => {},
  },
};

module.exports = {
  calendar: (root, { institution, year }, context) =>
    context.catchResolverErrors(async () => {
      context.args.put({ institution, year });

      return { institution, year: toCalendarYear(year) };
    }),
  disclaimer: ({ institution, year }, _args, context) =>
    context.catchResolverErrors(async () => {
      const resolver = fetchers.disclaimer[institution];
      const disclaimer = resolver && (await resolver(context, year));
      return disclaimer || undefined;
    }),
  courseDescriptions: ({ institution, year }, _args, context) =>
    context.catchResolverErrors(async () => {
      const resolver = fetchers.courseDescriptions[institution];
      const description = resolver && (await resolver(context, year));
      return description || undefined;
    }),
};
