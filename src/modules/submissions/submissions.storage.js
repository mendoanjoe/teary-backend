const pagination = require('../../../helper/pagination');

function create(Module = {}) {
  const { submissions } = Module;

  const ret = async (attributes = {}) => {
    const submission = await submissions.model.create(attributes);

    return submission;
  };

  return ret;
}

function deleteById(Module = {}) {
  const { submissions } = Module;

  const ret = async id => {
    const submission = await submissions.model.destroy({ where: { id } });

    return submission;
  };

  return ret;
}

function getById(Module = {}) {
  const { submissions } = Module;

  const ret = async id => {
    const submission = await submissions.model.findOne({ where: { id } });

    return submission;
  };

  return ret;
}

function paginate(Module = {}) {
  const { submissions } = Module;

  const ret = async (ctx, attributes = {}) => {
    const submissionList = await submissions.helper.paginate(ctx, attributes);

    return submissionList;
  };

  return ret;
}

function updateById(Module = {}) {
  const { submissions } = Module;

  const ret = async (id, attributes = {}) => {
    const submission = await submissions.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return submission;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    submissions: {
      helper: { paginate: pagination.attach(attachment) },
      model: attachment.db.postgres.models.submissions,
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
