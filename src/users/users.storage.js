const pagination = require('../../helper/pagination');

function createUser(Module = {}) {
  const { users } = Module;

  const ret = async (attributes = {}) => {
    const user = await users.model.create(attributes);

    return user;
  };

  return ret;
}

function deleteUserById(Module = {}) {
  const { users } = Module;

  const ret = async id => {
    const user = await users.model.destroy({ where: { id } });

    return user;
  };

  return ret;
}

function findByEmail(Module = {}) {
  const { users } = Module;

  const ret = async email => {
    const user = await users.model.findOne({ where: { email } });

    return user;
  };

  return ret;
}

function findById(Module = {}) {
  const { users } = Module;

  const ret = async id => {
    const user = await users.model.findOne({ where: { id } });

    return user;
  };

  return ret;
}

function paginate(Module = {}) {
  const { users } = Module;

  const ret = async (ctx, attributes = {}) => {
    const userList = await users.helper.paginate(ctx, attributes);

    return userList;
  };

  return ret;
}

function updateByEmail(Module = {}) {
  const { users } = Module;

  const ret = async (email, attributes = {}) => {
    const user = await users.model.update(attributes, {
      where: { email },
      returning: true,
      plain: true,
    });

    return user;
  };

  return ret;
}

function updateUserById(Module = {}) {
  const { users } = Module;

  const ret = async (id, attributes = {}) => {
    const user = await users.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return user;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    users: {
      helper: { paginate: pagination.attach(attachment) },
      model: attachment.db.postgres.models.users,
    },
  };

  const functions = [
    createUser,
    deleteUserById,
    findByEmail,
    findById,
    paginate,
    updateUserById,
    updateByEmail,
  ];

  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
