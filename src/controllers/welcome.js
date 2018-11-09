module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.send('Lightweight and simple RESTful JSON API for UoG WebAdvisor.');
        return next();
    });
};
