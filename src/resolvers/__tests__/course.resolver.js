const fetchers = {
  UOG: require('../../fetchers/course.uog.fetcher'),
  UW: () => {},
  WLU: require('../../fetchers/course.wlu.fetcher'),
};
const resolver = require('../course.resolver');

jest.mock('../../fetchers/course.uog.fetcher');
jest.mock('../../fetchers/course.wlu.fetcher');

describe('course.resolver', () => {
  const context = { catchResolverErrors: jest.fn() };

  beforeEach(() => {
    context.catchResolverErrors.mockReset();
    context.catchResolverErrors.mockImplementation(f => f());
  });

  it('wraps fetchers in catchResolverErrors', async () => {
    const test = 'test';
    context.catchResolverErrors.mockResolvedValueOnce(test);

    const result = await resolver({}, {}, context);

    expect(context.catchResolverErrors).toHaveBeenCalled();
    expect(result).toBe(test);
  });

  it('calls the correct fetcher', async () => {
    const [code, term] = ['TEST*1234', 'F00'];

    fetchers.UOG.mockReset();
    await resolver({}, { institution: 'UOG', code, term }, context);
    expect(fetchers.UOG).toHaveBeenCalledWith(code, term, context);

    fetchers.WLU.mockReset();
    await resolver({}, { institution: 'WLU', code, term }, context);
    expect(fetchers.WLU).toHaveBeenCalledWith(code, term, context);
  });

  it('returns undefined on unknown institution', async () => {
    const result = await resolver({}, { institution: 'Unknown' }, context);

    expect(result).toBeUndefined();
  });

  it('returns undefined on falsy parse', async () => {
    fetchers.UOG.mockReturnValueOnce(false);
    const result = await resolver({}, { institution: 'UOG' }, context);

    expect(result).toBeUndefined();
  });
});
