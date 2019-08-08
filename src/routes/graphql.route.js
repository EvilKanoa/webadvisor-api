const graphql = require('express-graphql');
const schema = require('../schema');
const StrickArgHolder = require('../utils/argHolder');

const getConfig = req => ({
  schema,
  graphiql: true,
  pretty: true,
  context: {
    ...req,
    args: new StrickArgHolder(),
  },
});

module.exports = app => {
  app.use('/graphql', graphql(getConfig));
};
