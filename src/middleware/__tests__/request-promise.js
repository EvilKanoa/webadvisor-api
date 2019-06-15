const middleware = require('../request-promise');

jest.mock('request-promise-native', () => ({
  defaults: x => x,
}));

describe('Request Promise Middleware', () => {
  it('calls next in the chain', () => {
    const nextMock = jest.fn();
    middleware({})({}, {}, nextMock);
    expect(nextMock).toHaveBeenCalled();
  });

  it('adds the request library to the req object', () => {
    const req = {};
    const rp = 'rp';
    middleware(rp)(req, {}, jest.fn());
    expect(req.rp).toBe(rp);
  });

  it("doesn't override a preexisting rp object", () => {
    const req = { rp: 'mine' };
    const rp = 'rp';
    middleware(rp)(req, {}, jest.fn());
    expect(req.rp).toEqual('mine');
  });
});
