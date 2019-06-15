const graphql = require('express-graphql');
const schema = require('../schema');

const config = {
  schema,
  graphiql: true,
  pretty: true,
};

module.exports = app => app.use('/graphql', graphql(config));
