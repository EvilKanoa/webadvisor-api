module.exports = {
    env: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 3001,
    mongodb: process.env.MONGODB || process.env.MONGODB_URI || 'mongodb://localhost:27017/webadvisor-api',
    redis: process.env.REDIS || process.env.REDIS_URL || 'redis://localhost:6379',
};
