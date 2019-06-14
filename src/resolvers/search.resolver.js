const { env } = require('../config');

const institutions = {
  UOG: () => {},
  UW: () => {},
  WLU: require('../fetchers/search.wlu.fetcher'),
};

module.exports = async (
  root,
  { query, term, institution, skip, limit },
  context,
) => {
  query = query.toLowerCase();
  try {
    const resolver = institutions[institution];
    const results =
      resolver && (await resolver(query, term, skip, limit, context));
    return { results, query, term, institution, skip, limit };
  } catch (e) {
    if (env !== 'production') {
      console.error(e);
      throw e;
    } else {
      throw Error('Internal resolve error encountered');
    }
  }
};
