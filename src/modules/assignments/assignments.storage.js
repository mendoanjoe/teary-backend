const pagination = require('../../../helper/pagination');

function create(Module = {}) {
  const { assignments } = Module;

  const ret = async (attributes = {}) => {
    const user = await assignments.model.create(attributes);

    return user;
  };

  return ret;
}

function deleteById(Module = {}) {
  const { assignments } = Module;

  const ret = async id => {
    const assignment = await assignments.model.destroy({ where: { id } });

    return assignment;
  };

  return ret;
}

function getById(Module = {}) {
  const { assignments } = Module;

  const ret = async id => {
    const assignment = await assignments.model.findOne({ where: { id } });

    return assignment;
  };

  return ret;
}

function paginate(Module = {}) {
  const { assignments } = Module;

  const ret = async (ctx, attributes = {}) => {
    const assignmentList = await assignments.helper.paginate(ctx, attributes);

    return assignmentList;
  };

  return ret;
}

function updateById(Module = {}) {
  const { assignments } = Module;

  const ret = async (id, attributes = {}) => {
    const assignment = await assignments.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return assignment;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    assignments: {
      helper: { paginate: pagination.attach(attachment) },
      model: attachment.db.postgres.models.assignments,
    },
  };

  const functions = [
    create,
    deleteById,
    getById,
    paginate,
    updateById,
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
