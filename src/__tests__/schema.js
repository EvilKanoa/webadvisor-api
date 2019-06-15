const { printSchema } = require('graphql');
const schema = require('../schema');

describe('GraphQL schema', () => {
  it('matches the schema snapshot', () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
