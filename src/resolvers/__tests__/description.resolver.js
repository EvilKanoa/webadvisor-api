const descriptionFetcher = require('../../fetchers/description.uog.fetcher');
const resolver = require('../description.resolver');

jest.mock('../../fetchers/description.uog.fetcher');

describe('description.resolver', () => {
  const root = { institution: 'UOG' };
  const context = { catchResolverErrors: jest.fn() };

  beforeEach(() => {
    context.catchResolverErrors.mockReset();
    context.catchResolverErrors.mockImplementation(f => f());
  });

  it('wraps fetchers in catchResolverErrors', async () => {
    const test = 'test';
    context.catchResolverErrors.mockResolvedValueOnce(test);

    const result = await resolver(root, {}, context);

    expect(context.catchResolverErrors).toHaveBeenCalled();
    expect(result).toBe(test);
  });

  it('calls the the uog fetcher', async () => {
    const code = 'TEST*1234';
    const description = 'test';

    descriptionFetcher.mockReset();
    await resolver({ ...root, code }, {}, context);
    expect(descriptionFetcher).toHaveBeenCalledWith(code, context);

    descriptionFetcher.mockReset();
    const result = await resolver({ code, description }, {}, context);
    expect(descriptionFetcher).not.toHaveBeenCalled();
    expect(result).toBe(description);
  });
});
