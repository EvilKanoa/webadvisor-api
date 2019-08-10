const { promisify, getXray } = require('../utils/parseUtils');

const x = getXray();

const parseDisclaimer = html =>
  promisify(
    x(html, '#content', {
      title: 'h1',
      subtitle: '.calsect1 h2',
      body: [
        '.calsect1 .calsect1-content > p | trim | cleanSpaces | removeNewlines',
      ],
    }).then(({ title, subtitle, body }) => ({
      title: title && subtitle ? `${title}: ${subtitle}` : undefined,
      description:
        body && body.length
          ? body.filter(line => line && line.length).join('\n')
          : undefined,
    })),
  );

module.exports = { parseDisclaimer };
