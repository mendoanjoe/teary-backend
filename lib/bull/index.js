// const email = require('./email');
// const notification = require('./notification');

function connect(env) {
  const options = {
    redis: {
      host: env.REDIS_HOST,
      password: env.REDIS_PASSWORD,
      port: env.REDIS_PORT,
    },
  };

  if (env.REDIS_SENTINEL === 'true') {
    options.redis = {
      name: env.REDIS_SENTINEL_MASTER_NAME,
      sentinels: [
        {
          host: env.REDIS_SENTINEL_HOST,
          port: env.REDIS_SENTINEL_PORT,
        },
      ],
    };
  }

  const queues = [];
  const ret = {};

  queues.forEach(queue => {
    const fn = queue.init(options);

    ret[`${fn.name}Queue`] = fn.instance;
    ret[`${fn.name}QueueAction`] = fn.actions;
  });

  return ret;
}

module.exports = {
  connect,
};
