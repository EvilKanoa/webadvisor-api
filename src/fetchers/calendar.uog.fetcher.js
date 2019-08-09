const { sprintf } = require('sprintf-js');
const { uog } = require('../constants');

const makeFetcher = (url, parser) => async ({ rp: request }, ...args) =>
  await parser(await request(sprintf(url, ...args)));

module.exports = {
  disclaimer: makeFetcher(
    uog.calendarUrls.disclaimer,
    require('../parsers/disclaimer.uog.parser').parseDisclaimer,
  ),
};
