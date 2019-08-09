const x = require('x-ray')();
const { promisify } = require('../utils/parseUtils');

const parseDisclaimer = html =>
  promisify(
    x(html, '#content', {
      title: 'h1',
      subtitle: '.calsect1 h2',
      body: ['.calsect1 .calsect1-content > p'],
    }).then(({ title, subtitle, body }) => ({
      title: title && subtitle ? `${title}: ${subtitle}` : undefined,
      description:
        body && body.length
          ? body
              .filter(line => line)
              .map(line =>
                line
                  .replace('\n', '')
                  .replace(/\s+/g, ' ')
                  .trim(),
              )
              .join('\n')
          : undefined,
    })),
  );

module.exports = { parseDisclaimer };
