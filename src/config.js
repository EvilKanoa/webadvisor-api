const option = (origins, fallback) => {
  origins = Array.isArray(origins) ? origins : [origins];
  const key = origins.find(key => process.env[key]);
  return key ? process.env[key] : fallback;
};

module.exports = {
  env: option('NODE_ENV', 'production'),
  port: option('PORT', 3001),
  mongodb: option(['MONGODB', 'MONGODB_URI'], 'mongodb://localhost:27017/webadvisor-api'),
  redis: option(['REDIS', 'REDIS_URL'], 'redis://localhost:6379'),
};
