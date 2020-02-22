const filesErrors = require('./files.errors');

function downloadRequest(Module = {}) {
  const { attachment, files } = Module;
  const { minio } = attachment;

  const ret = async (attributes = {}) => {
    try {
      await minio.object.stat(attributes);

      const file = await minio.presigned.downloadUrl(attributes);

      return file;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return files.errors.OBJECT_NOT_FOUND;
    }
  };

  return ret;
}

function objectList(Module = {}) {
  const { attachment, files } = Module;
  const { minio } = attachment;

  const ret = async bucketName => {
    if (!(await minio.bucket.isExists(bucketName))) {
      return files.errors.BUCKET_NOT_FOUND;
    }

    const objects = await minio.bucket.objects({ bucketName });

    return objects;
  };

  return ret;
}

function uploadRequest(Module = {}) {
  const { attachment, files } = Module;
  const { minio } = attachment;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    if (!(await minio.bucket.isExists(bucketName))) {
      return files.errors.BUCKET_NOT_FOUND;
    }

    const file = await minio.presigned.uploadUrl({ bucketName, objectName });

    if (!file) {
      return files.errors.SERVER_ERROR;
    }

    return file;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    files: { errors: filesErrors },
  };

  const functions = [downloadRequest, objectList, uploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
