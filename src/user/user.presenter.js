const httpStatus = require('http-status-codes');

const userCore = require('./user.core');
const userValidation = require('./user.validation');

function CreateUser(Module = {}) {
  const { user } = Module;

  const ret = async ctx => {
    const validateBody = user.validation.createUserSchema.validate(ctx.request.body);

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

    const { email, name, nim, password } = ctx.request.body;

    if (await user.core.isEmailRegistered(email)) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'email already registered',
        ok: false,
      };
      return;
    }

    const userCreation = await user.core.createUser({ email, name, nim, password });

    if (!userCreation) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    delete userCreation.password;

    ctx.status = httpStatus.CREATED;
    ctx.body = {
      code: httpStatus.CREATED,
      message: 'user created',
      ok: true,

      data: userCreation,
    };
  };

  return ret;
}

function UpdateUser(Module = {}) {
  const { user } = Module;

  const ret = async ctx => {
    const validateBody = user.validation.updateUserSchema.validate(ctx.request.body);
    const validateParams = user.validation.needUserId.validate(ctx.params);

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

    const userUpdation = await user.core.updateUser({ id: ctx.params.userId, ...ctx.request.body });

    if (!userUpdation) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    delete userUpdation.password;

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user updated',
      ok: true,

      data: userUpdation,
    };
  };

  return ret;
}

function GetListUser(Module = {}) {
  const { attachment, user } = Module;
  const { Op } = attachment.db.postgres.Sequelize;

  const ret = async ctx => {
    const validateQuery = user.validation.paginationQuery.validate(ctx.query);

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

    let users = {};
    const params = {
      model: 'users',
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
    };

    if (!ctx.query.name) {
      users = await user.core.getListUser(ctx, params);
    }

    const queryName = ctx.query.name;

    if (queryName) {
      users = await user.core.getListUser(ctx, {
        ...params,
        customParams: {
          name: queryName,
        },
        customQuery: {
          where: { name: { [Op.iLike]: `%${queryName}%` } },
        },
      });
    }

    users.data = users.data.map(elm => {
      const userData = elm;
      delete userData.password;

      return userData;
    });

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user loaded',
      ok: true,

      ...users,
    };
  };

  return ret;
}

function GetUserById(Module = {}) {
  const { user } = Module;

  const ret = async ctx => {
    const validateParams = user.validation.needUserId.validate(ctx.params);

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

    const userRetrieval = await user.core.findUserById(ctx.params.userId);
    delete userRetrieval.password;

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user loaded',
      ok: true,

      data: userRetrieval,
    };
  };

  return ret;
}

function DeleteUserById(Module = {}) {
  const { user } = Module;

  const ret = async ctx => {
    const validateParams = user.validation.needUserId.validate(ctx.params);

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

    const userDeletion = await user.core.deleteUserById(ctx.params.userId);

    if (userDeletion === 0) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'user not deleted',
        ok: false,
      };
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user deleted',
      ok: true,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    user: {
      core: userCore.attach(attachment),
      validation: userValidation,
    },
  };

  const functions = [CreateUser, UpdateUser, GetListUser, GetUserById, DeleteUserById];

  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
