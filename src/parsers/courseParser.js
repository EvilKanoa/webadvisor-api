const cheerio = require('cheerio');

const parseCourses = async (html) => {
    const dom = cheerio.load(html);
    const courseMap = new Map();
};

const insertRawCourse = (courseMap, rawCourse) => {
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

module.exports = {
    parseCourses
};
