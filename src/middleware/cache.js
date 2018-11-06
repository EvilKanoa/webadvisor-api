const cache = require('memory-cache');

const getKeyFromReq = (req) => '__express_cache__' + (req.originalUrl || req.url);

module.exports = {
    cache: (timeout) => (req, res, next) => {
        const key = getKeyFromReq(req);
        if (key === '__express_cache__') {
            return next();
        }

        const cached = cache.get(key);
        if (cached) {
            res.send(cached);
        } else {
            res.ogSend = res.send;
            res.send = (body) => {
                cache.put(key, body, timeout * 1000);
                res.ogSend(body);
            };
            return next();
        }
    },
    put: (key, body, timeout) => cache.put(key, body, timeout * 1000),
    putFromReq: (req, body, timeout) => cache.put(getKeyFromReq(req), body, timeout * 1000),
    get: (key) => cache.get(key),
    getKeyFromReq,
};