const path = require('path');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const { parseXMLSearch } = require('../search.wlu.parser');

describe('WLU Course Search Parser', () => {
  it('handles empty inputs', async () => {
    expect(await parseXMLSearch('')).toBeFalsy();
    expect(await parseXMLSearch(null)).toBeFalsy();
    expect(await parseXMLSearch(false)).toBeFalsy();
  });

  it.each([
    ['search with many results', 'search.wlu.data.1.xml'],
    ['search with few results', 'search.wlu.data.2.xml'],
  ])('parses a %s correctly', async (desc, filename) => {
    const xml = await readFile(path.join(__dirname, '__data__', filename));
    const result = await parseXMLSearch(xml);
    const str = util.inspect(result, {
      depth: 10,
      maxArrayLength: Infinity,
      sorted: true,
    });
    expect(str).toMatchSnapshot();
  });
});
