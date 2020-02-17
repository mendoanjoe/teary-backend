const bluebird = require('bluebird');
const redis = require('redis');

function connect(env) {
  const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

  const host = REDIS_HOST;
  const port = REDIS_PORT;
  const password = REDIS_PASSWORD;

  bluebird.promisifyAll(redis);

  return redis.createClient({ host, port, password });
}

module.exports = {
  connect,
};
