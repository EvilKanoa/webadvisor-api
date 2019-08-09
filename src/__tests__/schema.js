const { printSchema } = require('graphql');
const schema = require('../schema');

describe('schema.js', () => {
  it('matches the schema snapshot', () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
