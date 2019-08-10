const fetchers = {
  UOG: require('../../fetchers/search.uog.fetcher'),
  UW: () => {},
  WLU: require('../../fetchers/search.wlu.fetcher'),
};
const resolver = require('../search.resolver');

jest.mock('../../fetchers/search.uog.fetcher');
jest.mock('../../fetchers/search.wlu.fetcher');

describe('course.resolver', () => {
  const context = {
    catchResolverErrors: jest.fn(),
    args: {
      put: jest.fn(),
    },
  };
  const [term, query, skip, limit] = ['F00', 'lol', 0, 0];

  beforeEach(() => {
    context.catchResolverErrors.mockReset();
    context.catchResolverErrors.mockImplementation(f => f());
  });

  it('wraps fetchers in catchResolverErrors', async () => {
    const test = 'test';
    context.catchResolverErrors.mockResolvedValueOnce(test);

    const result = await resolver({}, { query }, context);

    expect(context.catchResolverErrors).toHaveBeenCalled();
    expect(result).toBe(test);
  });

  it('calls the correct fetcher', async () => {
    fetchers.UOG.mockReset();
    await resolver(
      {},
      { institution: 'UOG', term, query, skip, limit },
      context,
    );
    expect(fetchers.UOG).toHaveBeenCalledWith(
      query,
      term,
      skip,
      limit,
      context,
    );

    fetchers.WLU.mockReset();
    await resolver(
      {},
      { institution: 'WLU', term, query, skip, limit },
      context,
    );
    expect(fetchers.WLU).toHaveBeenCalledWith(
      query,
      term,
      skip,
      limit,
      context,
    );
  });

  it('returns empty array on unknown institution', async () => {
    const result = await resolver(
      {},
      { institution: 'Unknown', term, query, skip, limit },
      context,
    );

    expect(result).toEqual({
      results: [],
      query,
      term,
      institution: 'Unknown',
      skip,
      limit,
    });
  });

  it('returns empty array on empty query', async () => {
    const result = await resolver(
      {},
      { institution: 'Unknown', term, query: '', skip, limit },
      context,
    );

    expect(result).toEqual({
      results: [],
      query: '',
      term,
      institution: 'Unknown',
      skip,
      limit,
    });
  });

  it('returns empty array on falsy parse', async () => {
    fetchers.UOG.mockReturnValueOnce(false);
    const result = await resolver(
      {},
      { institution: 'UOG', query, term, skip, limit },
      context,
    );

    expect(result).toEqual({
      results: [],
      query,
      term,
      institution: 'UOG',
      skip,
      limit,
    });
  });

  it('lower cases the query', async () => {
    const result = await resolver(
      {},
      { institution: 'UOG', query: 'TEST', term, skip, limit },
      context,
    );

    expect(result).toEqual({
      results: [],
      query: 'test',
      term,
      institution: 'UOG',
      skip,
      limit,
    });
  });

  it('inserts the search terms into the arg holder', async () => {
    await resolver(
      {},
      { institution: 'UOG', query, term, skip, limit },
      context,
    );

    expect(context.args.put).toHaveBeenCalledWith({
      query,
      term,
      institution: 'UOG',
    });
  });
});
