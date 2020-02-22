const router = require('koa-router')();

let presenter = require('./assignments.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/assignments');

  router.get('/', presenter.GetAssignmentList);
  router.post('/', presenter.CreateAssignment);
  router.get('/:assignmentId', presenter.GetAssignmentById);
  router.put('/:assignmentId', presenter.UpdateAssignmentById);
  router.delete('/:assignmentId', presenter.DeleteAssignmentById);

  return router;
}

module.exports = {
  attach,
};
