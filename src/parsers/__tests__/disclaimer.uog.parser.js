const path = require('path');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const { parseDisclaimer } = require('../disclaimer.uog.parser');

describe('disclaimer.uog.parser', () => {
  it('handles empty inputs', async () => {
    const empty = { title: undefined, description: undefined };
    expect(await parseDisclaimer('')).toEqual(empty);
    expect(await parseDisclaimer(null)).toEqual(empty);
    expect(await parseDisclaimer(false)).toEqual(empty);
    expect(await parseDisclaimer('<html></html>')).toEqual(empty);
  });

  it('parses a disclaimer correctlys', async () => {
    const html = await readFile(
      path.join(__dirname, '__data__', 'disclaimer.uog.data.1.html'),
    );
    const result = await parseDisclaimer(html);
    const str = util.inspect(result, {
      depth: 10,
      maxArrayLength: Infinity,
      sorted: true,
    });
    expect(str).toMatchSnapshot();
  });
});
