const bcrypt = require('bcryptjs');

const usersCore = require('./../users/users.core');

function authenticateUser(Module = {}) {
  const { users } = Module;

  const ret = async (attributes = {}) => {
    const { email, password } = attributes;

    const userdata = await users.core.findUserByEmail(email);

    if (!userdata) {
      return false;
    }

    if (userdata.password === null) {
      return false;
    }

    if (!bcrypt.compareSync(password, userdata.password)) {
      return false;
    }

    return userdata;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    users: { core: usersCore.attach(attachment) },
  };

  const functions = [authenticateUser];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
