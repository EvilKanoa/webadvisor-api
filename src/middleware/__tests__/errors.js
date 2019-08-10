const errors = require('../../utils/errors');
const middleware = require('../errors');

jest.mock('../../utils/errors', () =>
  jest.fn(env => ({
    catchResolverErrors: 'asyncMock',
    catchResolverErrorsSync: 'syncMock',
    env,
  })),
);

describe('errors middleware', () => {
  it('calls next in the chain', () => {
    const nextMock = jest.fn();

    middleware()({}, {}, nextMock);

    expect(nextMock).toHaveBeenCalled();
  });

  it('adds the error handlers to the req object', () => {
    const req = {};

    middleware()(req, {}, jest.fn());

    expect(req.catchResolverErrors).toEqual('asyncMock');
    expect(req.catchResolverErrorsSync).toEqual('syncMock');
  });

  it('passes env to error utils', () => {
    const env = 'test';

    middleware(env);

    expect(errors).toHaveBeenCalledWith(env);
  });
});
