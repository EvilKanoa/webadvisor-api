const courseResolver = require('./course.resolver');

module.exports = ({ code, course }, _, context) =>
  context.catchResolverErrors(
    async () =>
      course ||
      (await courseResolver(
        null,
        {
          code,
          term: context.args.get('term'),
          institution: context.args.get('institution'),
        },
        context,
      )),
  );
