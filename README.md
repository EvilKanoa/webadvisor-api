# webadvisor-api [![Build status](https://img.shields.io/travis/com/EvilKanoa/webadvisor-api.svg)](https://travis-ci.com/EvilKanoa/webadvisor-api) ![License](https://img.shields.io/badge/license-GPL-blue.svg?style=flat) ![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/EvilKanoa/webadvisor-api.svg)

### Developing
Ensure you're running on a supported NodeJS version (10 or newer) and have `yarn` installed.
Then, copy the `.env.sample` file to `.env` and configure for your system.
Afterwards run `yarn` to install dependencies.

To run a development server simply run `yarn dev` and a `nodemon` based dev server will start.
This server is ran in watch mode so any changes you make will cause it to refresh instantly.

To test your code run `yarn testing`.
This will launch jest in watch mode so any changes to your code or tests will cause the tests to be re-ran.

### Deploying
A live version of this project is currently hosted on [Heroku](https://webadvisor-api.herokuapp.com/graphql).
If you would like to host your own version, feel free.

To run your own server, clone this repo and then run`yarn install --production` to build and install the required dependencies, after which a production ready server can be started using `yarn prod`

### Contributing
Contributions are always very welcome.
This is currently a single student's project and I encourage others to jump on if they want to add features or even fix up minor bugs.
To contribute, just open a pull request with your changes.
Opened PRs must confirm to `prettier`'s style as well as pass the code coverage thresholds.

### Documentation
Since this project provides a simple GraphQL based API, most documentation can be found by browsing GraphiQL's schema explorer.
This is available on the live version or any version you deploy.
Farther documentation may be added in the future or if a particular item is requested, but the project owner feels that the schema documentation is sufficient for the majority of use cases.
