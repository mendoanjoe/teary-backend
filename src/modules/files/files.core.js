const filesStorage = require('./files.storage');

function getDownloadRequest(Module = {}) {
  const { files } = Module;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;
    const file = await files.storage.downloadRequest({ bucketName, objectName });

    return file;
  };

  return ret;
}

function getObjectList(Module = {}) {
  const { files } = Module;

  const ret = async bucketName => {
    const file = await files.storage.objectList(bucketName);

    return file;
  };

  return ret;
}

function getUploadRequest(Module = {}) {
  const { files } = Module;

  const ret = async (attributes = {}) => {
    const { bucketName, objectName } = attributes;
    const file = await files.storage.uploadRequest({ bucketName, objectName });

    return file;
  };

  return ret;
}

function attach(attachment = {}) {
  const Module = {
    attachment,

    files: { storage: filesStorage.attach(attachment) },
  };

  const functions = [getDownloadRequest, getObjectList, getUploadRequest];
  const ret = {};

  functions.forEach(fn => {
    ret[fn.name] = fn(Module);
  });

  return ret;
}

module.exports = {
  attach,
};
