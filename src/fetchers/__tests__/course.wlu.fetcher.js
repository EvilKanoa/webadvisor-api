const { parseXMLCourse } = require('../../parsers/course.wlu.parser');
const {
  toWLUTerm,
  computeWLUTimestamp,
} = require('../../utils/fetchUtils.wlu');
const { wlu } = require('../../constants');
const fetcher = require('../course.wlu.fetcher');

jest.mock('../../parsers/course.wlu.parser');
jest.mock('../../utils/fetchUtils.wlu');

describe('WLU Course Fetcher', () => {
  const code = 'TEST-100';
  const term = 'F19';
  const req = { rp: jest.fn() };

  beforeEach(() => {
    parseXMLCourse.mockReset();

    toWLUTerm.mockReset();
    toWLUTerm.mockReturnValue('term');

    computeWLUTimestamp.mockReturnValue({ t: 0, e: 0 });

    req.rp.mockReset();
  });

  it('makes the request with the correct query', async () => {
    await fetcher(code, term, req);

    expect(req.rp.mock.calls.length).toBe(1);
    expect(req.rp.mock.calls[0].length).toBe(1);
    expect(req.rp.mock.calls[0][0]).toEqual({
      uri: wlu.schedulemeCourseUrl,
      resolveWithFullResponse: false,
      qs: {
        term: 'term',
        course_0_0: code,
        nouser: 1,
        t: 0,
        e: 0,
      },
      headers: {
        'accept': 'application/xml, text/xml, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
      },
    });
  });

  it('uses the request response as the value to parse', async () => {
    const mockXml = '<course></course>';
    req.rp.mockResolvedValue(mockXml);
    await fetcher(code, term, req);

    expect(parseXMLCourse.mock.calls.length).toBe(1);
    expect(parseXMLCourse.mock.calls[0].length).toBe(1);
    expect(parseXMLCourse.mock.calls[0][0]).toBe(mockXml);
  });

  it('returns the parsed course', async () => {
    const mockCourse = { code, name: 'mocked' };
    parseXMLCourse.mockResolvedValue(mockCourse);
    const result = await fetcher(code, term, req);

    expect(result).toBeDefined();
    expect(result).toBe(mockCourse);
  });
});
