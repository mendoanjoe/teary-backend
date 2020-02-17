const router = require('koa-router')();

let presenter = require('./user.presenter');

function attach(attachment = {}) {
  presenter = presenter.attach(attachment);

  router.prefix('/users');

  router.get('/', presenter.GetListUser);
  router.post('/', presenter.CreateUser);
  router.get('/:userId', presenter.GetUserById);
  router.put('/:userId', presenter.UpdateUser);
  router.delete('/:userId', presenter.DeleteUserById);
  // router.put('/:userId/password::change', presenter.ChangePasswordUser);

  return router;
}

module.exports = {
  attach,
};
