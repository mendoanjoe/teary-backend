const submissionsStorage = require('./submissions.storage');

function createSubmission(Module = {}) {
  const { submissions } = Module;

  const ret = async (attributes = {}) => {
    const submission = await submissions.storage.create(attributes);

    return submission.dataValues;
  };

  return ret;
}

function deleteSubmissionById(Module = {}) {
  const { submissions } = Module;

  const ret = async id => {
    const submission = await submissions.storage.deleteById(id);

    return submission;
  };

  return ret;
}

function getSubmissionById(Module = {}) {
  const { submissions } = Module;

  const ret = async id => {
    const submission = await submissions.storage.getById(id);

    return submission;
  };

  return ret;
}

function getSubmissionList(Module = {}) {
  const { submissions } = Module;

  const ret = async (ctx, attributes = {}) => {
    const submissionList = await submissions.storage.paginate(ctx, attributes);

    return submissionList;
  };

  return ret;
}

function updateSubmissionById(Module = {}) {
  const { submissions } = Module;

  const ret = async (attributes = {}) => {
    const { id } = attributes;
    const submission = await submissions.storage.updateById(id, attributes);

    return submission[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    submissions: { storage: submissionsStorage.attach(attachment) },
  };

  const functions = [
    createSubmission,
    deleteSubmissionById,
    getSubmissionById,
    getSubmissionList,
    updateSubmissionById,
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
