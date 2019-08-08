const fetchers = {
  disclaimer: {
    UOG: () => {},
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

      return { institution, year };
    }),
  disclaimer: (root, args, context) =>
    context.catchResolverErrors(async () => {
      const { institution, year } = context.args.getAll();

      const resolver = fetchers.disclaimer[institution];
      const disclaimer =
        resolver && (await resolver(institution, year, context));
      return disclaimer || undefined;
    }),
  courseDescriptions: (root, args, context) =>
    context.catchResolverErrors(async () => {
      const { institution, year } = context.args.getAll();

      const resolver = fetchers.courseDescriptions[institution];
      const description =
        resolver && (await resolver(institution, year, context));
      return description || undefined;
    }),
};
