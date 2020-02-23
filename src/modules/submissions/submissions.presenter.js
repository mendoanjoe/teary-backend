const httpStatus = require('http-status-codes');

const submissionsCore = require('./submissions.core');
const submissionsValidation = require('./submissions.validation');

function CreateSubmission(Module = {}) {
  const { submissions } = Module;

  const ret = async ctx => {
    const validateBody = submissions.validation.createSubmissionSchema.validate(ctx.request.body);

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

    const submission = await submissions.core.createSubmission(ctx.request.body);

    if (!submission) {
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
      message: 'submission created',
      ok: true,

      data: submission,
    };
  };

  return ret;
}

function DeleteSubmissionById(Module = {}) {
  const { submissions } = Module;

  const ret = async ctx => {
    const validateParams = submissions.validation.getSubmissionSchema.validate(ctx.params);

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

    const submission = await submissions.core.deleteSubmissionById(ctx.params.submissionId);

    if (submission === 0) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'submission not deleted',
        ok: false,
      };
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'submission deleted',
      ok: true,
    };
  };

  return ret;
}

function GetSubmissionList(Module = {}) {
  const { submissions } = Module;

  const ret = async ctx => {
    const validateQuery = submissions.validation.paginationQuery.validate(ctx.query);

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
      model: 'submissions',
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
    };
    const submissionList = await submissions.core.getSubmissionList(ctx, params);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'submissions loaded',
      ok: true,

      ...submissionList,
    };
  };

  return ret;
}

function GetSubmissionById(Module = {}) {
  const { submissions } = Module;

  const ret = async ctx => {
    const validateParams = submissions.validation.getSubmissionSchema.validate(ctx.params);

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

    const submission = await submissions.core.getSubmissionById(ctx.params.submissionId);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'submission loaded',
      ok: true,

      data: submission,
    };
  };

  return ret;
}

function UpdateSubmissionById(Module = {}) {
  const { submissions } = Module;

  const ret = async ctx => {
    const validateParams = submissions.validation.getSubmissionSchema.validate(ctx.params);

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

    const validateBody = submissions.validation.updateSubmissionSchema.validate(ctx.request.body);

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

    const submission = await submissions.core.updateSubmissionById({
      id: ctx.params.submissionId,

      ...ctx.request.body,
    });

    if (!submission) {
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
      message: 'submission updated',
      ok: true,

      data: submission,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    submissions: {
      core: submissionsCore.attach(attachment),
      validation: submissionsValidation,
    },
  };

  const functions = [
    CreateSubmission,
    DeleteSubmissionById,
    GetSubmissionById,
    GetSubmissionList,
    UpdateSubmissionById,
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
