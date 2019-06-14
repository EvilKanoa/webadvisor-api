const cheerio = require('cheerio');

const parseDescription = (html, code) => {
  const dom = cheerio.load(html, { normalizeWhitespace: true });
  const node = dom('#main > .container > #content > .course > table')
    .filter((i, el) =>
      cheerio(el)
        .attr('summary')
        .startsWith(code),
    )
    .first();
  return node
    ? dom('tbody > tr.description > td', node)
        .text()
        .replace(/[\s]+/gm, ' ')
    : '';
};

module.exports = { parseDescription };
