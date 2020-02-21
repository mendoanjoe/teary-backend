const httpStatus = require('http-status-codes');
const router = require('koa-router')();

const auth = require('./auth');
const users = require('./users');
const roles = require('./roles');
const files = require('./files');

function attach(attachment = {}) {
  const authRouter = auth.routes.attach(attachment);
  const rolesRouter = roles.routes.attach(attachment);
  const filesRouter = files.routes.attach(attachment);
  const usersRouter = users.routes.attach(attachment);

  router.prefix('/v1');

  router.use(authRouter.routes(), authRouter.allowedMethods());
  router.use(usersRouter.routes(), usersRouter.allowedMethods());
  router.use(rolesRouter.routes(), rolesRouter.allowedMethods());
  router.use(filesRouter.routes(), filesRouter.allowedMethods());

  router.get('/ping', async ctx => {
    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'pong',
      ok: true,
    };
  });

  router.all('*', async ctx => {
    ctx.status = httpStatus.NOT_FOUND;
    ctx.body = {
      code: httpStatus.NOT_FOUND,
      message: 'not found',
      ok: false,
    };
  });

  return router;
}

module.exports = {
  attach,
};
