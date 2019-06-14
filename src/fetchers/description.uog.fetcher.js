const { parseDescription } = require('../parsers/description.uog.parser');
const { uog } = require('../constants');

module.exports = async (code, { rp: request }) => {
  const [dept] = code.split(/\*/);
  const response = await request(
    uog.descriptionUrl.replace('{CODE}', dept.toLowerCase()),
  );
  return parseDescription(response, code);
};
