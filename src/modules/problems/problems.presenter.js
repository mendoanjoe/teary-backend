const httpStatus = require('http-status-codes');

const problemsCore = require('./problems.core');
const problemsValidation = require('./problems.validation');

function CreateProblem(Module = {}) {
  const { problems } = Module;

  const ret = async ctx => {
    const validateBody = problems.validation.createProblemSchema.validate(ctx.request.body);

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

    const problem = await problems.core.createProblem(ctx.request.body);

    if (!problem) {
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
      message: 'problem created',
      ok: true,

      data: problem,
    };
  };

  return ret;
}

function DeleteProblemById(Module = {}) {
  const { problems } = Module;

  const ret = async ctx => {
    const validateParams = problems.validation.getProblemSchema.validate(ctx.params);

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

    const problem = await problems.core.deleteProblemById(ctx.params.problemId);

    if (problem === 0) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'problem not deleted',
        ok: false,
      };
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'problem deleted',
      ok: true,
    };
  };

  return ret;
}

function GetProblemList(Module = {}) {
  const { problems } = Module;

  const ret = async ctx => {
    const validateQuery = problems.validation.paginationQuery.validate(ctx.query);

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
      model: 'problems',
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
    };
    const problemList = await problems.core.getProblemList(ctx, params);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'problems loaded',
      ok: true,

      ...problemList,
    };
  };

  return ret;
}

function GetProblemById(Module = {}) {
  const { problems } = Module;

  const ret = async ctx => {
    const validateParams = problems.validation.getProblemSchema.validate(ctx.params);

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

    const problem = await problems.core.getProblemById(ctx.params.problemId);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'problem loaded',
      ok: true,

      data: problem,
    };
  };

  return ret;
}

function UpdateProblemById(Module = {}) {
  const { problems } = Module;

  const ret = async ctx => {
    const validateParams = problems.validation.getProblemSchema.validate(ctx.params);

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

    const validateBody = problems.validation.updateProblemSchema.validate(ctx.request.body);

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

    const problem = await problems.core.updateProblemById({
      id: ctx.params.problemId,

      ...ctx.request.body,
    });

    if (!problem) {
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
      message: 'problem updated',
      ok: true,

      data: problem,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    problems: {
      core: problemsCore.attach(attachment),
      validation: problemsValidation,
    },
  };

  const functions = [
    CreateProblem,
    DeleteProblemById,
    GetProblemById,
    GetProblemList,
    UpdateProblemById,
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
