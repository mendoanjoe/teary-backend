const pagination = require('./../../helper/pagination');

function createRole(Module = {}) {
  const { role } = Module;

  const ret = async (attributes = {}) => {
    const roleCreation = await role.model.create(attributes);

    return roleCreation;
  };

  return ret;
}

function deleteRoleById(Module = {}) {
  const { role } = Module;

  const ret = async id => {
    const roleDeletion = await role.model.destroy({ where: { id } });

    return roleDeletion;
  };

  return ret;
}

function getRoleById(Module = {}) {
  const { role } = Module;

  const ret = async id => {
    const roleRetrieval = await role.model.findOne({ where: { id } });

    return roleRetrieval;
  };

  return ret;
}

function getRoleByName(Module = {}) {
  const { role } = Module;

  const ret = async name => {
    const roleRetrieval = await role.model.findOne({ where: { name } });

    return roleRetrieval;
  };

  return ret;
}

function paginate(Module = {}) {
  const { role } = Module;

  const ret = async (ctx, attributes = {}) => {
    const roleList = await role.helper.paginate(ctx, attributes);

    return roleList;
  };

  return ret;
}

function updateRoleById(Module = {}) {
  const { role } = Module;

  const ret = async (id, attributes = {}) => {
    const roleUpdation = await role.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return roleUpdation;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    role: {
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
