const { parseDescription } = require('../../parsers/description.uog.parser');
const { uog } = require('../../constants');
const fetcher = require('../description.uog.fetcher');

jest.mock('../../parsers/description.uog.parser');

describe('description.uog.parser', () => {
  const code = 'TEST*1000';
  const req = { rp: jest.fn() };

  beforeEach(() => {
    parseDescription.mockReset();
    req.rp.mockReset();
  });

  it('makes the request with the correct query', async () => {
    await fetcher(code, req);

    expect(req.rp.mock.calls.length).toBe(1);
    expect(req.rp.mock.calls[0].length).toBe(1);
    expect(req.rp.mock.calls[0][0]).toEqual(
      uog.descriptionUrl.replace('{CODE}', 'test'),
    );
  });

  it('returns the parsed course', async () => {
    const mockDesc = 'a course description';
    const mockHtml = '<html></html>';
    parseDescription.mockReturnValue(mockDesc);
    req.rp.mockResolvedValue(mockHtml);
    const result = await fetcher(code, req);

    expect(parseDescription.mock.calls.length).toBe(1);
    expect(parseDescription.mock.calls[0].length).toBe(2);
    expect(parseDescription.mock.calls[0][0]).toBe(mockHtml);
    expect(parseDescription.mock.calls[0][1]).toBe(code);
    expect(result).toBe(mockDesc);
  });
});
