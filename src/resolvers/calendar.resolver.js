const uogFetchers = require('../fetchers/calendar.uog.fetcher');
const { toCalendarYear } = require('../utils/fetchUtils.uog');

const fetchers = {
  disclaimer: {
    UOG: uogFetchers.disclaimer,
    UW: () => {},
    WLU: () => {},
  },
  courseDescriptions: {
    UOG: uogFetchers.courseDescriptions,
    UW: () => {},
    WLU: () => {},
  },
  courseDescriptionSection: {
    UOG: uogFetchers.courseDescriptionSection,
    UW: () => {},
    WLU: () => {},
  },
};

module.exports = {
  calendar: (_root, { institution, year }, context) =>
    context.catchResolverErrors(async () => {
      const calendarYear = toCalendarYear(year);
      context.args.put({ institution, year: calendarYear });

      return { institution, year: calendarYear };
    }),
  disclaimer: ({ institution, year }, _args, context) =>
    context.catchResolverErrors(async () => {
      const fetcher = fetchers.disclaimer[institution];
      const disclaimer = fetcher && (await fetcher(context, year));
      return disclaimer || undefined;
    }),
  courseDescriptions: ({ institution, year }, _args, context) =>
    context.catchResolverErrors(async () => {
      const fetcher = fetchers.courseDescriptions[institution];
      const description = fetcher && (await fetcher(context, year));
      return description || undefined;
    }),
  courseDescriptionSection: ({ code }, _args, context) =>
    context.catchResolverErrors(async () => {
      const { institution, year } = context.args.getAll();
      const fetcher = fetchers.courseDescriptionSection[institution];
      const section = fetcher && (await fetcher(context, year, code));
      return section || undefined;
    }),
};
