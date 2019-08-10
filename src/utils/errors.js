module.exports = env => ({
  catchResolverErrors: async func => {
    try {
      return await func();
    } catch (e) {
      console.error(e);

      throw env === 'production'
        ? Error('Internal resolve error encountered')
        : e;
    }
  },
  catchResolverErrorsSync: func => {
    try {
      return func();
    } catch (e) {
      console.error(e);

      throw env === 'production'
        ? Error('Internal resolve error encountered')
        : e;
    }
  },
});
