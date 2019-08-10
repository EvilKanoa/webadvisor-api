const { parseXMLSearch } = require('../../parsers/search.wlu.parser');
const { toWLUTerm } = require('../../utils/fetchUtils.wlu');
const { wlu } = require('../../constants');
const fetcher = require('../search.wlu.fetcher');

jest.mock('../../parsers/search.wlu.parser');

describe('search.wlu.fetcher', () => {
  const query = 'a query string';
  const term = 'F19';
  const req = { rp: jest.fn() };

  beforeEach(() => {
    parseXMLSearch.mockReset();
    parseXMLSearch.mockReturnValue([]);

    req.rp.mockReset();
  });

  it('uses the correct query options for the request', async () => {
    await fetcher(query, term, undefined, undefined, req);

    expect(req.rp.mock.calls.length).toBe(1);
    expect(req.rp.mock.calls[0].length).toBe(1);
    expect(req.rp.mock.calls[0][0]).toEqual({
      uri: wlu.schedulemeSearchUrl,
      resolveWithFullResponse: false,
      qs: {
        term: toWLUTerm(term),
        page_num: 0,
        course_add: query,
      },
    });
  });

  it('sends multiple requests when required', async () => {
    parseXMLSearch.mockReturnValueOnce(['code']);
    parseXMLSearch.mockReturnValueOnce(['code2']);
    parseXMLSearch.mockReturnValueOnce([]);
    const results = await fetcher(query, term, undefined, undefined, req);

    expect(req.rp.mock.calls.length).toBe(3);
    expect(req.rp.mock.calls[0].length).toBe(1);
    expect(req.rp.mock.calls[0][0].qs.page_num).toBe(0);
    expect(req.rp.mock.calls[1].length).toBe(1);
    expect(req.rp.mock.calls[1][0].qs.page_num).toBe(1);
    expect(req.rp.mock.calls[2].length).toBe(1);
    expect(req.rp.mock.calls[2][0].qs.page_num).toBe(2);

    expect(results).toEqual([{ code: 'code' }, { code: 'code2' }]);
  });

  it('correctly skips and limits results', async () => {
    const mockCodes = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
    ];
    const mockResults = mockCodes.map(code => ({ code }));
    req.rp.mockImplementation(r => Promise.resolve(r.qs.page_num));
    parseXMLSearch.mockImplementation(pg => {
      switch (pg) {
        case 0:
          return mockCodes.slice(0, 7);
        case 1:
          return mockCodes.slice(7, 14);
        case 2:
          return mockCodes.slice(14);
        default:
          return [];
      }
    });

    const skippedResults1 = await fetcher(query, term, 1, undefined, req);
    const skippedResults2 = await fetcher(query, term, 7, undefined, req);
    const skippedResults3 = await fetcher(query, term, 8, undefined, req);

    expect(skippedResults1).toEqual(mockResults.slice(1));
    expect(skippedResults2).toEqual(mockResults.slice(7));
    expect(skippedResults3).toEqual(mockResults.slice(8));

    const limitedResults1 = await fetcher(query, term, undefined, 3, req);
    const limitedResults2 = await fetcher(query, term, undefined, 10, req);

    expect(limitedResults1).toEqual(mockResults.slice(0, 3));
    expect(limitedResults2).toEqual(mockResults.slice(0, 10));

    const constrainedResults1 = await fetcher(query, term, 1, 2, req);
    const constrainedResults2 = await fetcher(query, term, 1, 10, req);
    const constrainedResults3 = await fetcher(query, term, 8, 2, req);

    expect(constrainedResults1).toEqual(mockResults.slice(1, 3));
    expect(constrainedResults2).toEqual(mockResults.slice(1, 11));
    expect(constrainedResults3).toEqual(mockResults.slice(8, 10));
  });
});
