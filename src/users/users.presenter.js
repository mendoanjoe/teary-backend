const httpStatus = require('http-status-codes');

const usersCore = require('./users.core');
const usersValidation = require('./users.validation');

function CreateUser(Module = {}) {
  const { users } = Module;

  const ret = async ctx => {
    const validateBody = users.validation.createUserSchema.validate(ctx.request.body);

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

    if (await users.core.isEmailRegistered(email)) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'email already registered',
        ok: false,
      };
      return;
    }

    const user = await users.core.createUser({ email, name, nim, password });

    if (!user) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    delete user.password;

    ctx.status = httpStatus.CREATED;
    ctx.body = {
      code: httpStatus.CREATED,
      message: 'user created',
      ok: true,

      data: user,
    };
  };

  return ret;
}

function UpdateUser(Module = {}) {
  const { users } = Module;

  const ret = async ctx => {
    const validateBody = users.validation.updateUserSchema.validate(ctx.request.body);
    const validateParams = users.validation.needUserId.validate(ctx.params);

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

    const user = await users.core.updateUser({ id: ctx.params.userId, ...ctx.request.body });

    if (!user) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
        ok: false,
      };
      return;
    }

    delete user.password;

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user updated',
      ok: true,

      data: user,
    };
  };

  return ret;
}

function GetListUser(Module = {}) {
  const { attachment, users } = Module;
  const { Op } = attachment.db.postgres.Sequelize;

  const ret = async ctx => {
    const validateQuery = users.validation.paginationQuery.validate(ctx.query);

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

    let userList = {};
    const params = {
      model: 'users',
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
    };

    if (!ctx.query.name) {
      userList = await users.core.getListUser(ctx, params);
    }

    const queryName = ctx.query.name;

    if (queryName) {
      userList = await users.core.getListUser(ctx, {
        ...params,
        customParams: {
          name: queryName,
        },
        customQuery: {
          where: { name: { [Op.iLike]: `%${queryName}%` } },
        },
      });
    }

    userList.data = userList.data.map(elm => {
      const user = elm;
      delete user.password;

      return user;
    });

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user loaded',
      ok: true,

      ...userList,
    };
  };

  return ret;
}

function GetUserById(Module = {}) {
  const { users } = Module;

  const ret = async ctx => {
    const validateParams = users.validation.needUserId.validate(ctx.params);

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

    const user = await users.core.findUserById(ctx.params.userId);
    delete user.password;

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user loaded',
      ok: true,

      data: user,
    };
  };

  return ret;
}

function DeleteUserById(Module = {}) {
  const { users } = Module;

  const ret = async ctx => {
    const validateParams = users.validation.needUserId.validate(ctx.params);

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

    const user = await users.core.deleteUserById(ctx.params.userId);

    if (user === 0) {
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

    users: {
      core: usersCore.attach(attachment),
      validation: usersValidation,
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
