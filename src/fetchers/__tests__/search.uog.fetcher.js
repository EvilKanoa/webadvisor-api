const { parseCourses } = require('../../parsers/course.uog.parser');
const { sendRequest } = require('../../utils/fetchUtils.uog');
const fetcher = require('../search.uog.fetcher');

jest.mock('../../parsers/course.uog.parser');
jest.mock('../../utils/fetchUtils.uog');

describe('search.uog.fetcher', () => {
  const queryCode = 'TEST*1000';
  const queryKeyword = 'name';
  const queryString = 'a query string';
  const term = 'F19';
  const req = { rp: jest.fn() };
  const mockCourse = { code: queryCode, term, institution: 'UOG' };

  beforeEach(() => {
    parseCourses.mockReset();
    parseCourses.mockImplementation(data =>
      Promise.resolve([
        {
          code: Object.keys(data).join(','),
        },
      ]),
    );

    sendRequest.mockReset();
    sendRequest.mockImplementation((req, data) => Promise.resolve(data));
  });

  it('sends the correct requests when given a keyword query', async () => {
    const result = await fetcher(queryKeyword, term, null, null, req);

    expect(sendRequest.mock.calls.length).toBe(3);

    expect(sendRequest.mock.calls[0].length).toBe(2);
    expect(sendRequest.mock.calls[0][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[0][1]).toEqual({
      VAR1: term,
      VAR3: queryKeyword,
    });

    expect(sendRequest.mock.calls[1].length).toBe(2);
    expect(sendRequest.mock.calls[1][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[1][1]).toEqual({
      'VAR1': term,
      'LIST.VAR1_1': queryKeyword.toUpperCase(),
    });

    expect(sendRequest.mock.calls[2].length).toBe(2);
    expect(sendRequest.mock.calls[2][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[2][1]).toEqual({
      'VAR1': term,
      'LIST.VAR3_1': queryKeyword,
    });

    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      code: 'VAR1,VAR3',
      course: { code: 'VAR1,VAR3', term, institution: 'UOG' },
    });
    expect(result).toContainEqual({
      code: 'VAR1,LIST.VAR1_1',
      course: { code: 'VAR1,LIST.VAR1_1', term, institution: 'UOG' },
    });
    expect(result).toContainEqual({
      code: 'VAR1,LIST.VAR3_1',
      course: { code: 'VAR1,LIST.VAR3_1', term, institution: 'UOG' },
    });
  });

  it('sends the correct requests when given a code query', async () => {
    const result = await fetcher(queryCode, term, undefined, undefined, req);

    expect(sendRequest.mock.calls.length).toBe(2);

    expect(sendRequest.mock.calls[0].length).toBe(2);
    expect(sendRequest.mock.calls[0][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[0][1]).toEqual({
      VAR1: term,
      VAR3: queryCode,
    });

    expect(sendRequest.mock.calls[1].length).toBe(2);
    expect(sendRequest.mock.calls[1][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[1][1]).toEqual({
      'VAR1': term,
      'LIST.VAR1_1': 'TEST',
      'LIST.VAR3_1': '1000',
    });

    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      code: 'VAR1,VAR3',
      course: { code: 'VAR1,VAR3', term, institution: 'UOG' },
    });
    expect(result).toContainEqual({
      code: 'VAR1,LIST.VAR1_1,LIST.VAR3_1',
      course: {
        code: 'VAR1,LIST.VAR1_1,LIST.VAR3_1',
        term,
        institution: 'UOG',
      },
    });
  });

  it('sends the correct request when given a string query', async () => {
    const result = await fetcher(queryString, term, undefined, undefined, req);

    expect(sendRequest.mock.calls.length).toBe(1);
    expect(sendRequest.mock.calls[0].length).toBe(2);
    expect(sendRequest.mock.calls[0][0]).toBe(req.rp);
    expect(sendRequest.mock.calls[0][1]).toEqual({
      VAR1: term,
      VAR3: queryString,
    });

    expect(result).toHaveLength(1);
    expect(result).toContainEqual({
      code: 'VAR1,VAR3',
      course: { code: 'VAR1,VAR3', term, institution: 'UOG' },
    });
  });

  it('removes duplicate entries from results', async () => {
    const mockCourseDuplicate = { ...mockCourse };
    const expectedResult = [{ code: mockCourse.code, course: mockCourse }];
    parseCourses.mockResolvedValue([
      mockCourse,
      mockCourseDuplicate,
      mockCourse,
      mockCourseDuplicate,
    ]);
    const result1 = await fetcher(queryCode, term, undefined, undefined, req);
    const result2 = await fetcher(queryString, term, undefined, undefined, req);
    const result3 = await fetcher(
      queryKeyword,
      term,
      undefined,
      undefined,
      req,
    );

    expect(result1).toEqual(expectedResult);
    expect(result2).toEqual(expectedResult);
    expect(result3).toEqual(expectedResult);
  });

  it('correctly skips and limits results', async () => {
    parseCourses.mockResolvedValue([
      { code: '1' },
      { code: '2' },
      { code: '3' },
      { code: '4' },
      { code: '5' },
    ]);

    const skippedResults = await fetcher(queryString, term, 1, undefined, req);
    const limitedResults = await fetcher(queryString, term, undefined, 3, req);
    const skippedAndLimitedResults = await fetcher(
      queryString,
      term,
      1,
      2,
      req,
    );
    const noSkipResults = await fetcher(queryString, term, 0, undefined, req);
    const noLimitResults = await fetcher(queryString, term, undefined, 0, req);
    const bigLimitResults = await fetcher(
      queryString,
      term,
      undefined,
      1000,
      req,
    );

    const expectResults = (...x) =>
      x.map(x => ({
        code: `${x}`,
        course: { code: `${x}`, term, institution: 'UOG' },
      }));

    expect(skippedResults).toEqual(expectResults(2, 3, 4, 5));
    expect(limitedResults).toEqual(expectResults(1, 2, 3));
    expect(skippedAndLimitedResults).toEqual(expectResults(2, 3));
    expect(noSkipResults).toEqual(expectResults(1, 2, 3, 4, 5));
    expect(noLimitResults).toEqual(expectResults(1, 2, 3, 4, 5));
    expect(bigLimitResults).toEqual(expectResults(1, 2, 3, 4, 5));
  });
});
