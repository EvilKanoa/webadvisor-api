const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { parseCourses } = require('../parsers/course.uog.parser');
const { sendRequest } = require('../utils/fetchUtils.uog');

const getStaticPath = term =>
  path.join(__dirname, 'static', 'courses', `${term.toUpperCase()}.json`);

const handler = async (req, res, next) => {
  // use a done flag to enable the heroku timeout workaround
  let done = false;
  res.set('Content-Type', 'application/json');
  res.writeHead(202);
  const keepAlive = () =>
    setTimeout(() => {
      if (!done) {
        res.write(' ');
        keepAlive();
      }
    }, 15000);
  keepAlive();

  try {
    const term = req.params.term.toUpperCase();
    const data = await parseCourses(await sendRequest(req.rp, { VAR1: term }));
    data.forEach(course => (course.term = term));

    // use fetched data if it's available, otherwise use static data
    if (data && data.length) {
      const json = JSON.stringify(data);
      res.write(json);
    } else if (
      !(await promisify(fs.access)(getStaticPath(term), fs.constants.R_OK))
    ) {
      console.log('Returning static files for term ' + term);
      done = true;
      fs.createReadStream(getStaticPath(term)).pipe(res);
      return next();
    }
  } catch (err) {
    console.error(err);
    res.write(
      JSON.stringify({
        status: 500,
        message: 'Failed to query WebAdvisor, is it down?',
        internalError: err,
      }),
    );
  }

  done = true;
  res.end();
  return next();
};

module.exports = app => {
  app.get('/courses/:term', handler);
};
