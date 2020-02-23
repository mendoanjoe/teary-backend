const httpStatus = require('http-status-codes');

const problemsCore = require('./../problems/problems.core');
const testcasesCore = require('./testcases.core');
const testcasesValidation = require('./testcases.validation');

function CreateTestcase(Module = {}) {
  const { problems, testcases } = Module;

  const ret = async ctx => {
    const validateBody = testcases.validation.createTestcaseSchema.validate(ctx.request.body);

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

    const problem = await problems.core.getProblemById(ctx.request.body.problem_id);

    if (!problem) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'problem not found',
        ok: false,
      };
      return;
    }

    const testcase = await testcases.core.createTestcase(ctx.request.body);

    if (!testcase) {
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
      message: 'testcase created',
      ok: true,

      data: testcase,
    };
  };

  return ret;
}

function DeleteTestcaseById(Module = {}) {
  const { testcases } = Module;

  const ret = async ctx => {
    const validateParams = testcases.validation.getTestcaseSchema.validate(ctx.params);

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

    let testcase = await testcases.core.getTestcaseById(ctx.params.testcaseId);

    if (!testcase) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'testcase not found',
        ok: false,
      };
      return;
    }

    testcase = await testcases.core.deleteTestcaseById(ctx.params.testcaseId);

    if (testcase === 0) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'testcase not deleted',
        ok: false,
      };
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'testcase deleted',
      ok: true,
    };
  };

  return ret;
}

function GetTestcaseList(Module = {}) {
  const { testcases } = Module;

  const ret = async ctx => {
    const validateQuery = testcases.validation.paginationQuery.validate(ctx.query);

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
      model: 'testcases',
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
    };
    const testcaseList = await testcases.core.getTestcaseList(ctx, params);

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'testcases loaded',
      ok: true,

      ...testcaseList,
    };
  };

  return ret;
}

function GetTestcaseById(Module = {}) {
  const { testcases } = Module;

  const ret = async ctx => {
    const validateParams = testcases.validation.getTestcaseSchema.validate(ctx.params);

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

    const testcase = await testcases.core.getTestcaseById(ctx.params.testcaseId);

    if (!testcase) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'testcase not found',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'testcase loaded',
      ok: true,

      data: testcase,
    };
  };

  return ret;
}

function UpdateTestcaseById(Module = {}) {
  const { testcases } = Module;

  const ret = async ctx => {
    const validateParams = testcases.validation.getTestcaseSchema.validate(ctx.params);

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

    const validateBody = testcases.validation.updateTestcaseSchema.validate(ctx.request.body);

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

    let testcase = await testcases.core.getTestcaseById(ctx.params.testcaseId);

    if (!testcase) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'testcase not found',
        ok: false,
      };
      return;
    }

    testcase = await testcases.core.updateTestcaseById({
      id: ctx.params.testcaseId,

      ...ctx.request.body,
    });

    if (!testcase) {
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
      message: 'testcase updated',
      ok: true,

      data: testcase,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    problems: {
      core: problemsCore.attach(attachment),
    },
    testcases: {
      core: testcasesCore.attach(attachment),
      validation: testcasesValidation,
    },
  };

  const functions = [
    CreateTestcase,
    DeleteTestcaseById,
    GetTestcaseById,
    GetTestcaseList,
    UpdateTestcaseById,
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
