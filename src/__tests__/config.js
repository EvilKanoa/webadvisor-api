describe('Configuration controls', () => {
  let env;

  beforeAll(() => {
    env = process.env;
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterAll(() => {
    process.env = env;
  });

  it('uses the process.env values if set', () => {
    process.env = { NODE_ENV: 'test_env', PORT: 1337 };
    const config = require('../config');

    expect(JSON.stringify(config)).toMatchSnapshot();
  });

  it('uses fallbacks when process.env values are not set', () => {
    process.env = {};
    const config = require('../config');

    expect(JSON.stringify(config)).toMatchSnapshot();
  });
});
