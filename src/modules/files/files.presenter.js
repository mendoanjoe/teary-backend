const httpStatus = require('http-status-codes');

const filesCore = require('./files.core');
const filesErrors = require('./files.errors');
const filesValidation = require('./files.validation');

function GetDownloadRequest(Module = {}) {
  const { files } = Module;

  const ret = async ctx => {
    const validate = files.validation.getDownloadRequestSchema.validate(ctx.request.body);

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

    const { bucketName, objectName } = ctx.request.body;
    const file = await files.core.getDownloadRequest({ bucketName, objectName });

    if (file === files.errors.OBJECT_NOT_FOUND) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'file not found',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'file url fetched',
      ok: true,

      data: {
        url: file,
      },
    };
  };

  return ret;
}

function GetObjectList(Module = {}) {
  const { files } = Module;

  const ret = async ctx => {
    const validate = files.validation.getObjectListSchema.validate(ctx.params);

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

    const { bucketName } = ctx.params;
    const objects = await files.core.getObjectList(bucketName);

    if (objects === files.errors.BUCKET_NOT_FOUND) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'bucket not found',
        ok: false,
      };
      return;
    }

    ctx.status = httpStatus.OK;
    ctx.body = {
      code: httpStatus.OK,
      message: 'files fetched',
      ok: true,

      data: objects,
    };
  };

  return ret;
}

function GetUploadRequest(Module = {}) {
  const { files } = Module;

  const ret = async ctx => {
    const validate = files.validation.getUploadRequestSchema.validate(ctx.request.body);

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

    const { bucketName } = ctx.request.body;
    let { objectName } = ctx.request.body;

    const unixTimestamp = new Date().getTime();
    const splittedObjectName = objectName.split('.');
    const objectExtension = splittedObjectName.length === 1 ? '' : `.${splittedObjectName.pop()}`;
    const newObjectName = `${splittedObjectName.join(' ')}-${unixTimestamp}`;

    objectName = `${newObjectName}${objectExtension}`;

    const fileUploadRequest = await files.core.getUploadRequest({ bucketName, objectName });

    if (fileUploadRequest === files.errors.BUCKET_NOT_FOUND) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'bucket not found',
        ok: false,
      };
      return;
    }

    if (fileUploadRequest === files.errors.SERVER_ERROR) {
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
      message: 'upload url fetched',
      ok: true,

      data: {
        bucket_name: bucketName,
        object_name: objectName,
        url: fileUploadRequest,
      },
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    files: {
      core: filesCore.attach(attachment),
      errors: filesErrors,
      validation: filesValidation,
    },
  };

  const functions = [GetDownloadRequest, GetObjectList, GetUploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
