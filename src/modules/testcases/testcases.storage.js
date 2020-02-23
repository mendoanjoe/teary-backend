const pagination = require('../../../helper/pagination');

function create(Module = {}) {
  const { testcases } = Module;

  const ret = async (attributes = {}) => {
    const testcase = await testcases.model.create(attributes);

    return testcase;
  };

  return ret;
}

function deleteById(Module = {}) {
  const { testcases } = Module;

  const ret = async id => {
    const testcase = await testcases.model.destroy({ where: { id } });

    return testcase;
  };

  return ret;
}

function getById(Module = {}) {
  const { testcases } = Module;

  const ret = async id => {
    const testcase = await testcases.model.findOne({ where: { id } });

    return testcase;
  };

  return ret;
}

function paginate(Module = {}) {
  const { testcases } = Module;

  const ret = async (ctx, attributes = {}) => {
    const testcaseList = await testcases.helper.paginate(ctx, attributes);

    return testcaseList;
  };

  return ret;
}

function updateById(Module = {}) {
  const { testcases } = Module;

  const ret = async (id, attributes = {}) => {
    const testcase = await testcases.model.update(attributes, {
      where: { id },
      returning: true,
      plain: true,
    });

    return testcase;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    testcases: {
      helper: { paginate: pagination.attach(attachment) },
      model: attachment.db.postgres.models.testcases,
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
