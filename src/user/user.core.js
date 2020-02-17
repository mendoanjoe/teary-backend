const bcrypt = require('bcryptjs');
// const uuid = require('uuid/v4');

const roleStorage = require('./../role/role.storage');
const userStorage = require('./user.storage');

function createUser(Module = {}) {
  const { attachment, role, user } = Module;
  const { env } = attachment;

  const ret = async (attributes = {}) => {
    const { email, name, nim, password } = attributes;
    let hash = null;

    if (password !== null) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    const defaultRole = await role.storage.getRoleByName('Default');
    if (!defaultRole) {
      return false;
    }

    const userCreation = await user.storage.createUser({
      nim,
      email,
      name,

      bucket_name: env.MINIO_USER_BUCKET_NAME,
      password: hash,
      role_id: defaultRole.id,
    });

    if (!userCreation) {
      return false;
    }

    return userCreation.dataValues;
  };

  return ret;
}

function deleteUserById(Module = {}) {
  const { user } = Module;

  const ret = async id => {
    const userDeletion = await user.storage.deleteUserById(id);

    return userDeletion;
  };

  return ret;
}

function findUserByEmail(Module = {}) {
  const { user } = Module;

  const ret = async email => {
    const userRetrieval = await user.storage.findByEmail(email);

    return userRetrieval;
  };

  return ret;
}

function findUserById(Module = {}) {
  const { user } = Module;

  const ret = async id => {
    const userRetrieval = await user.storage.findById(id);

    return userRetrieval;
  };

  return ret;
}

function getListUser(Module = {}) {
  const { user } = Module;

  const ret = async (ctx, attributes = {}) => {
    const userList = await user.storage.paginate(ctx, attributes);

    return userList;
  };

  return ret;
}

function isEmailRegistered(Module = {}) {
  const { user } = Module;

  const ret = async email => {
    const userRetrieval = await user.storage.findByEmail(email);

    return !!userRetrieval;
  };

  return ret;
}

function updateUser(Module = {}) {
  const { user } = Module;

  const ret = async (attributes = {}) => {
    const { id, password } = attributes;

    let hash = null;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    const data = attributes;
    if (hash !== null) {
      data.password = hash;
    }

    const userUpdation = await user.storage.updateUserById(id, data);

    return userUpdation[1];
  };

  return ret;
}

function updateUserByEmail(Module = {}) {
  const { user } = Module;

  const ret = async (email, attributes = {}) => {
    const { password } = attributes;
    let hash = null;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    const data = attributes;
    if (hash !== null) {
      data.password = hash;
    }

    const userUpdation = await user.storage.updateByEmail(email, data);

    return userUpdation[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    role: { storage: roleStorage.attach(attachment) },
    user: { storage: userStorage.attach(attachment) },
  };

  const functions = [
    createUser,
    deleteUserById,
    findUserByEmail,
    findUserById,
    getListUser,
    isEmailRegistered,
    updateUser,
    updateUserByEmail,
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
