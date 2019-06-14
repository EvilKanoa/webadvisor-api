const cheerio = require('cheerio');

const CODE_DASH_REGEX = /[^a-z0-9]+/gi;

const parseXMLSearch = xml => {
  const dom = cheerio.load(xml, { xmlMode: true });
  const count = parseInt(dom('add_suggest').text(), 10);

  return dom('add_suggest > results > rs')
    .map((i, el) =>
      i < count
        ? cheerio(el)
            .text()
            .replace(CODE_DASH_REGEX, '-')
        : undefined,
    )
    .get();
};

module.exports = { parseXMLSearch };
