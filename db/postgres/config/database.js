const path = require('path');

const logger = require('./logger');

require('dotenv').config({
  path: path.resolve('./', '.env'),
});

const { env } = process;
const winston = logger(env.NODE_ENV);

const defaultConfig = (slug = null) => ({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,

  database: env.POSTGRES_DATABASE + (typeof slug === 'string' ? `_${slug}` : ''),
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,

  dialect: 'postgres',
  logging: msg => winston.info(msg),

  query: { raw: true },
});

module.exports = {
  development: {
    ...defaultConfig('development'),
  },
  production: {
    ...defaultConfig(),
  },
  test: {
    ...defaultConfig('test'),
  },
};
