const httpStatus = require('http-status-codes');

const assignmentsCore = require('./assignments.core');
const assignmentsValidation = require('./assignments.validation');

function CreateAssignment(Module = {}) {
  const { assignments } = Module;

  const ret = async ctx => {
    const validateBody = assignments.validation.createAssignmentSchema.validate(ctx.request.body);

    if (validateBody.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateBody.error,
        },
      };
      return;
    }

    const assignment = await assignments.core.createAssignment(ctx.request.body);

    if (!assignment) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.CREATED;
    ctx.body = {
      code: httpStatus.CREATED,
      message: 'assignment created',
      ok: true,

      data: assignment,
    };
  };

  return ret;
}

function DeleteAssignmentById(Module = {}) {
  const { assignments } = Module;

  const ret = async ctx => {
    const validateParams = assignments.validation.getAssignmentSchema.validate(ctx.params);

    if (validateParams.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateParams.error,
        },
      };
      return;
    }

    const assignment = await assignments.core.deleteAssignmentById(ctx.params.assignmentId);

    if (assignment === 0) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'assignment not deleted',
        ok: false,
      };
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'assignment deleted',
      ok: true,
    };
  };

  return ret;
}

function GetAssignmentList(Module = {}) {
  const { assignments } = Module;

  const ret = async ctx => {
    const validateQuery = assignments.validation.paginationQuery.validate(ctx.query);

    if (validateQuery.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateQuery.error,
        },
      };
      return;
    }

    const params = {
      model: 'assignments',
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
    };
    const assignmentList = await assignments.core.getAssignmentList(ctx, params);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'assignments loaded',
      ok: true,

      ...assignmentList,
    };
  };

  return ret;
}

function GetAssignmentById(Module = {}) {
  const { assignments } = Module;

  const ret = async ctx => {
    const validateParams = assignments.validation.getAssignmentSchema.validate(ctx.params);

    if (validateParams.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateParams.error,
        },
      };
      return;
    }

    const assignment = await assignments.core.getAssignmentById(ctx.params.assignmentId);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'assignment loaded',
      ok: true,

      data: assignment,
    };
  };

  return ret;
}

function UpdateAssignmentById(Module = {}) {
  const { assignments } = Module;

  const ret = async ctx => {
    const validateParams = assignments.validation.getAssignmentSchema.validate(ctx.params);

    if (validateParams.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateParams.error,
        },
      };
      return;
    }

    const validateBody = assignments.validation.updateAssignmentSchema.validate(ctx.request.body);

    if (validateBody.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateBody.error,
        },
      };
      return;
    }

    const assignment = await assignments.core.updateAssignmentById({
      id: ctx.params.assignmentId,

      ...ctx.request.body,
    });

    if (!assignment) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'assignment updated',
      ok: true,

      data: assignment,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    assignments: {
      core: assignmentsCore.attach(attachment),
      validation: assignmentsValidation,
    },
  };

  const functions = [
    CreateAssignment,
    DeleteAssignmentById,
    GetAssignmentById,
    GetAssignmentList,
    UpdateAssignmentById,
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
