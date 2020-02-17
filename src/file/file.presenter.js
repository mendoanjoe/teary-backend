const httpStatus = require('http-status-codes');

const fileCore = require('./file.core');
const fileErrors = require('./file.errors');
const fileValidation = require('./file.validation');

function DownloadRequest(attachment = {}) {
  const { downloadRequest } = attachment.core;
  const { downloadRequestSchema } = fileValidation;

  const ret = async ctx => {
    const validate = downloadRequestSchema.validate(ctx.request.body);

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

    const file = await downloadRequest({ bucketName, objectName });

    if (file === fileErrors.OBJECT_NOT_FOUND) {
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

function ListObject(attachment = {}) {
  const { listObject } = attachment.core;
  const { listObjectSchema } = fileValidation;

  const ret = async ctx => {
    const validate = listObjectSchema.validate(ctx.params);

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

    const objects = await listObject(bucketName);

    if (objects === fileErrors.BUCKET_NOT_FOUND) {
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

function UploadRequest(attachment = {}) {
  const { uploadRequest } = attachment.core;
  const { uploadRequestSchema } = fileValidation;

  const ret = async ctx => {
    const validate = uploadRequestSchema.validate(ctx.request.body);

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

    const file = await uploadRequest({ bucketName, objectName });

    if (file === fileErrors.BUCKET_NOT_FOUND) {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = {
        code: httpStatus.NOT_FOUND,
        message: 'bucket not found',
        ok: false,
      };
      return;
    }

    if (file === fileErrors.SERVER_ERROR) {
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
        url: file,
      },
    };
  };

  return ret;
}

function attach(attachment = {}) {
  const newAttachment = attachment;
  newAttachment.core = fileCore.attach(attachment);

  const functions = [DownloadRequest, ListObject, UploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(newAttachment);
  });

  return ret;
}

module.exports = {
  attach,
};
