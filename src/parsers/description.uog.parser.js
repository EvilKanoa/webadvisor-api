const cheerio = require('cheerio');

const parseDescription = (html, code) => {
  if (!html || !html.length || !code || !code.length) {
    return false;
  }

  const dom = cheerio.load(html, { normalizeWhitespace: true });
  const node = dom('#main > .container > #content > .course > table')
    .filter((i, el) =>
      cheerio(el)
        .attr('summary')
        .startsWith(code),
    )
    .first();
  return node && node.length
    ? dom('tbody > tr.description > td', node)
        .text()
        .replace(/[\s]+/gm, ' ')
        .trim()
    : '';
};

module.exports = { parseDescription };
