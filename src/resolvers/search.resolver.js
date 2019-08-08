const fetchers = {
  UOG: require('../fetchers/search.uog.fetcher'),
  UW: () => {},
  WLU: require('../fetchers/search.wlu.fetcher'),
};

module.exports = (root, { query, term, institution, skip, limit }, context) =>
  context.catchResolverErrors(async () => {
    query = query.toLowerCase();
    context.args.put({ query, term, institution });

    const resolver = fetchers[institution];
    const results =
      query.length > 0 &&
      resolver &&
      (await resolver(query, term, skip, limit, context));

    return { results: results || [], query, term, institution, skip, limit };
  });
