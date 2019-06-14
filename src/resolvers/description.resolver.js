const descriptionFetcher = require('../fetchers/description.uog.fetcher');

module.exports = async ({ code, institution, description }, args, context) => {
  if (institution === 'UOG') {
    return await descriptionFetcher(code, context);
  } else {
    return description;
  }
};
