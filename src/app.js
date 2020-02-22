const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const json = require('koa-json');
const Koa = require('koa');
const koaQs = require('koa-qs');
const koaLogger = require('koa-logger');

const db = require('./../db');
const routes = require('./routes');

const logger = require('./../lib/logger');
const minio = require('./../lib/minio');
const redis = require('./../lib/redis');
const sendgrid = require('./../lib/sendgrid');

const errorHandler = require('./../middleware/error');
const jwt = require('./../middleware/jwt');
const role = require('./../middleware/role');

function verifyOrigin(trustedOrigins) {
  const ret = ctx => {
    const { origin } = ctx.headers;

    return trustedOrigins.indexOf(origin) !== -1 ? origin : false;
  };

  return ret;
}

function setup(env) {
  const app = new Koa();
  koaQs(app);

  app.use(helmet());

  const trustedOrigins = [`http://localhost:${env.PORT}`];
  if (env.FRONTEND_CROSS_ORIGIN_URL) {
    trustedOrigins.push(env.FRONTEND_CROSS_ORIGIN_URL);
  }

  app.use(cors({ origin: verifyOrigin(trustedOrigins) }));

  app.use(bodyParser({ enableTypes: ['json', 'form'] }));
  app.use(json());

  if (env.NODE_ENV !== 'production') {
    app.use(koaLogger());
  }

  app.use(errorHandler);

  const attachment = {
    app,
    env,

    db: db.init(env),

    logger: logger(env),
    minio: minio.init(env),
    redis: redis.connect(env),
    sendgrid: sendgrid.init(env),
  };

  const router = routes.attach(attachment);

  app.use(role.attach(attachment));
  app.use(jwt.privateURL());

  app.use(router.routes(), router.allowedMethods());

  app.onListening = async () => {};

  return { app, attachment };
}

module.exports = {
  setup,
};
