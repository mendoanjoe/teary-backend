const router = require('koa-router')();

let presenter = require('./users.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/users');

  router.get('/', presenter.GetListUser);
  router.post('/', presenter.CreateUser);
  router.get('/:userId', presenter.GetUserById);
  router.put('/:userId', presenter.UpdateUser);
  router.delete('/:userId', presenter.DeleteUserById);

  return router;
}

module.exports = {
  attach,
};
