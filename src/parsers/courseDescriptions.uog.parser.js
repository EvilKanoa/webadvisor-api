const { promisify, getXray } = require('../utils/parseUtils');

const x = getXray();

const parseCourseDescriptions = html =>
  promisify(
    x(html, '#main .container', {
      description: x('#content .calsect1 .calsect2', [
        {
          title: 'h3 | trim',
          body: ['p | trim | cleanSpaces | removeNewlines'],
        },
      ]),
      sections: x('#sidebar .subnav > ul:nth-of-type(2) > li', [
        {
          title: 'a | trim',
          link: 'a@href',
        },
      ]),
    }).then(({ description, sections }) => ({
      description:
        description && description.length
          ? description.map(({ title, body }) => ({
              title: title && title.length ? title : undefined,
              description:
                body && body.length
                  ? body.filter(line => line && line.length).join('\n')
                  : undefined,
            }))
          : undefined,
      sections:
        sections && sections.length
          ? sections.map(({ title, link }) => {
              const match = link.match(/c12([^.]+).shtml/i);
              return {
                title: title && title.length ? title : undefined,
                code:
                  match && match[1] && match[1].length
                    ? match[1].toUpperCase()
                    : undefined,
              };
            })
          : undefined,
    })),
  );

module.exports = { parseCourseDescriptions };
