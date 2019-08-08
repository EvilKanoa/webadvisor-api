const { defaults } = require('request-promise-native');
const middleware = require('../request-promise');

jest.mock('request-promise-native', () => ({
  defaults: jest.fn(x => x),
}));

describe('Request Promise Middleware', () => {
  it('calls next in the chain', () => {
    const nextMock = jest.fn();
    const defaultsMock = {};
    const getDefaultsMock = jest.fn(() => defaultsMock);
    const reqMock = {};

    middleware(getDefaultsMock)({}, reqMock, nextMock);

    expect(nextMock).toHaveBeenCalled();
    expect(getDefaultsMock).toHaveBeenCalled();
    expect(defaults).toHaveBeenCalledWith(defaultsMock);
  });

  it('adds the request library to the req object', () => {
    const req = {};
    const getDefaults = () => 'rp';

    middleware(getDefaults)(req, {}, jest.fn());

    expect(req.rp).toBe(getDefaults());
  });

  it("doesn't override a preexisting rp object", () => {
    const req = { rp: 'mine' };
    const getDefaults = () => 'rp';

    middleware(getDefaults)(req, {}, jest.fn());

    expect(req.rp).toEqual('mine');
  });
});
