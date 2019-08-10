const { promisify, getXray } = require('../utils/parseUtils');

const TITLE_REGEX = /(?<code>[^\s]+)\s+(?<title>.*?)\s+(?<semesters>(([SWFU]|P1|P2|P3|P4)(,|-))*([SWFU]|P1|P2|P3|P4))\s+(\((?<lectureHours>[^-]+)-(?<labHours>[^-]+)\)\s+)*?\[(?<credits>[0-9.]+)\]/;
const x = getXray();

const parseCourseDescriptionSection = html =>
  promisify(
    x(html, '#main .container .content', {
      details: x(['p | trim | cleanSpaces | removeNewlines']),
      courses: x('.course', [
        {
          title: 'tr.title > th | trim | cleanSpaces | removeNewlines',
          description: 'tr.description > td | trim | cleanSpaces',
          offering: 'tr.offerings > td | trim | cleanSpaces',
          restriction: 'tr.restrictions > td | trim | cleanSpaces',
          prerequisite: 'tr.prereqs > td | trim | cleanSpaces',
          department: 'tr.departments > td | trim | cleanSpaces',
          equate: 'tr.equates > td | trim | cleanSpaces',
        },
      ]),
    }).then(({ details, courses }) => ({
      details:
        details && details.length
          ? details.filter(line => line && line.length).join('\n')
          : undefined,
      courses: courses.map(({ title, ...course }) => {
        const match = title.match(TITLE_REGEX) || { groups: {} };

        if (Object.keys(match.groups).length === 0) {
          console.log(title);
        }

        return {
          title: match.groups.title,
          code: match.groups.code,
          semesters: [
            ...new Set(
              (match.groups.semesters || '')
                .split(/[,-]/)
                .filter(s => s && s.length),
            ),
          ],
          lectureHours: match.groups.lectureHours,
          labHours: match.groups.labHours,
          credits: match.groups.credits,
          ...course,
        };
      }),
    })),
  );

module.exports = { parseCourseDescriptionSection };
