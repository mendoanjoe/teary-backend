const httpStatus = require('http-status-codes');
const router = require('koa-router')();

const auth = require('./modules/auth');
const assignments = require('./modules/assignments');
const files = require('./modules/files');
const problems = require('./modules/problems');
const roles = require('./modules/roles');
const submissions = require('./modules/submissions');
const testcases = require('./modules/testcases');
const users = require('./modules/users');

function attach(attachment = {}) {
  const authRouter = auth.routes.attach(attachment);
  const assignmentsRouter = assignments.routes.attach(attachment);
  const filesRouter = files.routes.attach(attachment);
  const problemsRouter = problems.routes.attach(attachment);
  const rolesRouter = roles.routes.attach(attachment);
  const submissionsRouter = submissions.routes.attach(attachment);
  const testcasesRouter = testcases.routes.attach(attachment);
  const usersRouter = users.routes.attach(attachment);

  router.prefix('/v1');

  router.use(authRouter.routes(), authRouter.allowedMethods());
  router.use(assignmentsRouter.routes(), assignmentsRouter.allowedMethods());
  router.use(filesRouter.routes(), filesRouter.allowedMethods());
  router.use(problemsRouter.routes(), problemsRouter.allowedMethods());
  router.use(rolesRouter.routes(), rolesRouter.allowedMethods());
  router.use(submissionsRouter.routes(), submissionsRouter.allowedMethods());
  router.use(testcasesRouter.routes(), testcasesRouter.allowedMethods());
  router.use(usersRouter.routes(), usersRouter.allowedMethods());

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
