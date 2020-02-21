const router = require('koa-router')();

let presenter = require('./roles.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/roles');

  router.get('/', presenter.GetList);
  router.post('/', presenter.Create);
  router.get('/:id', presenter.GetById);
  router.put('/:id', presenter.UpdateById);
  router.delete('/:id', presenter.DeleteById);
  router.post('/assign', presenter.AssignRoleToUser);

  return router;
}

module.exports = {
  attach,
};
