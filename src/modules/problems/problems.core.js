const problemsStorage = require('./problems.storage');

function createProblem(Module = {}) {
  const { problems } = Module;

  const ret = async (attributes = {}) => {
    const problem = await problems.storage.create(attributes);

    return problem.dataValues;
  };

  return ret;
}

function deleteProblemById(Module = {}) {
  const { problems } = Module;

  const ret = async id => {
    const problem = await problems.storage.deleteById(id);

    return problem;
  };

  return ret;
}

function getProblemById(Module = {}) {
  const { problems } = Module;

  const ret = async id => {
    const problem = await problems.storage.getById(id);

    return problem;
  };

  return ret;
}

function getProblemList(Module = {}) {
  const { problems } = Module;

  const ret = async (ctx, attributes = {}) => {
    const problemList = await problems.storage.paginate(ctx, attributes);

    return problemList;
  };

  return ret;
}

function updateProblemById(Module = {}) {
  const { problems } = Module;

  const ret = async (attributes = {}) => {
    const { id } = attributes;
    const problem = await problems.storage.updateById(id, attributes);

    return problem[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    problems: { storage: problemsStorage.attach(attachment) },
  };

  const functions = [
    createProblem,
    deleteProblemById,
    getProblemById,
    getProblemList,
    updateProblemById,
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
