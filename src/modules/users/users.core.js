const bcrypt = require('bcryptjs');

const rolesStorage = require('./../roles/roles.storage');
const usersStorage = require('./users.storage');

function createUser(Module = {}) {
  const { attachment, roles, users } = Module;
  const { env } = attachment;

  const ret = async (attributes = {}) => {
    const { email, name, nim, password } = attributes;
    let hash = null;

    if (password !== null) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    const defaultRole = await roles.storage.getRoleByName('Default');
    if (!defaultRole) {
      return false;
    }

    const user = await users.storage.createUser({
      nim,
      email,
      name,

      bucket_name: env.MINIO_USER_BUCKET_NAME,
      password: hash,
      role_id: defaultRole.id,
    });

    if (!user) {
      return false;
    }

    return user.dataValues;
  };

  return ret;
}

function deleteUserById(Module = {}) {
  const { users } = Module;

  const ret = async id => {
    const user = await users.storage.deleteUserById(id);

    return user;
  };

  return ret;
}

function findUserByEmail(Module = {}) {
  const { users } = Module;

  const ret = async email => {
    const user = await users.storage.findByEmail(email);

    return user;
  };

  return ret;
}

function findUserById(Module = {}) {
  const { users } = Module;

  const ret = async id => {
    const user = await users.storage.findById(id);

    return user;
  };

  return ret;
}

function getUserById(Module = {}) {
  const { users } = Module;

  const ret = async id => {
    const user = await users.storage.getById(id);

    return user;
  };

  return ret;
}

function getListUser(Module = {}) {
  const { users } = Module;

  const ret = async (ctx, attributes = {}) => {
    const userList = await users.storage.paginate(ctx, attributes);

    return userList;
  };

  return ret;
}

function isEmailRegistered(Module = {}) {
  const { users } = Module;

  const ret = async email => {
    const user = await users.storage.findByEmail(email);

    return !!user;
  };

  return ret;
}

function updateUser(Module = {}) {
  const { users } = Module;

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

    const user = await users.storage.updateUserById(id, data);

    return user[1];
  };

  return ret;
}

function updateUserByEmail(Module = {}) {
  const { users } = Module;

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

    const user = await users.storage.updateByEmail(email, data);

    return user[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    roles: { storage: rolesStorage.attach(attachment) },
    users: { storage: usersStorage.attach(attachment) },
  };

  const functions = [
    createUser,
    deleteUserById,
    findUserByEmail,
    findUserById,
    getListUser,
    getUserById,
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
