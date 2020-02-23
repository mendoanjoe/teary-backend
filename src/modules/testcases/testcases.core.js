const testcasesStorage = require('./testcases.storage');

function createTestcase(Module = {}) {
  const { testcases } = Module;

  const ret = async (attributes = {}) => {
    const testcase = await testcases.storage.create(attributes);

    return testcase.dataValues;
  };

  return ret;
}

function deleteTestcaseById(Module = {}) {
  const { testcases } = Module;

  const ret = async id => {
    const testcase = await testcases.storage.deleteById(id);

    return testcase;
  };

  return ret;
}

function getTestcaseById(Module = {}) {
  const { testcases } = Module;

  const ret = async id => {
    const testcase = await testcases.storage.getById(id);

    return testcase;
  };

  return ret;
}

function getTestcaseList(Module = {}) {
  const { testcases } = Module;

  const ret = async (ctx, attributes = {}) => {
    const testcaseList = await testcases.storage.paginate(ctx, attributes);

    return testcaseList;
  };

  return ret;
}

function updateTestcaseById(Module = {}) {
  const { testcases } = Module;

  const ret = async (attributes = {}) => {
    const { id } = attributes;
    const testcase = await testcases.storage.updateById(id, attributes);

    return testcase[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    testcases: { storage: testcasesStorage.attach(attachment) },
  };

  const functions = [
    createTestcase,
    deleteTestcaseById,
    getTestcaseById,
    getTestcaseList,
    updateTestcaseById,
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
