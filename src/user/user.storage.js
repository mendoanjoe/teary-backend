const pagination = require('./../../helper/pagination');

function createUser(Module = {}) {
  const { user } = Module;

  const ret = async (attributes = {}) => {
    const userCreation = await user.model.create(attributes);

    return userCreation;
  };

  return ret;
}

function deleteUserById(Module = {}) {
  const { user } = Module;

  const ret = async id => {
    const userDeletion = await user.model.destroy({ where: { id } });

    return userDeletion;
  };

  return ret;
}

function findByEmail(Module = {}) {
  const { user } = Module;

  const ret = async email => {
    const userRetrieval = await user.model.findOne({ where: { email } });

    return userRetrieval;
  };

  return ret;
}

function findById(Module = {}) {
  const { user } = Module;

  const ret = async id => {
    const userRetrieval = await user.model.findOne({ where: { id } });

    return userRetrieval;
  };

  return ret;
}

function paginate(Module = {}) {
  const { user } = Module;

  const ret = async (ctx, attributes = {}) => {
    const userList = await user.helper.paginate(ctx, attributes);

    return userList;
  };

  return ret;
}

function updateByEmail(Module = {}) {
  const { user } = Module;

  const ret = async (email, attributes = {}) => {
    const userUpdation = await user.model.update(attributes, {
      where: { email },
      returning: true,
      plain: true,
    });

    return userUpdation;
  };

  return ret;
}

function updateUserById(Module = {}) {
  const { user } = Module;

  const ret = async (id, attributes = {}) => {
    const userUpdation = await user.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return userUpdation;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    user: {
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
