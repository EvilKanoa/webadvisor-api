module.exports = app => {
  app.get('/', (req, res, next) => {
    res.send('Lightweight and simple GraphQL API for UoG, UW, and WLU.');
    return next();
  });
};
