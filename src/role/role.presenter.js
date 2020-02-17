const httpStatus = require('http-status-codes');

const roleCore = require('./role.core');
const roleErrors = require('./role.errors');
const roleValidation = require('./role.validation');

function AssignRoleToUser(Module = {}) {
  const { role } = Module;

  const ret = async ctx => {
    const validate = role.validation.roleAssignmentSchema.validate(ctx.request.body);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    const roleId = ctx.request.body.role_id;
    const userId = ctx.request.body.user_id;

    const userRoleUpdation = await role.core.assignRoleToUser({ roleId, userId });

    if (!userRoleUpdation) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'role assignment failed',
        ok: false,
      };
      return;
    }

    delete userRoleUpdation.user.password;

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user role updated',
      ok: true,

      data: userRoleUpdation,
    };
  };

  return ret;
}

function Create(Module = {}) {
  const { role } = Module;

  const ret = async ctx => {
    const validate = role.validation.roleCreationSchema.validate(ctx.request.body);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    const { deletable, name, rules } = ctx.request.body;
    const roleCreation = await role.core.createRole({ deletable, name, rules });

    if (!roleCreation) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'can not create role',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.CREATED;
    ctx.body = {
      code: httpStatus.CREATED,
      message: 'role created',
      ok: true,

      data: roleCreation.dataValues,
    };
  };

  return ret;
}

function DeleteById(Module = {}) {
  const { role } = Module;

  const ret = async ctx => {
    const validate = role.validation.roleDeletionSchema.validate(ctx.params);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    const { id } = ctx.params;

    const status = await role.core.isRoleDeletable(id);

    switch (status) {
      case role.errors.ROLE_NOT_EXISTS:
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = {
          code: httpStatus.NOT_FOUND,
          message: 'role not exists',
          ok: false,
        };
        break;
      case role.errors.ROLE_NOT_DELETABLE:
        ctx.status = httpStatus.FORBIDDEN;
        ctx.body = {
          code: httpStatus.FORBIDDEN,
          message: 'role not deletable',
          ok: false,
        };
        break;
      case role.errors.ROLE_DELETABLE:
        {
          const roleDeletion = await role.core.deleteRoleById(id);

          if (!roleDeletion) {
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
            message: 'role deleted',
            ok: true,
          };
        }
        break;
      default:
        ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = {
          code: httpStatus.INTERNAL_SERVER_ERROR,
          message: 'unkown error',
          ok: false,
        };
    }
  };

  return ret;
}

function GetById(Module = {}) {
  const { role } = Module;

  const ret = async ctx => {
    const validate = role.validation.roleFetchSchema.validate(ctx.params);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    const { id } = ctx.params;

    const roleRetrieval = await role.core.getRoleById(id);

    if (!roleRetrieval) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'role not found',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'role fetched',
      ok: true,

      data: roleRetrieval,
    };
  };

  return ret;
}

function GetList(Module = {}) {
  const { attachment, role } = Module;

  const { Sequelize } = attachment.db.postgres;
  const { Op } = Sequelize;

  const ret = async ctx => {
    const validate = role.validation.rolePaginationSchema.validate(ctx.query);

    if (validate.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validate.error,
        },
      };
      return;
    }

    let roles = {};
    const params = {
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
      model: 'roles',
    };

    if (!ctx.query.name) {
      roles = await role.core.getListRole(ctx, params);
    }

    const queryName = ctx.query.name;

    if (queryName) {
      roles = await role.core.getListRole(ctx, {
        ...params,
        customParams: {
          name: queryName,
        },
        customQuery: {
          where: { name: { [Op.iLike]: queryName } },
        },
      });
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'roles fetched',
      ok: true,

      ...roles,
    };
  };

  return ret;
}

function UpdateById(Module = {}) {
  const { role } = Module;

  const ret = async ctx => {
    const validateParam = role.validation.roleFetchSchema.validate(ctx.params);
    const validateBody = role.validation.roleUpdateSchema.validate(ctx.request.body);

    if (validateParam.error) {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        code: httpStatus.BAD_REQUEST,
        message: 'validation failed',
        ok: false,

        data: {
          error: validateParam.error,
        },
      };
      return;
    }

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

    const roleUpdation = await role.core.updateRoleById({ id: ctx.params.id, ...ctx.request.body });

    if (!roleUpdation) {
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
      message: 'role updated',
      ok: true,

      data: roleUpdation,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    role: {
      core: roleCore.attach(attachment),
      errors: roleErrors,
      validation: roleValidation,
    },
  };

  const functions = [AssignRoleToUser, Create, DeleteById, GetById, GetList, UpdateById];

  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
