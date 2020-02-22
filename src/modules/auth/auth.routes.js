const httpStatus = require('http-status-codes');
const router = require('koa-router')();

let presenter = require('./auth.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/auth');

  router.post('/login', presenter.Login);
  router.post('/logout', presenter.Logout);
  router.post('/register', presenter.Register);

  // eslint-disable-next-line consistent-return
  router.get('/login::options', async (ctx, next) => {
    switch (ctx.params.options) {
      case 'google':
        return presenter.Google(ctx);
      default:
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = {
          code: httpStatus.NOT_FOUND,
          message: 'login method does not exists',
          ok: false,
        };
    }

    await next();
  });

  return router;
}

module.exports = {
  attach,
};
