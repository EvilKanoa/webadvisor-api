const cheerio = require('cheerio');

const COURSE_DAY_MAP = {
  '0': 'saturday',
  '1': 'sunday',
  '2': 'monday',
  '3': 'tuesday',
  '4': 'wednesday',
  '5': 'thursday',
  '6': 'friday',
};

const parseXMLCourse = xml => {
  const dom = cheerio.load(xml, { xmlMode: true });
  const data = dom('addcourse > classdata > course');

  let credits;
  const location = dom('addcourse > classdata > campus')
    .map((i, el) => cheerio(el).attr('v'))
    .get()
    .join(', ');

  const sections = dom('> uselection', data)
    .map((i, el) => {
      const data = cheerio(el);

      if (credits === undefined) {
        credits = parseFloat(dom('> selection', data).attr('credits'));
      }

      let minAvailable = Number.MAX_SAFE_INTEGER;
      let minCapacity = Number.MAX_SAFE_INTEGER;

      const blocks = {};
      dom('> timeblock', data).each((i, el) => {
        const data = cheerio(el);

        const start = parseInt(data.attr('t1'), 10);
        const end = parseInt(data.attr('t2'), 10);

        blocks[data.attr('id')] = {
          day: COURSE_DAY_MAP[data.attr('day')],
          start: `${Math.floor(start / 60)}:${start % 60}`,
          end: `${Math.floor(end / 60)}:${end % 60}`,
        };
      });

      const meetings = dom('> selection > block', data).map((i, el) => {
        const data = cheerio(el);

        const type = data.attr('type').toUpperCase();
        const name = data.attr('disp');
        const available = parseInt(data.attr('os'), 10);
        const capacity = parseInt(data.attr('me'), 10);
        const location = data.attr('location');

        minAvailable = available < minAvailable ? available : minAvailable;
        minCapacity = capacity < minCapacity ? capacity : minCapacity;

        return data
          .attr('timeblockids')
          .split(',')
          .map(id => ({
            type,
            name,
            available,
            capacity,
            location,
            ...blocks[id],
          }));
      });

      return {
        id: data
          .attr('key')
          .split('_', 2)[1]
          .slice(0, -1),
        available: minAvailable === Number.MAX_SAFE_INTEGER ? undefined : minAvailable,
        capacity: minCapacity === Number.MAX_SAFE_INTEGER ? undefined : minCapacity,
        meetings,
      };
    })
    .get();

  return {
    code: data.attr('key'),
    name: data.attr('title'),
    description: cheerio(data.attr('desc')).text(),
    location,
    credits,
    sections,
  };
};

module.exports = {
  parseXMLCourse,
};
