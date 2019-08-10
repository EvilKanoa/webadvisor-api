const middleware = require('../cors');

jest.mock('cors', () => opts => opts);

describe('cors middleware', () => {
  it('uses the cors middleware with the correct options', () => {
    expect(JSON.stringify(middleware)).toMatchSnapshot();
  });
});
