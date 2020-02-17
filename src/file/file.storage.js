const errors = require('./file.errors');

function downloadRequest(File) {
  const ret = async (attributes = {}) => {
    try {
      await File.object.stat({ ...attributes });

      const file = await File.presigned.downloadUrl({ ...attributes });

      return file;
    } catch (_) {
      return errors.OBJECT_NOT_FOUND;
    }
  };

  return ret;
}

function listObject(File) {
  const ret = async bucketName => {
    if (!(await File.bucket.isExists(bucketName))) {
      return errors.BUCKET_NOT_FOUND;
    }

    const objects = await File.bucket.objects({ bucketName });

    return objects;
  };

  return ret;
}

function uploadRequest(File) {
  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;

    if (!(await File.bucket.isExists(bucketName))) {
      return errors.BUCKET_NOT_FOUND;
    }

    const file = await File.presigned.uploadUrl({ bucketName, objectName });

    if (!file) {
      return errors.SERVER_ERROR;
    }

    return file;
  };

  return ret;
}

function attach(attachment = {}) {
  const File = attachment.minio;

  const functions = [downloadRequest, listObject, uploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(File);
  });

  return ret;
}

module.exports = {
  attach,
};
