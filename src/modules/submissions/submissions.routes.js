const router = require('koa-router')();

let presenter = require('./submissions.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/submissions');

  router.get('/', presenter.GetSubmissionList);
  router.post('/', presenter.CreateSubmission);
  router.get('/:submissionId', presenter.GetSubmissionById);
  router.put('/:submissionId', presenter.UpdateSubmissionById);
  router.delete('/:submissionId', presenter.DeleteSubmissionById);

  return router;
}

module.exports = {
  attach,
};
