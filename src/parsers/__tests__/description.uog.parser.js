const path = require('path');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const { parseDescription } = require('../description.uog.parser');

describe('UOG Course Description Parser', () => {
  it('handles empty inputs', async () => {
    expect(await parseDescription('')).toBeFalsy();
    expect(await parseDescription(null)).toBeFalsy();
    expect(await parseDescription(false)).toBeFalsy();
    expect(await parseDescription('<html></html>')).toBeFalsy();
  });

  it.each([
    [
      'parses a description correctly',
      'description.uog.data.1.html',
      'CIS*2750',
    ],
    [
      'fails gracefully when course not found',
      'description.uog.data.2.html',
      'CIS*2750',
    ],
  ])('%s', async (desc, filename, code) => {
    const html = await readFile(path.join(__dirname, '__data__', filename));
    const result = await parseDescription(html, code);
    const str = util.inspect(result, {
      depth: 10,
      maxArrayLength: Infinity,
      sorted: true,
    });
    expect(str).toMatchSnapshot();
  });
});
