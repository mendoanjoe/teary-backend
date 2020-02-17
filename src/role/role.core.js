const roleErrors = require('./role.errors');
const roleStorage = require('./role.storage');
const userStorage = require('./../user/user.storage');

function assignRoleToUser(Module = {}) {
  const { role, user } = Module;

  const ret = async (attributes = {}) => {
    const { roleId, userId } = attributes;

    const userRetrieval = await user.storage.findById(userId, { raw: true });
    if (!userRetrieval) {
      return false;
    }

    const roleRetrieval = await role.storage.getRoleById(roleId);
    if (!roleRetrieval) {
      return false;
    }

    const userUpdation = await user.storage.updateUserById(userId, {
      ...userRetrieval,

      role_id: roleId,
    });

    return {
      user: userUpdation[1],
      role: roleRetrieval,
    };
  };

  return ret;
}

function createRole(Module = {}) {
  const { role } = Module;

  const ret = async (attributes = {}) => {
    const { deletable, name, rules } = attributes;
    const roleCreation = await role.storage.createRole({ deletable, name, rules });

    return roleCreation;
  };

  return ret;
}

function deleteRoleById(Module = {}) {
  const { role } = Module;

  const ret = async id => {
    const roleDeletion = await role.storage.deleteRoleById(id);

    return roleDeletion;
  };

  return ret;
}

function getRoleById(Module = {}) {
  const { role } = Module;

  const ret = async id => {
    const roleRetrieval = await role.storage.getRoleById(id);

    return roleRetrieval;
  };

  return ret;
}

function getRoleByName(Module = {}) {
  const { role } = Module;

  const ret = async name => {
    const roleRetrieval = await role.storage.getRoleByName(name);

    return roleRetrieval;
  };

  return ret;
}

function getDefaultRole(Module = {}) {
  const ret = async () => {
    const roleRetrieval = await getRoleByName(Module)('Default');

    return roleRetrieval;
  };

  return ret;
}

function getListRole(Module = {}) {
  const { role } = Module;

  const ret = async (ctx, attributes = {}) => {
    const roleList = await role.storage.paginate(ctx, attributes);

    return roleList;
  };

  return ret;
}

function isRoleDeletable(Module = {}) {
  const { role } = Module;

  const ret = async id => {
    const roleRetrieval = await role.storage.getRoleById(id);

    if (!roleRetrieval) {
      return role.errors.ROLE_NOT_EXISTS;
    }

    if (!roleRetrieval.deletable) {
      return role.errors.ROLE_NOT_DELETABLE;
    }

    return role.errors.ROLE_DELETABLE;
  };

  return ret;
}

function updateRoleById(Module = {}) {
  const { role } = Module;

  const ret = async (attributes = {}) => {
    const { id } = attributes;
    const roleUpdation = await role.storage.updateRoleById(id, attributes);

    return roleUpdation[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    role: {
      errors: roleErrors,
      storage: roleStorage.attach(attachment),
    },
    user: { storage: userStorage.attach(attachment) },
  };

  const functions = [
    assignRoleToUser,
    createRole,
    deleteRoleById,
    getRoleById,
    getDefaultRole,
    getListRole,
    getRoleByName,
    isRoleDeletable,
    updateRoleById,
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
