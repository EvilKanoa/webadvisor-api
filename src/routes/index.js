const handlers = [
  require('./graphql.route'),
  require('./index.route'),
  require('./courses.route'),
];

module.exports = async app => handlers.forEach(handler => handler(app));
