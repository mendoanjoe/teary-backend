const rolesErrors = require('./roles.errors');
const rolesStorage = require('./roles.storage');
const usersStorage = require('./../users/users.storage');

function assignRoleToUser(Module = {}) {
  const { roles, users } = Module;

  const ret = async (attributes = {}) => {
    const { roleId, userId } = attributes;

    const currentUser = await users.storage.findById(userId, { raw: true });
    if (!currentUser) {
      return false;
    }

    const role = await roles.storage.getRoleById(roleId);
    if (!role) {
      return false;
    }

    const user = await users.storage.updateUserById(userId, {
      ...currentUser,

      role_id: roleId,
    });

    return {
      user: user[1],
      role,
    };
  };

  return ret;
}

function createRole(Module = {}) {
  const { roles } = Module;

  const ret = async (attributes = {}) => {
    const { deletable, name, rules } = attributes;
    const role = await roles.storage.createRole({ deletable, name, rules });

    return role;
  };

  return ret;
}

function deleteRoleById(Module = {}) {
  const { roles } = Module;

  const ret = async id => {
    const role = await roles.storage.deleteRoleById(id);

    return role;
  };

  return ret;
}

function getRoleById(Module = {}) {
  const { roles } = Module;

  const ret = async id => {
    const role = await roles.storage.getRoleById(id);

    return role;
  };

  return ret;
}

function getRoleByName(Module = {}) {
  const { roles } = Module;

  const ret = async name => {
    const role = await roles.storage.getRoleByName(name);

    return role;
  };

  return ret;
}

function getDefaultRole(Module = {}) {
  const ret = async () => {
    const role = await getRoleByName(Module)('Default');

    return role;
  };

  return ret;
}

function getListRole(Module = {}) {
  const { roles } = Module;

  const ret = async (ctx, attributes = {}) => {
    const roleList = await roles.storage.paginate(ctx, attributes);

    return roleList;
  };

  return ret;
}

function isRoleDeletable(Module = {}) {
  const { roles } = Module;

  const ret = async id => {
    const role = await roles.storage.getRoleById(id);

    if (!role) {
      return roles.errors.ROLE_NOT_EXISTS;
    }

    if (!role.deletable) {
      return roles.errors.ROLE_NOT_DELETABLE;
    }

    return roles.errors.ROLE_DELETABLE;
  };

  return ret;
}

function updateRoleById(Module = {}) {
  const { roles } = Module;

  const ret = async (attributes = {}) => {
    const { id } = attributes;
    const role = await roles.storage.updateRoleById(id, attributes);

    return role[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    roles: {
      errors: rolesErrors,
      storage: rolesStorage.attach(attachment),
    },
    users: { storage: usersStorage.attach(attachment) },
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
