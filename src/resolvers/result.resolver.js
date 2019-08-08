const courseResolver = require('./course.resolver');

module.exports = async ({ code, course }, _, context) =>
  course ||
  (await courseResolver(
    null,
    {
      code,
      term: context.args.get('term'),
      institution: context.args.get('institution'),
    },
    context,
  ));
