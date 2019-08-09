const { sprintf } = require('sprintf-js');
const { uog } = require('../constants');
const {
  parseCourseDescriptionSection,
} = require('../parsers/courseDescriptionSection.uog.parser');

const makeFetcher = (url, parser) => async ({ rp: request }, ...args) =>
  await parser(await request(sprintf(url, ...args)));

module.exports = {
  disclaimer: makeFetcher(
    uog.calendarUrls.disclaimer,
    require('../parsers/disclaimer.uog.parser').parseDisclaimer,
  ),
  courseDescriptions: makeFetcher(
    uog.calendarUrls.courseDescriptions,
    require('../parsers/courseDescriptions.uog.parser').parseCourseDescriptions,
  ),
  courseDescriptionSection: async ({ rp: request }, year, code) =>
    await parseCourseDescriptionSection(
      await request(
        sprintf(
          uog.calendarUrls.courseDescriptionSection,
          year,
          (code || '').toLowerCase(),
        ),
      ),
    ),
};
