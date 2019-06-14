const { parseXMLSearch } = require('../parsers/search.wlu.parser');
const { toWLUTerm } = require('../utils/fetchUtils.wlu');
const { wlu } = require('../constants');

const PAGE_COUNT = 7;

module.exports = async (query, term, skip = 0, limit = 0, { rp: request }) => {
  const makeRequest = page =>
    request({
      uri: wlu.schedulemeSearchUrl,
      resolveWithFullResponse: false,
      qs: {
        term: toWLUTerm(term),
        page_num: page,
        course_add: query,
      },
    });

  const pull = skip % PAGE_COUNT;
  let results = [];
  let data = undefined;
  let page = Math.floor(skip / PAGE_COUNT);
  do {
    data = parseXMLSearch(await makeRequest(page++));
    results.push(...data);
  } while (
    data &&
    data.length &&
    (limit === 0 || results.length < limit + pull)
  );

  results = results.slice(pull);
  if (limit > 0 && results.length > limit) {
    results = results.slice(0, limit - results.length);
  }

  return results.map(code => ({ code }));
};
