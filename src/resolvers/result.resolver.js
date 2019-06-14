const courseResolver = require('./course.resolver');

const getSelectionSet = info => info.operation.selectionSet.selections;
const searchSet = (set, kind, name) =>
  set.find(entry => entry.kind === kind && entry.name.value === name);
const getValue = entry => entry.value.value;
const getArguments = (info, rootField) =>
  searchSet(getSelectionSet(info), 'Field', rootField).arguments;
const selectArgument = (args, name) =>
  getValue(searchSet(args, 'Argument', name));

module.exports = async ({ code, course }, args, context, info) => {
  if (course) {
    return course;
  } else {
    const searchArgs = getArguments(info, 'search');
    return await courseResolver(
      null,
      {
        code,
        term: selectArgument(searchArgs, 'term'),
        institution: selectArgument(searchArgs, 'institution'),
      },
      context,
    );
  }
};
