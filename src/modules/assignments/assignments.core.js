const assignmentsStorage = require('./assignments.storage');

function createAssignment(Module = {}) {
  const { assignments } = Module;

  const ret = async (attributes = {}) => {
    const assignment = await assignments.storage.create(attributes);

    return assignment.dataValues;
  };

  return ret;
}

function deleteAssignmentById(Module = {}) {
  const { assignments } = Module;

  const ret = async id => {
    const assignment = await assignments.storage.deleteById(id);

    return assignment;
  };

  return ret;
}

function getAssignmentById(Module = {}) {
  const { assignments } = Module;

  const ret = async id => {
    const assignment = await assignments.storage.getById(id);

    return assignment;
  };

  return ret;
}

function getAssignmentList(Module = {}) {
  const { assignments } = Module;

  const ret = async (ctx, attributes = {}) => {
    const assignmentList = await assignments.storage.paginate(ctx, attributes);

    return assignmentList;
  };

  return ret;
}

function updateAssignmentById(Module = {}) {
  const { assignments } = Module;

  const ret = async (attributes = {}) => {
    const { id } = attributes;
    const assignment = await assignments.storage.updateById(id, attributes);

    return assignment[1];
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    assignments: { storage: assignmentsStorage.attach(attachment) },
  };

  const functions = [
    createAssignment,
    deleteAssignmentById,
    getAssignmentById,
    getAssignmentList,
    updateAssignmentById,
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
