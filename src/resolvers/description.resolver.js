const descriptionFetcher = require('../fetchers/description.uog.fetcher');

module.exports = ({ code, institution, description }, args, context) =>
  context.catchResolverErrors(async () =>
    institution === 'UOG'
      ? await descriptionFetcher(code, context)
      : description,
  );
