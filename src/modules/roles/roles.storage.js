const pagination = require('./../../../helper/pagination');

function createRole(Module = {}) {
  const { roles } = Module;

  const ret = async (attributes = {}) => {
    const role = await roles.model.create(attributes);

    return role;
  };

  return ret;
}

function deleteRoleById(Module = {}) {
  const { roles } = Module;

  const ret = async id => {
    const role = await roles.model.destroy({ where: { id } });

    return role;
  };

  return ret;
}

function getRoleById(Module = {}) {
  const { roles } = Module;

  const ret = async id => {
    const role = await roles.model.findOne({ where: { id } });

    return role;
  };

  return ret;
}

function getRoleByName(Module = {}) {
  const { roles } = Module;

  const ret = async name => {
    const role = await roles.model.findOne({ where: { name } });

    return role;
  };

  return ret;
}

function paginate(Module = {}) {
  const { roles } = Module;

  const ret = async (ctx, attributes = {}) => {
    const roleList = await roles.helper.paginate(ctx, attributes);

    return roleList;
  };

  return ret;
}

function updateRoleById(Module = {}) {
  const { roles } = Module;

  const ret = async (id, attributes = {}) => {
    const role = await roles.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return role;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    roles: {
      helper: { paginate: pagination.attach(attachment) },
      model: attachment.db.postgres.models.roles,
    },
  };

  const functions = [
    createRole,
    deleteRoleById,
    getRoleById,
    getRoleByName,
    paginate,
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
