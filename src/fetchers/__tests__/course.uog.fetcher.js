const { parseCourses } = require('../../parsers/course.uog.parser');
const { sendRequest } = require('../../utils/fetchUtils.uog');
const fetcher = require('../course.uog.fetcher');

jest.mock('../../parsers/course.uog.parser');
jest.mock('../../utils/fetchUtils.uog');

describe('UOG Course Fetcher', () => {
  const code = 'TEST*1000';
  const term = 'F19';
  const req = { rp: jest.fn() };

  beforeEach(() => {
    parseCourses.mockReset();
    parseCourses.mockResolvedValue([]);

    sendRequest.mockReset();
  });

  it('makes the request with the correct handler and data', async () => {
    await fetcher(code, term, req);

    expect(sendRequest.mock.calls.length).toBe(1);
    expect(sendRequest.mock.calls[0].length).toBe(2);
    expect(sendRequest.mock.calls[0][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[0][1]).toEqual({
      'VAR1': term,
      'LIST.VAR1_1': 'TEST',
      'LIST.VAR3_1': '1000',
    });
  });

  it('uses the request response as the value to parse', async () => {
    const mockHtml = '<html></html>';
    sendRequest.mockReturnValueOnce(mockHtml);
    await fetcher(code, term, req);

    expect(parseCourses.mock.calls.length).toBe(1);
    expect(parseCourses.mock.calls[0].length).toBe(1);
    expect(parseCourses.mock.calls[0][0]).toBe(mockHtml);
  });

  it('returns the first found course', async () => {
    const mockCourse = { code, name: 'mocked' };
    const data = [{ code: 'TEST*1200' }, mockCourse, { code: 'OTHER*101' }];
    parseCourses.mockResolvedValue(data);
    const result = await fetcher(code, term, req);

    expect(result).toBeDefined();
    expect(result).toEqual({ ...mockCourse, term, institution: 'UOG' });
  });
});
