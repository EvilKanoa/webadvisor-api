const { env } = require('../config');

const institutions = {
  UOG: require('../fetchers/search.uog.fetcher'),
  UW: () => {},
  WLU: require('../fetchers/search.wlu.fetcher'),
};

module.exports = async (
  root,
  { query, term, institution, skip, limit },
  context,
) => {
  query = query.toLowerCase();
  context.args.put({ query, term, institution });
  try {
    const resolver = institutions[institution];
    const results =
      query.length > 0 &&
      resolver &&
      (await resolver(query, term, skip, limit, context));
    return { results: results || [], query, term, institution, skip, limit };
  } catch (e) {
    console.error(e);
    throw env === 'production'
      ? Error('Internal resolve error encountered')
      : e;
  }
};
