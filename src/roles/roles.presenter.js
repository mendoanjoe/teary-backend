const httpStatus = require('http-status-codes');

const rolesCore = require('./roles.core');
const rolesErrors = require('./roles.errors');
const rolesValidation = require('./roles.validation');

function AssignRoleToUser(Module = {}) {
  const { roles } = Module;

  const ret = async ctx => {
    const validate = roles.validation.roleAssignmentSchema.validate(ctx.request.body);

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

    const role = await roles.core.assignRoleToUser({ roleId, userId });

    if (!role) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'role assignment failed',
        ok: false,
      };
      return;
    }

    delete role.user.password;

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'user role updated',
      ok: true,

      data: role,
    };
  };

  return ret;
}

function Create(Module = {}) {
  const { roles } = Module;

  const ret = async ctx => {
    const validate = roles.validation.roleCreationSchema.validate(ctx.request.body);

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
    const role = await roles.core.createRole({ deletable, name, rules });

    if (!role) {
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

      data: role.dataValues,
    };
  };

  return ret;
}

function DeleteById(Module = {}) {
  const { roles } = Module;

  const ret = async ctx => {
    const validate = roles.validation.roleDeletionSchema.validate(ctx.params);

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
    const status = await roles.core.isRoleDeletable(id);

    switch (status) {
      case roles.errors.ROLE_NOT_EXISTS:
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = {
          code: httpStatus.NOT_FOUND,
          message: 'role not exists',
          ok: false,
        };
        break;
      case roles.errors.ROLE_NOT_DELETABLE:
        ctx.status = httpStatus.FORBIDDEN;
        ctx.body = {
          code: httpStatus.FORBIDDEN,
          message: 'role not deletable',
          ok: false,
        };
        break;
      case roles.errors.ROLE_DELETABLE:
        {
          const role = await roles.core.deleteRoleById(id);

          if (!role) {
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
  const { roles } = Module;

  const ret = async ctx => {
    const validate = roles.validation.roleFetchSchema.validate(ctx.params);

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
    const role = await roles.core.getRoleById(id);

    if (!role) {
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

      data: role,
    };
  };

  return ret;
}

function GetList(Module = {}) {
  const { attachment, roles } = Module;

  const { Sequelize } = attachment.db.postgres;
  const { Op } = Sequelize;

  const ret = async ctx => {
    const validate = roles.validation.rolePaginationSchema.validate(ctx.query);

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

    let roleList = {};
    const params = {
      currentPage: ctx.query.current_page,
      maxEntry: ctx.query.max_entry,
      model: 'roles',
    };

    if (!ctx.query.name) {
      roleList = await roles.core.getListRole(ctx, params);
    }

    const queryName = ctx.query.name;

    if (queryName) {
      roleList = await roles.core.getListRole(ctx, {
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

      ...roleList,
    };
  };

  return ret;
}

function UpdateById(Module = {}) {
  const { roles } = Module;

  const ret = async ctx => {
    const validateParam = roles.validation.roleFetchSchema.validate(ctx.params);
    const validateBody = roles.validation.roleUpdateSchema.validate(ctx.request.body);

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

    const role = await roles.core.updateRoleById({ id: ctx.params.id, ...ctx.request.body });

    if (!role) {
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

      data: role,
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    roles: {
      core: rolesCore.attach(attachment),
      errors: rolesErrors,
      validation: rolesValidation,
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
