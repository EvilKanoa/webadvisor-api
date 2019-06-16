const path = require('path');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const { parseCourses } = require('../course.uog.parser');

describe('UOG Course Parser', () => {
  it('handles empty inputs', async () => {
    expect(await parseCourses('')).toEqual([]);
    expect(await parseCourses(null)).toEqual([]);
    expect(await parseCourses(false)).toEqual([]);
    expect(await parseCourses('<html></html>')).toEqual([]);
  });

  it.each([
    ['large course search', 'course.uog.data.1.html'],
    ['small course search', 'course.uog.data.2.html'],
    ['single course search', 'course.uog.data.3.html'],
    ['empty search', 'course.uog.data.4.html'],
  ])('parses a %s correctly', async (desc, filename) => {
    const html = await readFile(path.join(__dirname, '__data__', filename));
    const result = await parseCourses(html);
    const str = util.inspect(result, {
      depth: 10,
      maxArrayLength: Infinity,
      sorted: true,
    });
    expect(str).toMatchSnapshot();
  });
});
