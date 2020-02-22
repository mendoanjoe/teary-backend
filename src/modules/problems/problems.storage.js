const pagination = require('../../../helper/pagination');

function create(Module = {}) {
  const { problems } = Module;

  const ret = async (attributes = {}) => {
    const problem = await problems.model.create(attributes);

    return problem;
  };

  return ret;
}

function deleteById(Module = {}) {
  const { problems } = Module;

  const ret = async id => {
    const problem = await problems.model.destroy({ where: { id } });

    return problem;
  };

  return ret;
}

function getById(Module = {}) {
  const { problems } = Module;

  const ret = async id => {
    const problem = await problems.model.findOne({ where: { id } });

    return problem;
  };

  return ret;
}

function paginate(Module = {}) {
  const { problems } = Module;

  const ret = async (ctx, attributes = {}) => {
    const problemList = await problems.helper.paginate(ctx, attributes);

    return problemList;
  };

  return ret;
}

function updateById(Module = {}) {
  const { problems } = Module;

  const ret = async (id, attributes = {}) => {
    const problem = await problems.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return problem;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    problems: {
      helper: { paginate: pagination.attach(attachment) },
      model: attachment.db.postgres.models.problems,
    },
  };

  const functions = [create, deleteById, getById, paginate, updateById];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
