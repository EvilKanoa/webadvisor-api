const fetchers = require('../calendar.uog.fetcher');
const { sprintf } = require('sprintf-js');
const {
  uog: { calendarUrls },
} = require('../../constants');

const { parseDisclaimer } = require('../../parsers/disclaimer.uog.parser');
const {
  parseCourseDescriptions,
} = require('../../parsers/courseDescriptions.uog.parser');
const {
  parseCourseDescriptionSection,
} = require('../../parsers/courseDescriptionSection.uog.parser');

jest.mock('../../parsers/disclaimer.uog.parser');
jest.mock('../../parsers/courseDescriptions.uog.parser');
jest.mock('../../parsers/courseDescriptionSection.uog.parser');

describe('calendar.uog.fetcher', () => {
  const year = '2020';
  const context = { rp: jest.fn() };

  beforeEach(() => {
    context.rp.mockReset();
  });

  describe('disclaimer', () => {
    beforeEach(() => {
      parseDisclaimer.mockReset();
    });

    it('makes the request with the correct query', async () => {
      await fetchers.disclaimer(context, year);

      expect(context.rp).toHaveBeenCalledTimes(1);
      expect(context.rp).toHaveBeenCalledWith(
        sprintf(calendarUrls.disclaimer, year),
      );
    });

    it('passes the request response to the parser', async () => {
      const mockResponse = '<html></html>';
      context.rp.mockResolvedValue(mockResponse);

      await fetchers.disclaimer(context, year);

      expect(parseDisclaimer).toHaveBeenCalledTimes(1);
      expect(parseDisclaimer).toHaveBeenCalledWith(mockResponse);
    });

    it('returns the parsed content', async () => {
      const mockContent = 'test';
      parseDisclaimer.mockResolvedValue(mockContent);

      const result = await fetchers.disclaimer(context, year);

      expect(result).toBe(mockContent);
    });
  });

  describe('courseDescriptions', () => {
    beforeEach(() => {
      parseCourseDescriptions.mockReset();
    });

    it('makes the request with the correct query', async () => {
      await fetchers.courseDescriptions(context, year);

      expect(context.rp).toHaveBeenCalledTimes(1);
      expect(context.rp).toHaveBeenCalledWith(
        sprintf(calendarUrls.courseDescriptions, year),
      );
    });

    it('passes the request response to the parser', async () => {
      const mockResponse = '<html></html>';
      context.rp.mockResolvedValue(mockResponse);

      await fetchers.courseDescriptions(context, year);

      expect(parseCourseDescriptions).toHaveBeenCalledTimes(1);
      expect(parseCourseDescriptions).toHaveBeenCalledWith(mockResponse);
    });

    it('returns the parsed content', async () => {
      const mockContent = 'test';
      parseCourseDescriptions.mockResolvedValue(mockContent);

      const result = await fetchers.courseDescriptions(context, year);

      expect(result).toBe(mockContent);
    });
  });

  describe('courseDescriptionSection', () => {
    const code = 'test';

    beforeEach(() => {
      parseCourseDescriptionSection.mockReset();
    });

    it('makes the request with the correct query given a code', async () => {
      await fetchers.courseDescriptionSection(context, year, code);

      expect(context.rp).toHaveBeenCalledTimes(1);
      expect(context.rp).toHaveBeenCalledWith(
        sprintf(calendarUrls.courseDescriptionSection, year, code),
      );
    });

    it('makes the request with the correct query without a code', async () => {
      await fetchers.courseDescriptionSection(context, year);

      expect(context.rp).toHaveBeenCalledTimes(1);
      expect(context.rp).toHaveBeenCalledWith(
        sprintf(calendarUrls.courseDescriptionSection, year, ''),
      );
    });

    it('passes the request response to the parser', async () => {
      const mockResponse = '<html></html>';
      context.rp.mockResolvedValue(mockResponse);

      await fetchers.courseDescriptionSection(context, year, code);

      expect(parseCourseDescriptionSection).toHaveBeenCalledTimes(1);
      expect(parseCourseDescriptionSection).toHaveBeenCalledWith(mockResponse);
    });

    it('returns the parsed content', async () => {
      const mockContent = 'test';
      parseCourseDescriptionSection.mockResolvedValue(mockContent);

      const result = await fetchers.courseDescriptionSection(
        context,
        year,
        code,
      );

      expect(result).toBe(mockContent);
    });
  });
});
