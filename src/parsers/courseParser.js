const cheerio = require('cheerio');

const parseCourses = async (html) => {
    const dom = cheerio.load(html);
};

module.exports = {
    parseCourses,
};
