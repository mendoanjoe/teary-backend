const router = require('koa-router')();

let presenter = require('./problems.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/problems');

  router.get('/', presenter.GetProblemList);
  router.post('/', presenter.CreateProblem);
  router.get('/:problemId', presenter.GetProblemById);
  router.put('/:problemId', presenter.UpdateProblemById);
  router.delete('/:problemId', presenter.DeleteProblemById);

  return router;
}

module.exports = {
  attach,
};
