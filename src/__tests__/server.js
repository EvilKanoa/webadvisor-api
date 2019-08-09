const config = require('../config');

jest.mock('../app');

describe('server.js', () => {
  beforeEach(() => {
    console.log = jest.fn();
    jest.resetModules();
  });

  it('boots the server with the given port', () => {
    const app = require('../server');

    expect(app.listen).toHaveBeenCalled();
    expect(app.listen.mock.calls[0][0]).toBe(config.port);
  });

  it('logs listening port after boot', () => {
    const app = require('../server');

    expect(app.listen).toHaveBeenCalled();
    expect(app.listen.mock.calls[0].length).toBe(2);

    app.listen.mock.calls[0][1]();
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toEqual(
      `Listening on port ${config.port}.`,
    );
  });
});
