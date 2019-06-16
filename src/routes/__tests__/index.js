const graphqlRoute = require('../graphql.route');
const indexRoute = require('../index.route');
const coursesRoute = require('../courses.route');
const route = require('../index');

jest.mock('../graphql.route');
jest.mock('../index.route');
jest.mock('../courses.route');

describe('Route Builder', () => {
  beforeEach(() => {
    graphqlRoute.mockReset();
    indexRoute.mockReset();
    coursesRoute.mockReset();
  });

  it('correctly calls the graphql handler with an app instance', async () => {
    const appMock = jest.fn();
    await route(appMock);

    expect(graphqlRoute).toHaveBeenCalledTimes(1);
    expect(graphqlRoute).toHaveBeenCalledWith(appMock);
  });

  it('correctly calls the index handler with an app instance', async () => {
    const appMock = jest.fn();
    await route(appMock);

    expect(indexRoute).toHaveBeenCalledTimes(1);
    expect(indexRoute).toHaveBeenCalledWith(appMock);
  });

  it('correctly calls the courses handler with an app instance', async () => {
    const appMock = jest.fn();
    await route(appMock);

    expect(coursesRoute).toHaveBeenCalledTimes(1);
    expect(coursesRoute).toHaveBeenCalledWith(appMock);
  });
});
