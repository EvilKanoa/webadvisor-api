const path = require('path');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const { parseXMLCourse } = require('../course.wlu.parser');

describe('course.wlu.parser', () => {
  it('handles empty inputs', async () => {
    expect(await parseXMLCourse('')).toBeFalsy();
    expect(await parseXMLCourse(null)).toBeFalsy();
    expect(await parseXMLCourse(false)).toBeFalsy();
  });

  it.each([
    ['course with many sections', 'course.wlu.data.1.xml'],
    ['course with few sections', 'course.wlu.data.2.xml'],
    ['course with no sections', 'course.wlu.data.3.xml'],
  ])('parses a %s correctly', async (desc, filename) => {
    const xml = await readFile(path.join(__dirname, '__data__', filename));
    const result = await parseXMLCourse(xml);
    const str = util.inspect(result, {
      depth: 10,
      maxArrayLength: Infinity,
      sorted: true,
    });
    expect(str).toMatchSnapshot();
  });
});
