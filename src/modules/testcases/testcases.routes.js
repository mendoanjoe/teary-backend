const router = require('koa-router')();

let presenter = require('./testcases.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/testcases');

  router.get('/', presenter.GetTestcaseList);
  router.post('/', presenter.CreateTestcase);
  router.get('/:testcaseId', presenter.GetTestcaseById);
  router.put('/:testcaseId', presenter.UpdateTestcaseById);
  router.delete('/:testcaseId', presenter.DeleteTestcaseById);

  return router;
}

module.exports = {
  attach,
};
