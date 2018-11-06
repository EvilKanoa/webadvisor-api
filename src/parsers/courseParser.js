const cheerio = require('cheerio');

const COURSE_TABLE_SELECTOR = '#GROUP_Grp_WSS_COURSE_SECTIONS > table > tbody';
const COURSE_TITLE_REGEX = /^([A-Z]{2,4})\*([0-9]{1,4})\*([0-9a-zA-Z]{1,6})\s+\([0-9]{1,4}\)\s+(.+)$/m;
const COURSE_SLOTS_REGEX = /^([0-9]+)\s*\/\s*([0-9]+)$/m;
const COURSE_MEET_REGEX = /^[^A-Z]+([A-Z]+)\s([^0-9]+)([^-]+)\s-\s([^,]+),\s(.*)$/mi;
const COURSE_DAY_MAP = {
    'Mon': 'monday',
    'Tues': 'tuesday',
    'Wed': 'wednesday',
    'Thur': 'thursday',
    'Fri': 'friday',
    'Sat': 'saturday',
    'Sun': 'sunday'
};

const parseCourses = async (html) => {
    const dom = cheerio.load(html);
    const table = dom(COURSE_TABLE_SELECTOR);
    const courseMap = new Map();

    table.children().each((idx, node) => {
        if (idx >= 2) {
            try {
                insertRawCourse(courseMap, parseRawCourse(node, dom));
            } catch (err) {
                console.error('Error while parsing course: ');
                console.error(dom(node).html());
                console.error(err);
            }
        }
    });

    return [ ...courseMap.values() ];
};

const parseRawCourse = (node, dom) => {
    const text = (selector) => dom(selector, node).text().trim();

    const title = COURSE_TITLE_REGEX.exec(text('.SEC_SHORT_TITLE > div > a').trim());
    const slots = COURSE_SLOTS_REGEX.exec(text('.LIST_VAR5 > div > p').trim());

    const meetings = [];
    dom('.SEC_MEETING_INFO > div > p', node).text().split('\n').forEach((sec) => {
        if (!sec || !sec.length) return;
        sec = sec.trim();

        const data = COURSE_MEET_REGEX.exec(sec);
        if (!data || data.length !== 6) return;

        const days = data[2].split(',');
        const type = data[1].trim();
        const start = convert12to24(data[3].trim());
        const end = convert12to24(data[4].trim());
        const location = data[5].trim();

        meetings.push(...days.map((badDay) => ({
            type,
            day: COURSE_DAY_MAP[badDay.trim()],
            start,
            end,
            location
        })));
    });

    return {
        code: `${title[1]}*${title[2]}`,
        name: title[4],
        credits: text('.SEC_MIN_CRED > div > p'),
        location: text('.SEC_LOCATION > div > p'),
        level: text('.SEC_ACAD_LEVEL > div > p'),
        section: {
            sectionId: title[3],
            faculty: text('.SEC_FACULTY_INFO > div > p'),
            available: parseInt(slots[1], 10),
            capacity: parseInt(slots[2], 10),
            status: text('.LIST_VAR1 > div > p'),
            meetings
        }
    };
};

const insertRawCourse = (courseMap, rawCourse) => {
    if (!rawCourse) return;

    if (courseMap.has(rawCourse.code)) {
        courseMap.get(rawCourse.code).sections.push(rawCourse.section);
    } else {
        const course = {
            ...rawCourse,
            sections: [rawCourse.section]
        };
        delete course.section;
        courseMap.set(course.code, course);
    }
};

const convert12to24 = (time) => {
    let value = time.replace(/[^0-9]*/g, '');
    if (time.toLowerCase().endsWith('pm') && !value.startsWith('12')) {
        value = '' + (parseInt(value, 10) + 1200);
    } else if (time.toLowerCase().endsWith('am') && value.startsWith('12')) {
        value = '' + (parseInt(value, 10) - 1200);
    }
    value = value.padStart(4, '0');

    return `${value.slice(0, 2)}:${value.slice(2, 4)}`;
};

module.exports = {
    parseCourses
};
